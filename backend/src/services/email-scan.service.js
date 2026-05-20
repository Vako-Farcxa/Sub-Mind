const { createGmailClient } = require("../integrations/gmail/gmail.client");
const { createGoogleOAuthClient } = require("../integrations/google/oauth.client");
const { emailScanRepository } = require("../repositories/email-scan.repository");
const { oauthAccountRepository } = require("../repositories/oauth-account.repository");
const { providerRepository } = require("../repositories/provider.repository");
const { AppError } = require("../utils/appError");
const { detectedSubscriptionService } = require("./detected-subscription.service");
const {
  buildSubscriptionSearchQuery,
  extractMessagePreview,
  normalizeScanOptions,
} = require("./gmail-query.service");
const { detectSubscriptionsFromMessages } = require("./subscription-detection.service");

const serializeScan = (scan) => ({
  ...scan,
  startedAt: scan.startedAt?.toISOString?.() || scan.startedAt || null,
  completedAt: scan.completedAt?.toISOString?.() || scan.completedAt || null,
  createdAt: scan.createdAt?.toISOString?.() || scan.createdAt,
  updatedAt: scan.updatedAt?.toISOString?.() || scan.updatedAt,
});

const createOAuthClientForAccount = (account) => {
  const oauthClient = createGoogleOAuthClient();

  oauthClient.setCredentials({
    access_token: account.accessToken,
    refresh_token: account.refreshToken,
    scope: account.scope,
    expiry_date: account.expiresAt ? account.expiresAt.getTime() : undefined,
  });

  oauthClient.on("tokens", (tokens) => {
    oauthAccountRepository
      .updateTokens(account.id, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        scope: tokens.scope,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      })
      .catch((error) => {
        console.warn("Failed to persist refreshed Google OAuth tokens", error);
      });
  });

  return oauthClient;
};

const fetchMessagePreviews = async (gmail, messageRefs) => {
  const messageResponses = await Promise.all(
    messageRefs.map((message) =>
      gmail.users.messages.get({
        userId: "me",
        id: message.id,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      }),
    ),
  );

  return messageResponses.map((response) => extractMessagePreview(response.data));
};

const emailScanService = {
  async list(userId, { limit } = {}) {
    const scans = await emailScanRepository.listByUser(userId, Math.min(Number(limit) || 10, 25));

    return scans.map(serializeScan);
  },

  async getById(userId, scanId) {
    const scan = await emailScanRepository.findByIdForUser(scanId, userId);

    if (!scan) {
      throw new AppError("Email scan not found", 404);
    }

    return serializeScan(scan);
  },

  async startGmailScan(userId, options = {}) {
    const googleAccount = await oauthAccountRepository.findGoogleAccountByUserId(userId);

    if (!googleAccount?.refreshToken && !googleAccount?.accessToken) {
      throw new AppError("Connect Google before scanning Gmail", 409);
    }

    const normalizedOptions = normalizeScanOptions(options);
    const query = buildSubscriptionSearchQuery(normalizedOptions);
    const queuedScan = await emailScanRepository.createQueued({ userId, query });

    try {
      await emailScanRepository.markRunning(queuedScan.id);

      const oauthClient = createOAuthClientForAccount(googleAccount);
      const gmail = createGmailClient(oauthClient);
      const listResponse = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults: normalizedOptions.maxResults,
      });
      const messageRefs = listResponse.data.messages || [];
      const messagePreviews = await fetchMessagePreviews(gmail, messageRefs);
      const providerCatalog = await providerRepository.listCatalog();
      const detectedSubscriptions = detectSubscriptionsFromMessages(
        messagePreviews,
        providerCatalog,
      );
      const savedDetections = await detectedSubscriptionService.persistDetections(
        userId,
        queuedScan.id,
        detectedSubscriptions,
      );
      const completedScan = await emailScanRepository.markCompleted(queuedScan.id, {
        scannedCount: messagePreviews.length,
        detectedCount: savedDetections.length,
      });

      return {
        scan: serializeScan(completedScan),
        messages: messagePreviews,
        detections: savedDetections,
      };
    } catch (error) {
      const failedScan = await emailScanRepository.markFailed(
        queuedScan.id,
        error.message || "Gmail scan failed",
      );

      return {
        scan: serializeScan(failedScan),
        messages: [],
        detections: [],
      };
    }
  },
};

module.exports = {
  emailScanService,
};
