const { getPrisma } = require("../db/prisma");

const oauthAccountRepository = {
  findGoogleAccountByUserId(userId) {
    const prisma = getPrisma();

    return prisma.oAuthAccount.findFirst({
      where: {
        userId,
        provider: "GOOGLE",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  upsertGoogleAccount({ userId, providerAccountId, accessToken, refreshToken, scope, expiresAt }) {
    const prisma = getPrisma();

    return prisma.oAuthAccount.upsert({
      where: {
        provider_providerAccountId: {
          provider: "GOOGLE",
          providerAccountId,
        },
      },
      update: {
        userId,
        accessToken,
        refreshToken,
        scope,
        expiresAt,
      },
      create: {
        userId,
        provider: "GOOGLE",
        providerAccountId,
        accessToken,
        refreshToken,
        scope,
        expiresAt,
      },
    });
  },

  updateTokens(id, { accessToken, refreshToken, scope, expiresAt }) {
    const prisma = getPrisma();
    const data = {};

    if (accessToken !== undefined) {
      data.accessToken = accessToken;
    }

    if (refreshToken !== undefined) {
      data.refreshToken = refreshToken;
    }

    if (scope !== undefined) {
      data.scope = scope;
    }

    if (expiresAt !== undefined) {
      data.expiresAt = expiresAt;
    }

    return prisma.oAuthAccount.update({
      where: { id },
      data,
    });
  },
};

module.exports = {
  oauthAccountRepository,
};
