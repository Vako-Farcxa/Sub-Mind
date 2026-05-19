const { sendSuccess } = require("../utils/apiResponse");

const healthController = {
  check(req, res) {
    return sendSuccess(res, {
      service: "sub-mind-api",
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  },
};

module.exports = {
  healthController,
};
