/*
  Warnings:

  - You are about to drop the column `ecoScoreGrade` on the `OrganizationCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `ecoScoreValue` on the `OrganizationCampaign` table. All the data in the column will be lost.
  - You are about to drop the `OrganizationKPI` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrganizationKPI" DROP CONSTRAINT "OrganizationKPI_kpiId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationKPI" DROP CONSTRAINT "OrganizationKPI_organizationCampaignId_fkey";

-- AlterTable
ALTER TABLE "OrganizationCampaign" DROP COLUMN "ecoScoreGrade",
DROP COLUMN "ecoScoreValue";

-- DropTable
DROP TABLE "OrganizationKPI";

-- CreateTable
CREATE TABLE "KpiScore" (
    "id" TEXT NOT NULL,
    "ecoScoreValue" DOUBLE PRECISION NOT NULL,
    "ecoScoreGrade" "EcoScoreGrade" NOT NULL,
    "organizationCampaignScoreId" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,

    CONSTRAINT "KpiScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationCampaignScore" (
    "id" TEXT NOT NULL,
    "ecoScoreValue" DOUBLE PRECISION NOT NULL,
    "ecoScoreGrade" "EcoScoreGrade" NOT NULL,
    "organizationCampaignId" TEXT NOT NULL,
    "productId" TEXT,

    CONSTRAINT "OrganizationCampaignScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationCampaignKpiBenchmark" (
    "id" TEXT NOT NULL,
    "benchmark" DOUBLE PRECISION NOT NULL,
    "organizationCampaignId" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,

    CONSTRAINT "OrganizationCampaignKpiBenchmark_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KpiScore" ADD CONSTRAINT "KpiScore_organizationCampaignScoreId_fkey" FOREIGN KEY ("organizationCampaignScoreId") REFERENCES "OrganizationCampaignScore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiScore" ADD CONSTRAINT "KpiScore_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "Kpi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCampaignScore" ADD CONSTRAINT "OrganizationCampaignScore_organizationCampaignId_fkey" FOREIGN KEY ("organizationCampaignId") REFERENCES "OrganizationCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCampaignScore" ADD CONSTRAINT "OrganizationCampaignScore_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCampaignKpiBenchmark" ADD CONSTRAINT "OrganizationCampaignKpiBenchmark_organizationCampaignId_fkey" FOREIGN KEY ("organizationCampaignId") REFERENCES "OrganizationCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCampaignKpiBenchmark" ADD CONSTRAINT "OrganizationCampaignKpiBenchmark_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "Kpi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
