const { emailScanService } = require("../services/email-scan.service");
const { sendSuccess } = require("../utils/apiResponse");

const emailScanController = {
  async list(req, res) {
    const scans = await emailScanService.list(req.user.id, req.validated.query);

    return sendSuccess(res, scans);
  },

  async getById(req, res) {
    const scan = await emailScanService.getById(req.user.id, req.validated.params.id);

    return sendSuccess(res, scan);
  },

  async create(req, res) {
    const result = await emailScanService.startGmailScan(req.user.id, req.validated.body);

    return sendSuccess(res, result, 201);
  },
};

module.exports = {
  emailScanController,
};
