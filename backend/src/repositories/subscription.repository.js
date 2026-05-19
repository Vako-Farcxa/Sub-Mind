const { prisma } = require("../db/prisma");

const subscriptionRepository = {
  listByUser(userId, filters = {}) {
    return prisma.subscription.findMany({
      where: {
        userId,
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.category ? { category: filters.category } : {}),
      },
      orderBy: [{ renewalDate: "asc" }, { name: "asc" }],
    });
  },

  findByIdForUser(id, userId) {
    return prisma.subscription.findFirst({
      where: { id, userId },
    });
  },

  create(data) {
    return prisma.subscription.create({ data });
  },

  update(id, data) {
    return prisma.subscription.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    return prisma.subscription.delete({
      where: { id },
    });
  },
};

module.exports = {
  subscriptionRepository,
};
