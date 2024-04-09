/*
  Warnings:

  - You are about to drop the column `waterFootprintCompositionId` on the `ProductKpi` table. All the data in the column will be lost.
  - You are about to drop the `WaterFootprintComposition` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductKpi" DROP CONSTRAINT "ProductKpi_waterFootprintCompositionId_fkey";

-- AlterTable
ALTER TABLE "ProductKpi" DROP COLUMN "waterFootprintCompositionId",
ADD COLUMN     "waterCompositionId" TEXT;

-- DropTable
DROP TABLE "WaterFootprintComposition";

-- CreateTable
CREATE TABLE "WaterComposition" (
    "id" TEXT NOT NULL,
    "greenFootprint" DOUBLE PRECISION NOT NULL,
    "blueFootprint" DOUBLE PRECISION NOT NULL,
    "requiredWater" DOUBLE PRECISION NOT NULL,
    "rainfaill" DOUBLE PRECISION NOT NULL,
    "irrigation" DOUBLE PRECISION NOT NULL,
    "lostRainfall" DOUBLE PRECISION NOT NULL,
    "lostIrrigation" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WaterComposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricitySource" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "renewable" BOOLEAN NOT NULL,

    CONSTRAINT "ElectricitySource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductKpiElectricitySource" (
    "id" TEXT NOT NULL,
    "productKpiId" TEXT NOT NULL,
    "electricitySourceId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProductKpiElectricitySource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductKpi" ADD CONSTRAINT "ProductKpi_waterCompositionId_fkey" FOREIGN KEY ("waterCompositionId") REFERENCES "WaterComposition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpiElectricitySource" ADD CONSTRAINT "ProductKpiElectricitySource_productKpiId_fkey" FOREIGN KEY ("productKpiId") REFERENCES "ProductKpi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductKpiElectricitySource" ADD CONSTRAINT "ProductKpiElectricitySource_electricitySourceId_fkey" FOREIGN KEY ("electricitySourceId") REFERENCES "ElectricitySource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
