const { getPrisma } = require("../db/prisma");

const emailScanRepository = {
  listByUser(userId, limit = 10) {
    const prisma = getPrisma();

    return prisma.emailScan.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  findByIdForUser(id, userId) {
    const prisma = getPrisma();

    return prisma.emailScan.findFirst({
      where: { id, userId },
    });
  },

  createQueued({ userId, query }) {
    const prisma = getPrisma();

    return prisma.emailScan.create({
      data: {
        userId,
        query,
        status: "QUEUED",
      },
    });
  },

  markRunning(id) {
    const prisma = getPrisma();

    return prisma.emailScan.update({
      where: { id },
      data: {
        status: "RUNNING",
        startedAt: new Date(),
        errorMessage: null,
      },
    });
  },

  markCompleted(id, { scannedCount, detectedCount = 0 }) {
    const prisma = getPrisma();

    return prisma.emailScan.update({
      where: { id },
      data: {
        status: "COMPLETED",
        scannedCount,
        detectedCount,
        completedAt: new Date(),
      },
    });
  },

  markFailed(id, errorMessage) {
    const prisma = getPrisma();

    return prisma.emailScan.update({
      where: { id },
      data: {
        status: "FAILED",
        errorMessage,
        completedAt: new Date(),
      },
    });
  },
};

module.exports = {
  emailScanRepository,
};
