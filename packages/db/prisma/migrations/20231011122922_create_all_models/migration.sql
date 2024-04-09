/*
  Warnings:

  - Added the required column `organizationId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EcoScoreGrade" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateEnum
CREATE TYPE "SoilType" AS ENUM ('Alfisol', 'Andisol', 'Aridisol', 'Entisol', 'Gelisol', 'Histosol', 'Inceptisol', 'Mollisol', 'Oxisol', 'Spodosol', 'Ultisol', 'Vertisol');

-- CreateEnum
CREATE TYPE "KpiCategory" AS ENUM ('ClimateChange', 'EcosystemQuality', 'HumanHealth', 'ResourcesExhaustion');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationCampaign" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "benchmark" DOUBLE PRECISION NOT NULL,
    "ecoScoreValue" DOUBLE PRECISION NOT NULL,
    "ecoScoreGrade" "EcoScoreGrade" NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "OrganizationCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Establishment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "soilType" "SoilType" NOT NULL,
    "soilPh" DOUBLE PRECISION NOT NULL,
    "organicMaterial" DOUBLE PRECISION NOT NULL,
    "nitrogen" DOUBLE PRECISION NOT NULL,
    "phosphorus" DOUBLE PRECISION NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EstablishmentCampaign" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "establishmentId" TEXT NOT NULL,
    "organizationCampaignId" TEXT NOT NULL,

    CONSTRAINT "EstablishmentCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCampaign" (
    "id" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "harvestedAmount" DOUBLE PRECISION,
    "area" DOUBLE PRECISION NOT NULL,
    "establishmentCampaignId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kpi" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "unit" TEXT NOT NULL,
    "category" "KpiCategory" NOT NULL,

    CONSTRAINT "Kpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductKpi" (
    "id" TEXT NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "upstream" DOUBLE PRECISION NOT NULL,
    "core" DOUBLE PRECISION NOT NULL,
    "transportation" DOUBLE PRECISION NOT NULL,
    "downstream" DOUBLE PRECISION NOT NULL,
    "kpiId" TEXT NOT NULL,
    "productCampaignId" TEXT NOT NULL,
    "scopesId" TEXT,

    CONSTRAINT "ProductKpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scopes" (
    "id" TEXT NOT NULL,
    "s1" DOUBLE PRECISION NOT NULL,
    "s2" DOUBLE PRECISION NOT NULL,
    "s3" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Scopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationKPIScore" (
    "ecoScoreValue" DOUBLE PRECISION NOT NULL,
    "ecoScoreGrade" "EcoScoreGrade" NOT NULL,
    "organizationCampaignId" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,

    CONSTRAINT "OrganizationKPIScore_pkey" PRIMARY KEY ("kpiId","organizationCampaignId")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationCampaign" ADD CONSTRAINT "OrganizationCampaign_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstablishmentCampaign" ADD CONSTRAINT "EstablishmentCampaign_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstablishmentCampaign" ADD CONSTRAINT "EstablishmentCampaign_organizationCampaignId_fkey" FOREIGN KEY ("organizationCampaignId") REFERENCES "OrganizationCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCampaign" ADD CONSTRAINT "ProductCampaign_establishmentCampaignId_fkey" FOREIGN KEY ("establishmentCampaignId") REFERENCES "EstablishmentCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCampaign" ADD CONSTRAINT "ProductCampaign_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpi" ADD CONSTRAINT "ProductKpi_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "Kpi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpi" ADD CONSTRAINT "ProductKpi_productCampaignId_fkey" FOREIGN KEY ("productCampaignId") REFERENCES "ProductCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpi" ADD CONSTRAINT "ProductKpi_scopesId_fkey" FOREIGN KEY ("scopesId") REFERENCES "Scopes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationKPIScore" ADD CONSTRAINT "OrganizationKPIScore_organizationCampaignId_fkey" FOREIGN KEY ("organizationCampaignId") REFERENCES "OrganizationCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationKPIScore" ADD CONSTRAINT "OrganizationKPIScore_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "Kpi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
