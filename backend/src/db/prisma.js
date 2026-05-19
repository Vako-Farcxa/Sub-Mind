const { PrismaPg } = require("@prisma/adapter-pg");
const { AppError } = require("../utils/appError");

const globalForPrisma = global;

const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    throw new AppError("DATABASE_URL is not configured", 500);
  }

  const { PrismaClient } = require("@prisma/client");
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const getPrisma = () => {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
};

const disconnectPrisma = async () => {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect();
  }
};

module.exports = {
  disconnectPrisma,
  getPrisma,
};
