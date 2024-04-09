/*
  Warnings:

  - You are about to drop the column `benchmark` on the `OrganizationCampaign` table. All the data in the column will be lost.
  - You are about to drop the `OrganizationKPIScore` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Kpi` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "OrganizationKPIScore" DROP CONSTRAINT "OrganizationKPIScore_kpiId_fkey";

-- DropForeignKey
ALTER TABLE "OrganizationKPIScore" DROP CONSTRAINT "OrganizationKPIScore_organizationCampaignId_fkey";

-- AlterTable
ALTER TABLE "OrganizationCampaign" DROP COLUMN "benchmark";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePictureUrl" TEXT;

-- DropTable
DROP TABLE "OrganizationKPIScore";

-- CreateTable
CREATE TABLE "OrganizationKPI" (
    "ecoScoreValue" DOUBLE PRECISION NOT NULL,
    "ecoScoreGrade" "EcoScoreGrade" NOT NULL,
    "benchmark" DOUBLE PRECISION NOT NULL,
    "organizationCampaignId" TEXT NOT NULL,
    "kpiId" TEXT NOT NULL,

    CONSTRAINT "OrganizationKPI_pkey" PRIMARY KEY ("kpiId","organizationCampaignId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kpi_name_key" ON "Kpi"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- AddForeignKey
ALTER TABLE "OrganizationKPI" ADD CONSTRAINT "OrganizationKPI_organizationCampaignId_fkey" FOREIGN KEY ("organizationCampaignId") REFERENCES "OrganizationCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationKPI" ADD CONSTRAINT "OrganizationKPI_kpiId_fkey" FOREIGN KEY ("kpiId") REFERENCES "Kpi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
