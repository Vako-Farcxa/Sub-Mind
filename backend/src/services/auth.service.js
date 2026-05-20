const crypto = require("crypto");
const { google } = require("googleapis");
const { env } = require("../config/env");
const { createGoogleOAuthClient } = require("../integrations/google/oauth.client");
const { oauthAccountRepository } = require("../repositories/oauth-account.repository");
const { userRepository } = require("../repositories/user.repository");
const { AppError } = require("../utils/appError");
const { comparePassword, hashPassword } = require("../utils/password");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt");

const GOOGLE_AUTH_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
];

const buildAuthPayload = (user) => ({
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  },
  tokens: {
    accessToken: signAccessToken({ sub: user.id, email: user.email }),
    refreshToken: signRefreshToken({ sub: user.id }),
  },
});

const cookieOptions = {
  httpOnly: true,
  sameSite: env.COOKIE_SAME_SITE || (env.NODE_ENV === "production" ? "none" : "lax"),
  secure: env.COOKIE_SECURE ?? env.NODE_ENV === "production",
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
};

const oauthStateCookieOptions = {
  ...cookieOptions,
  maxAge: 10 * 60 * 1000,
};

const normalizeGoogleProfile = (profile) => {
  if (!profile.id || !profile.email) {
    throw new AppError("Google did not return the required profile fields", 502);
  }

  return {
    providerAccountId: profile.id,
    email: profile.email.toLowerCase(),
    name: profile.name,
    avatarUrl: profile.picture,
  };
};

const ensureSessionSecrets = () => {
  if (!env.JWT_ACCESS_SECRET || !env.JWT_REFRESH_SECRET) {
    throw new AppError("JWT secrets are not configured", 500);
  }
};

const authService = {
  getCookieOptions() {
    return cookieOptions;
  },

  getOAuthStateCookieOptions() {
    return oauthStateCookieOptions;
  },

  createOAuthState() {
    return crypto.randomBytes(32).toString("hex");
  },

  getGoogleAuthorizationUrl(state) {
    ensureSessionSecrets();

    const oauthClient = createGoogleOAuthClient();

    return oauthClient.generateAuthUrl({
      access_type: "offline",
      include_granted_scopes: true,
      prompt: "consent",
      scope: GOOGLE_AUTH_SCOPES,
      state,
    });
  },

  async register({ email, password, name }) {
    ensureSessionSecrets();

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError("A user with this email already exists", 409);
    }

    const user = await userRepository.create({
      email,
      name,
      passwordHash: await hashPassword(password),
    });

    return buildAuthPayload(user);
  },

  async login({ email, password }) {
    ensureSessionSecrets();

    const user = await userRepository.findByEmail(email);

    if (!user?.passwordHash) {
      throw new AppError("Invalid email or password", 401);
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    return buildAuthPayload(user);
  },

  async handleGoogleCallback({ code, state, expectedState }) {
    ensureSessionSecrets();

    if (!expectedState || state !== expectedState) {
      throw new AppError("Invalid Google OAuth state", 400);
    }

    const oauthClient = createGoogleOAuthClient();
    const { tokens } = await oauthClient.getToken(code);
    oauthClient.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauthClient });
    const { data: googleProfile } = await oauth2.userinfo.get();
    const profile = normalizeGoogleProfile(googleProfile);

    const user = await userRepository.upsertOAuthUser({
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
    });

    await oauthAccountRepository.upsertGoogleAccount({
      userId: user.id,
      providerAccountId: profile.providerAccountId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      scope: tokens.scope,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
    });

    return buildAuthPayload(user);
  },

  async refreshSession(refreshToken) {
    ensureSessionSecrets();

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw new AppError("Authenticated user no longer exists", 401);
    }

    return buildAuthPayload(user);
  },

  async getCurrentUser(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    };
  },
};

module.exports = {
  authService,
};
