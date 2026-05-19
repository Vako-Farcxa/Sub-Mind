const { getPrisma } = require("../db/prisma");

const oauthAccountRepository = {
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
};

module.exports = {
  oauthAccountRepository,
};
