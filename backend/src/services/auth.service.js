const { env } = require("../config/env");
const { userRepository } = require("../repositories/user.repository");
const { AppError } = require("../utils/appError");
const { comparePassword, hashPassword } = require("../utils/password");
const { signAccessToken, signRefreshToken } = require("../utils/jwt");

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
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
};

const authService = {
  getCookieOptions() {
    return cookieOptions;
  },

  async register({ email, password, name }) {
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
