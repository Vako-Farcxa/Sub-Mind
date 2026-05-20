const {
  detectedSubscriptionRepository,
} = require("../repositories/detected-subscription.repository");
const { providerRepository } = require("../repositories/provider.repository");
const { subscriptionRepository } = require("../repositories/subscription.repository");
const { AppError } = require("../utils/appError");
const { parseSenderDomain } = require("./subscription-detection.service");
const { serializeSubscription } = require("./subscription.service");

const serializeDetectedSubscription = (detection) => ({
  ...detection,
  amount:
    detection.amount === null || detection.amount === undefined ? null : Number(detection.amount),
  renewalDate: detection.renewalDate?.toISOString?.() || detection.renewalDate || null,
  confirmedAt: detection.confirmedAt?.toISOString?.() || detection.confirmedAt || null,
  dismissedAt: detection.dismissedAt?.toISOString?.() || detection.dismissedAt || null,
  createdAt: detection.createdAt?.toISOString?.() || detection.createdAt,
  updatedAt: detection.updatedAt?.toISOString?.() || detection.updatedAt,
});

const serializeDetectionInput = (input) => ({
  ...input,
  amount: input.amount === null || input.amount === undefined ? null : input.amount.toString(),
  renewalDate: input.renewalDate ? new Date(input.renewalDate) : null,
});

const buildSubscriptionInput = (detection, overrides = {}) => {
  const amount = overrides.amount ?? (detection.amount === null ? null : Number(detection.amount));
  const billingCycle = overrides.billingCycle ?? detection.billingCycle;
  const currency = overrides.currency ?? detection.currency ?? "USD";
  const renewalDate = overrides.renewalDate ?? detection.renewalDate;

  if (!amount || !billingCycle || !renewalDate) {
    throw new AppError(
      "Detected subscription needs amount, billing cycle, and renewal date before confirmation",
      422,
    );
  }

  return {
    name: overrides.name ?? detection.name,
    provider: overrides.provider ?? detection.provider,
    category: overrides.category ?? detection.category ?? "Other",
    amount: amount.toString(),
    billingCycle,
    currency,
    renewalDate: new Date(renewalDate),
    status: overrides.status ?? "ACTIVE",
    source: "gmail",
  };
};

const shouldLearnSenderDomain = (detection) => {
  const domain = parseSenderDomain(detection.sender);

  if (!domain) {
    return null;
  }

  const isMarketplaceSender =
    domain === "google.com" && /google play/i.test(detection.sender || detection.subject || "");

  return isMarketplaceSender ? null : domain;
};

const detectedSubscriptionService = {
  async list(userId, filters) {
    const detections = await detectedSubscriptionRepository.listByUser(userId, filters);

    return detections.map(serializeDetectedSubscription);
  },

  async persistDetections(userId, emailScanId, detections) {
    const savedDetections = await Promise.all(
      detections.map((detection) =>
        detectedSubscriptionRepository.upsertDetection(
          serializeDetectionInput({
            ...detection,
            userId,
            emailScanId,
          }),
        ),
      ),
    );

    return savedDetections.map(serializeDetectedSubscription);
  },

  async confirm(userId, detectionId, overrides = {}) {
    const detection = await detectedSubscriptionRepository.findByIdForUser(detectionId, userId);

    if (!detection) {
      throw new AppError("Detected subscription not found", 404);
    }

    if (detection.confirmedAt) {
      throw new AppError("Detected subscription is already confirmed", 409);
    }

    if (detection.dismissedAt) {
      throw new AppError("Dismissed detections cannot be confirmed", 409);
    }

    const subscription = await subscriptionRepository.create({
      ...buildSubscriptionInput(detection, overrides),
      userId,
    });
    await providerRepository.upsertProvider({
      name: overrides.provider ?? detection.provider,
      category: overrides.category ?? detection.category ?? "Other",
      alias: overrides.name ?? detection.name,
      domain: shouldLearnSenderDomain(detection),
    });
    const confirmedDetection = await detectedSubscriptionRepository.markConfirmed(detection.id);

    return {
      detection: serializeDetectedSubscription(confirmedDetection),
      subscription: serializeSubscription(subscription),
    };
  },

  async dismiss(userId, detectionId) {
    const detection = await detectedSubscriptionRepository.findByIdForUser(detectionId, userId);

    if (!detection) {
      throw new AppError("Detected subscription not found", 404);
    }

    if (detection.confirmedAt) {
      throw new AppError("Confirmed detections cannot be dismissed", 409);
    }

    const dismissedDetection = await detectedSubscriptionRepository.markDismissed(detection.id);

    return serializeDetectedSubscription(dismissedDetection);
  },
};

module.exports = {
  detectedSubscriptionService,
  serializeDetectedSubscription,
};
