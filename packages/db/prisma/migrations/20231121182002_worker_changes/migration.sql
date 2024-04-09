/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `ElectricitySource` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[engineId]` on the table `Establishment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[engineId]` on the table `Input` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[engineName]` on the table `Input` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Input` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[key]` on the table `Kpi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[engineId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[engineId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[engineName]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ActivityInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ActivityProductKpi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `ElectricitySource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ElectricitySource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineId` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EstablishmentCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Initiative` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineId` to the `Input` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineName` to the `Input` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Input` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Kpi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `KpiScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineId` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrganizationCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrganizationCampaignKpiBenchmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `OrganizationCampaignScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductKpi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductKpiBenchmark` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductKpiElectricitySource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Scopes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WaterComposition` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ElectricitySourceKey" AS ENUM ('Biogas', 'Water', 'Solar', 'Wind', 'MineralOil', 'Nuclear', 'FossilCarbon', 'NaturalGas');

-- AlterTable
ALTER TABLE "ActivityInput" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ActivityProductKpi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ElectricitySource" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "key" "ElectricitySourceKey" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "engineId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "EstablishmentCampaign" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Initiative" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Input" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "engineId" TEXT NOT NULL,
ADD COLUMN     "engineName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Kpi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "KpiScore" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "engineId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationCampaign" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationCampaignKpiBenchmark" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationCampaignScore" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "engineId" TEXT NOT NULL,
ADD COLUMN     "engineName" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductCampaign" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductKpi" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductKpiBenchmark" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ProductKpiElectricitySource" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Scopes" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WaterComposition" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ElectricitySource_key_key" ON "ElectricitySource"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Establishment_engineId_key" ON "Establishment"("engineId");

-- CreateIndex
CREATE INDEX "Establishment_organizationId_idx" ON "Establishment"("organizationId");

-- CreateIndex
CREATE INDEX "Establishment_name_idx" ON "Establishment"("name");

-- CreateIndex
CREATE INDEX "EstablishmentCampaign_endDate_idx" ON "EstablishmentCampaign"("endDate");

-- CreateIndex
CREATE INDEX "EstablishmentCampaign_startDate_idx" ON "EstablishmentCampaign"("startDate");

-- CreateIndex
CREATE INDEX "EstablishmentCampaign_establishmentId_idx" ON "EstablishmentCampaign"("establishmentId");

-- CreateIndex
CREATE INDEX "EstablishmentCampaign_organizationCampaignId_idx" ON "EstablishmentCampaign"("organizationCampaignId");

-- CreateIndex
CREATE INDEX "Initiative_name_idx" ON "Initiative"("name");

-- CreateIndex
CREATE INDEX "Initiative_startDate_idx" ON "Initiative"("startDate");

-- CreateIndex
CREATE INDEX "Initiative_endDate_idx" ON "Initiative"("endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Input_engineId_key" ON "Input"("engineId");

-- CreateIndex
CREATE UNIQUE INDEX "Input_engineName_key" ON "Input"("engineName");

-- CreateIndex
CREATE UNIQUE INDEX "Input_name_key" ON "Input"("name");

-- CreateIndex
CREATE INDEX "Invitation_userId_idx" ON "Invitation"("userId");

-- CreateIndex
CREATE INDEX "Invitation_organizationId_idx" ON "Invitation"("organizationId");

-- CreateIndex
CREATE INDEX "Invitation_invitationStatus_idx" ON "Invitation"("invitationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Kpi_key_key" ON "Kpi"("key");

-- CreateIndex
CREATE INDEX "Kpi_category_idx" ON "Kpi"("category");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_engineId_key" ON "Organization"("engineId");

-- CreateIndex
CREATE INDEX "OrganizationCampaign_organizationId_idx" ON "OrganizationCampaign"("organizationId");

-- CreateIndex
CREATE INDEX "OrganizationCampaignKpiBenchmark_organizationCampaignId_idx" ON "OrganizationCampaignKpiBenchmark"("organizationCampaignId");

-- CreateIndex
CREATE INDEX "OrganizationCampaignKpiBenchmark_kpiId_idx" ON "OrganizationCampaignKpiBenchmark"("kpiId");

-- CreateIndex
CREATE INDEX "OrganizationCampaignScore_productId_idx" ON "OrganizationCampaignScore"("productId");

-- CreateIndex
CREATE INDEX "OrganizationCampaignScore_organizationCampaignId_idx" ON "OrganizationCampaignScore"("organizationCampaignId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_engineId_key" ON "Product"("engineId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_engineName_key" ON "Product"("engineName");

-- CreateIndex
CREATE INDEX "ProductCampaign_endDate_idx" ON "ProductCampaign"("endDate");

-- CreateIndex
CREATE INDEX "ProductCampaign_harvestedAmount_idx" ON "ProductCampaign"("harvestedAmount");

-- CreateIndex
CREATE INDEX "ProductCampaign_productId_idx" ON "ProductCampaign"("productId");

-- CreateIndex
CREATE INDEX "ProductKpi_kpiId_idx" ON "ProductKpi"("kpiId");

-- CreateIndex
CREATE INDEX "ProductKpiElectricitySource_productKpiId_idx" ON "ProductKpiElectricitySource"("productKpiId");

-- CreateIndex
CREATE INDEX "User_firstName_idx" ON "User"("firstName");
