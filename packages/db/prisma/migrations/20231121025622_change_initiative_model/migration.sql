/*
  Warnings:

  - You are about to drop the column `establishmentCampaignId` on the `Initiative` table. All the data in the column will be lost.
  - Added the required column `organizationCampaignId` to the `Initiative` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Initiative` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Initiative` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Reference" AS ENUM ('LastCampaign', 'Benchmark', 'Custom');

-- DropForeignKey
ALTER TABLE "Initiative" DROP CONSTRAINT "Initiative_establishmentCampaignId_fkey";

-- AlterTable
ALTER TABLE "Initiative" DROP COLUMN "establishmentCampaignId",
ADD COLUMN     "organizationCampaignId" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "reference" "Reference" NOT NULL;

-- AddForeignKey
ALTER TABLE "Initiative" ADD CONSTRAINT "Initiative_organizationCampaignId_fkey" FOREIGN KEY ("organizationCampaignId") REFERENCES "OrganizationCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Initiative" ADD CONSTRAINT "Initiative_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
