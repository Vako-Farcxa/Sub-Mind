const { ZodError } = require("zod");
const { AppError } = require("../utils/appError");

const notFoundMiddleware = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: err.flatten(),
    });
  }

  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || statusCode < 500;

  return res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : "Internal server error",
    ...(err.details ? { details: err.details } : {}),
  });
};

module.exports = {
  errorMiddleware,
  notFoundMiddleware,
};
