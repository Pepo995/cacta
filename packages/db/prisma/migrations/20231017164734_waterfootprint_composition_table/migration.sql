-- AlterTable
ALTER TABLE "ProductKpi" ADD COLUMN     "waterFootprintCompositionId" TEXT;

-- CreateTable
CREATE TABLE "WaterFootprintComposition" (
    "id" TEXT NOT NULL,
    "green" DOUBLE PRECISION NOT NULL,
    "blue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WaterFootprintComposition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductKpi" ADD CONSTRAINT "ProductKpi_waterFootprintCompositionId_fkey" FOREIGN KEY ("waterFootprintCompositionId") REFERENCES "WaterFootprintComposition"("id") ON DELETE SET NULL ON UPDATE CASCADE;
