const { google } = require("googleapis");

const createGmailClient = (authClient) => google.gmail({ version: "v1", auth: authClient });

module.exports = {
  createGmailClient,
};
