/*
  Warnings:

  - You are about to drop the column `scopesId` on the `ProductKpi` table. All the data in the column will be lost.
  - You are about to drop the column `waterCompositionId` on the `ProductKpi` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productKpiId]` on the table `Scopes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productKpiId]` on the table `WaterComposition` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productKpiId` to the `Scopes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productKpiId` to the `WaterComposition` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActivityInput" DROP CONSTRAINT "ActivityInput_activityId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityInput" DROP CONSTRAINT "ActivityInput_inputId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityProductKpi" DROP CONSTRAINT "ActivityProductKpi_productKpiId_fkey";

-- DropForeignKey
ALTER TABLE "Establishment" DROP CONSTRAINT "Establishment_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "EstablishmentCampaign" DROP CONSTRAINT "EstablishmentCampaign_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "EstablishmentCampaign" DROP CONSTRAINT "EstablishmentCampaign_organizationCampaignId_fkey";

-- DropForeignKey
ALTER TABLE "KpiScore" DROP CONSTRAINT "KpiScore_organizationCampaignScoreId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationCampaign" DROP CONSTRAINT "OrganizationCampaign_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationCampaignKpiBenchmark" DROP CONSTRAINT "OrganizationCampaignKpiBenchmark_kpiId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationCampaignKpiBenchmark" DROP CONSTRAINT "OrganizationCampaignKpiBenchmark_organizationCampaignId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationCampaignScore" DROP CONSTRAINT "OrganizationCampaignScore_organizationCampaignId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationCampaignScore" DROP CONSTRAINT "OrganizationCampaignScore_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCampaign" DROP CONSTRAINT "ProductCampaign_establishmentCampaignId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCampaign" DROP CONSTRAINT "ProductCampaign_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductKpi" DROP CONSTRAINT "ProductKpi_productCampaignId_fkey";

-- DropForeignKey
ALTER TABLE "ProductKpi" DROP CONSTRAINT "ProductKpi_scopesId_fkey";

-- DropForeignKey
ALTER TABLE "ProductKpi" DROP CONSTRAINT "ProductKpi_waterCompositionId_fkey";

-- DropForeignKey
ALTER TABLE "ProductKpiBenchmark" DROP CONSTRAINT "ProductKpiBenchmark_organizationCampaignKpiBenchmarkId_fkey";

-- DropForeignKey
ALTER TABLE "ProductKpiBenchmark" DROP CONSTRAINT "ProductKpiBenchmark_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductKpiElectricitySource" DROP CONSTRAINT "ProductKpiElectricitySource_electricitySourceId_fkey";

-- DropForeignKey
ALTER TABLE "ProductKpiElectricitySource" DROP CONSTRAINT "ProductKpiElectricitySource_productKpiId_fkey";

-- AlterTable
ALTER TABLE "ProductKpi" DROP COLUMN "scopesId",
DROP COLUMN "waterCompositionId";

-- AlterTable
ALTER TABLE "Scopes" ADD COLUMN     "productKpiId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WaterComposition" ADD COLUMN     "productKpiId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SyncDate" (
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncDate_pkey" PRIMARY KEY ("date")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scopes_productKpiId_key" ON "Scopes"("productKpiId");

-- CreateIndex
CREATE UNIQUE INDEX "WaterComposition_productKpiId_key" ON "WaterComposition"("productKpiId");

-- AddForeignKey
ALTER TABLE "OrganizationCampaign" ADD CONSTRAINT "OrganizationCampaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstablishmentCampaign" ADD CONSTRAINT "EstablishmentCampaign_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstablishmentCampaign" ADD CONSTRAINT "EstablishmentCampaign_organizationCampaignId_fkey" FOREIGN KEY ("organizationCampaignId") REFERENCES "OrganizationCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCampaign" ADD CONSTRAINT "ProductCampaign_establishmentCampaignId_fkey" FOREIGN KEY ("establishmentCampaignId") REFERENCES "EstablishmentCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCampaign" ADD CONSTRAINT "ProductCampaign_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpi" ADD CONSTRAINT "ProductKpi_productCampaignId_fkey" FOREIGN KEY ("productCampaignId") REFERENCES "ProductCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scopes" ADD CONSTRAINT "Scopes_productKpiId_fkey" FOREIGN KEY ("productKpiId") REFERENCES "ProductKpi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterComposition" ADD CONSTRAINT "WaterComposition_productKpiId_fkey" FOREIGN KEY ("productKpiId") REFERENCES "ProductKpi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KpiScore" ADD CONSTRAINT "KpiScore_organizationCampaignScoreId_fkey" FOREIGN KEY ("organizationCampaignScoreId") REFERENCES "OrganizationCampaignScore"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCampaignScore" ADD CONSTRAINT "OrganizationCampaignScore_organizationCampaignId_fkey" FOREIGN KEY ("organizationCampaignId") REFERENCES "OrganizationCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCampaignScore" ADD CONSTRAINT "OrganizationCampaignScore_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCampaignKpiBenchmark" ADD CONSTRAINT "OrganizationCampaignKpiBenchmark_organizationCampaignId_fkey" FOREIGN KEY ("organizationCampaignId") REFERENCES "OrganizationCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCampaignKpiBenchmark" ADD CONSTRAINT "OrganizationCampaignKpiBenchmark_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "Kpi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpiBenchmark" ADD CONSTRAINT "ProductKpiBenchmark_organizationCampaignKpiBenchmarkId_fkey" FOREIGN KEY ("organizationCampaignKpiBenchmarkId") REFERENCES "OrganizationCampaignKpiBenchmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpiBenchmark" ADD CONSTRAINT "ProductKpiBenchmark_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityProductKpi" ADD CONSTRAINT "ActivityProductKpi_productKpiId_fkey" FOREIGN KEY ("productKpiId") REFERENCES "ProductKpi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityInput" ADD CONSTRAINT "ActivityInput_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "ActivityProductKpi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityInput" ADD CONSTRAINT "ActivityInput_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "Input"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpiElectricitySource" ADD CONSTRAINT "ProductKpiElectricitySource_productKpiId_fkey" FOREIGN KEY ("productKpiId") REFERENCES "ProductKpi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpiElectricitySource" ADD CONSTRAINT "ProductKpiElectricitySource_electricitySourceId_fkey" FOREIGN KEY ("electricitySourceId") REFERENCES "ElectricitySource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
