const { env } = require("./config/env");
const { prisma } = require("./db/prisma");
const { app } = require("./app");

const server = app.listen(env.PORT, () => {
  console.log(`SubMind API listening on port ${env.PORT}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down API server.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
