const { userRepository } = require("../repositories/user.repository");
const { AppError } = require("../utils/appError");
const { verifyAccessToken } = require("../utils/jwt");

const getBearerToken = (req) => {
  const header = req.headers.authorization;

  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length);
  }

  return req.cookies?.accessToken;
};

const requireAuth = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      throw new AppError("Authenticated user no longer exists", 401);
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  requireAuth,
};
