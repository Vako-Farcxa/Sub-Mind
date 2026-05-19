const { prisma } = require("../db/prisma");

const userRepository = {
  findById(id) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  },

  create(data) {
    return prisma.user.create({ data });
  },

  upsertOAuthUser({ email, name, avatarUrl }) {
    return prisma.user.upsert({
      where: { email },
      update: { name, avatarUrl },
      create: { email, name, avatarUrl },
    });
  },
};

module.exports = {
  userRepository,
};
