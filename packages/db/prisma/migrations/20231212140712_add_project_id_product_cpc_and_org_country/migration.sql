/*
  Warnings:

  - A unique constraint covering the columns `[projectId]` on the table `OrganizationCampaign` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `country` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectId` to the `OrganizationCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpcId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpcName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "country" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationCampaign" ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "cpcId" TEXT NOT NULL,
ADD COLUMN     "cpcName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationCampaign_projectId_key" ON "OrganizationCampaign"("projectId");
