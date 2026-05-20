const { env } = require("../config/env");
const { authService } = require("../services/auth.service");
const { AppError } = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");

const setAuthCookies = (res, tokens) => {
  const options = authService.getCookieOptions();

  res.cookie("accessToken", tokens.accessToken, {
    ...options,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", tokens.refreshToken, {
    ...options,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const authController = {
  startGoogleLogin(req, res) {
    const state = authService.createOAuthState();
    const authorizationUrl = authService.getGoogleAuthorizationUrl(state);

    res.cookie("googleOAuthState", state, authService.getOAuthStateCookieOptions());
    return res.redirect(authorizationUrl);
  },

  async googleCallback(req, res) {
    const result = await authService.handleGoogleCallback({
      code: req.validated.query.code,
      state: req.validated.query.state,
      expectedState: req.cookies?.googleOAuthState,
    });

    setAuthCookies(res, result.tokens);
    res.clearCookie("googleOAuthState", authService.getCookieOptions());

    return res.redirect(`${env.FRONTEND_URL}/dashboard`);
  },

  async register(req, res) {
    const result = await authService.register(req.validated.body);
    setAuthCookies(res, result.tokens);

    return sendSuccess(res, result.user, 201);
  },

  async login(req, res) {
    const result = await authService.login(req.validated.body);
    setAuthCookies(res, result.tokens);

    return sendSuccess(res, result.user);
  },

  async me(req, res) {
    const user = await authService.getCurrentUser(req.user.id);

    return sendSuccess(res, user);
  },

  async refresh(req, res) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }

    const result = await authService.refreshSession(refreshToken);
    setAuthCookies(res, result.tokens);

    return sendSuccess(res, result.user);
  },

  logout(req, res) {
    const options = authService.getCookieOptions();
    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return sendSuccess(res, { loggedOut: true });
  },
};

module.exports = {
  authController,
};
