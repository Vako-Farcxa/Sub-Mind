-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Other',
    "logoUrl" TEXT,
    "confidenceWeight" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderAlias" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderDomain" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderDomain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Provider_name_key" ON "Provider"("name");

-- CreateIndex
CREATE INDEX "Provider_name_idx" ON "Provider"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderAlias_providerId_value_key" ON "ProviderAlias"("providerId", "value");

-- CreateIndex
CREATE INDEX "ProviderAlias_value_idx" ON "ProviderAlias"("value");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderDomain_providerId_domain_key" ON "ProviderDomain"("providerId", "domain");

-- CreateIndex
CREATE INDEX "ProviderDomain_domain_idx" ON "ProviderDomain"("domain");

-- AddForeignKey
ALTER TABLE "ProviderAlias" ADD CONSTRAINT "ProviderAlias_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderDomain" ADD CONSTRAINT "ProviderDomain_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed provider catalog data.
INSERT INTO "Provider" ("id", "name", "category", "confidenceWeight", "updatedAt") VALUES
('provider_netflix', 'Netflix', 'Entertainment', 30, CURRENT_TIMESTAMP),
('provider_spotify', 'Spotify', 'Entertainment', 30, CURRENT_TIMESTAMP),
('provider_youtube_premium', 'YouTube Premium', 'Entertainment', 30, CURRENT_TIMESTAMP),
('provider_chatgpt_plus', 'ChatGPT Plus', 'AI tools', 30, CURRENT_TIMESTAMP),
('provider_adobe', 'Adobe', 'Productivity', 30, CURRENT_TIMESTAMP),
('provider_canva', 'Canva', 'Productivity', 30, CURRENT_TIMESTAMP),
('provider_amazon_prime', 'Amazon Prime', 'Entertainment', 30, CURRENT_TIMESTAMP),
('provider_notion', 'Notion', 'Productivity', 30, CURRENT_TIMESTAMP),
('provider_github_copilot', 'GitHub Copilot', 'AI tools', 30, CURRENT_TIMESTAMP),
('provider_apple', 'Apple', 'Entertainment', 30, CURRENT_TIMESTAMP),
('provider_google_one', 'Google One', 'Cloud storage', 30, CURRENT_TIMESTAMP),
('provider_microsoft_365', 'Microsoft 365', 'Productivity', 30, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "ProviderAlias" ("id", "providerId", "value") VALUES
('alias_netflix_1', 'provider_netflix', 'netflix'),
('alias_spotify_1', 'provider_spotify', 'spotify'),
('alias_youtube_1', 'provider_youtube_premium', 'youtube premium'),
('alias_youtube_2', 'provider_youtube_premium', 'youtube'),
('alias_youtube_3', 'provider_youtube_premium', 'google youtube'),
('alias_chatgpt_1', 'provider_chatgpt_plus', 'chatgpt'),
('alias_chatgpt_2', 'provider_chatgpt_plus', 'openai'),
('alias_chatgpt_3', 'provider_chatgpt_plus', 'chatgpt plus'),
('alias_adobe_1', 'provider_adobe', 'adobe'),
('alias_adobe_2', 'provider_adobe', 'creative cloud'),
('alias_canva_1', 'provider_canva', 'canva'),
('alias_amazon_prime_1', 'provider_amazon_prime', 'amazon prime'),
('alias_amazon_prime_2', 'provider_amazon_prime', 'prime membership'),
('alias_notion_1', 'provider_notion', 'notion'),
('alias_github_copilot_1', 'provider_github_copilot', 'github copilot'),
('alias_github_copilot_2', 'provider_github_copilot', 'copilot'),
('alias_github_copilot_3', 'provider_github_copilot', 'github'),
('alias_apple_1', 'provider_apple', 'apple'),
('alias_apple_2', 'provider_apple', 'icloud'),
('alias_apple_3', 'provider_apple', 'apple one'),
('alias_google_one_1', 'provider_google_one', 'google one'),
('alias_google_one_2', 'provider_google_one', 'google storage'),
('alias_microsoft_365_1', 'provider_microsoft_365', 'microsoft 365'),
('alias_microsoft_365_2', 'provider_microsoft_365', 'office 365'),
('alias_microsoft_365_3', 'provider_microsoft_365', 'microsoft')
ON CONFLICT ("providerId", "value") DO NOTHING;

INSERT INTO "ProviderDomain" ("id", "providerId", "domain") VALUES
('domain_netflix_1', 'provider_netflix', 'netflix.com'),
('domain_spotify_1', 'provider_spotify', 'spotify.com'),
('domain_youtube_1', 'provider_youtube_premium', 'youtube.com'),
('domain_chatgpt_1', 'provider_chatgpt_plus', 'openai.com'),
('domain_adobe_1', 'provider_adobe', 'adobe.com'),
('domain_canva_1', 'provider_canva', 'canva.com'),
('domain_amazon_prime_1', 'provider_amazon_prime', 'amazon.com'),
('domain_notion_1', 'provider_notion', 'notion.so'),
('domain_github_copilot_1', 'provider_github_copilot', 'github.com'),
('domain_apple_1', 'provider_apple', 'apple.com'),
('domain_microsoft_365_1', 'provider_microsoft_365', 'microsoft.com')
ON CONFLICT ("providerId", "domain") DO NOTHING;
