const { authService } = require("../services/auth.service");
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
