const sendSuccess = (res, data, statusCode = 200, meta = undefined) =>
  res.status(statusCode).json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });

module.exports = {
  sendSuccess,
};
