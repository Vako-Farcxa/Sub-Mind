const { getPrisma } = require("../db/prisma");

const userRepository = {
  findById(id) {
    const prisma = getPrisma();

    return prisma.user.findUnique({ where: { id } });
  },

  findByEmail(email) {
    const prisma = getPrisma();

    return prisma.user.findUnique({ where: { email } });
  },

  create(data) {
    const prisma = getPrisma();

    return prisma.user.create({ data });
  },

  upsertOAuthUser({ email, name, avatarUrl }) {
    const prisma = getPrisma();

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
