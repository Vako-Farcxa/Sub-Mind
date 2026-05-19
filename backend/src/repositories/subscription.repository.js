const { getPrisma } = require("../db/prisma");

const subscriptionRepository = {
  listByUser(userId, filters = {}) {
    const prisma = getPrisma();

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
    const prisma = getPrisma();

    return prisma.subscription.findFirst({
      where: { id, userId },
    });
  },

  create(data) {
    const prisma = getPrisma();

    return prisma.subscription.create({ data });
  },

  update(id, data) {
    const prisma = getPrisma();

    return prisma.subscription.update({
      where: { id },
      data,
    });
  },

  delete(id) {
    const prisma = getPrisma();

    return prisma.subscription.delete({
      where: { id },
    });
  },
};

module.exports = {
  subscriptionRepository,
};
