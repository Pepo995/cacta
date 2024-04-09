/*
  Warnings:

  - You are about to drop the column `s1` on the `Scopes` table. All the data in the column will be lost.
  - You are about to drop the column `s2` on the `Scopes` table. All the data in the column will be lost.
  - You are about to drop the column `s3` on the `Scopes` table. All the data in the column will be lost.
  - You are about to drop the column `rainfaill` on the `WaterComposition` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[engineId]` on the table `OrganizationCampaign` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `engineId` to the `OrganizationCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope1` to the `Scopes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope2` to the `Scopes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scope3` to the `Scopes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rainfall` to the `WaterComposition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrganizationCampaign" ADD COLUMN     "engineId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Scopes" DROP COLUMN "s1",
DROP COLUMN "s2",
DROP COLUMN "s3",
ADD COLUMN     "scope1" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "scope2" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "scope3" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "WaterComposition" DROP COLUMN "rainfaill",
ADD COLUMN     "rainfall" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationCampaign_engineId_key" ON "OrganizationCampaign"("engineId");
