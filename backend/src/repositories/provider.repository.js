const { getPrisma } = require("../db/prisma");

const normalizeCatalogValue = (value) => value.trim().toLowerCase();

const providerRepository = {
  listCatalog() {
    const prisma = getPrisma();

    return prisma.provider.findMany({
      include: {
        aliases: true,
        domains: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },

  async upsertProvider({ name, category = "Other", alias, domain }) {
    const prisma = getPrisma();
    const provider = await prisma.provider.upsert({
      where: { name },
      update: { category },
      create: { name, category },
    });

    if (alias) {
      await prisma.providerAlias.upsert({
        where: {
          providerId_value: {
            providerId: provider.id,
            value: normalizeCatalogValue(alias),
          },
        },
        update: {},
        create: {
          providerId: provider.id,
          value: normalizeCatalogValue(alias),
        },
      });
    }

    if (domain) {
      await prisma.providerDomain.upsert({
        where: {
          providerId_domain: {
            providerId: provider.id,
            domain: normalizeCatalogValue(domain),
          },
        },
        update: {},
        create: {
          providerId: provider.id,
          domain: normalizeCatalogValue(domain),
        },
      });
    }

    return provider;
  },
};

module.exports = {
  normalizeCatalogValue,
  providerRepository,
};
