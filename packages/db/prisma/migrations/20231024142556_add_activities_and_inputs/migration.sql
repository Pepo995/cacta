/*
  Warnings:

  - You are about to drop the column `core` on the `ProductKpi` table. All the data in the column will be lost.
  - You are about to drop the column `downstream` on the `ProductKpi` table. All the data in the column will be lost.
  - You are about to drop the column `transportation` on the `ProductKpi` table. All the data in the column will be lost.
  - You are about to drop the column `upstream` on the `ProductKpi` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('Fertilizers', 'Agrochemicals', 'Machinery', 'Electricity', 'Soil', 'Other');

-- AlterTable
ALTER TABLE "ProductKpi" DROP COLUMN "core",
DROP COLUMN "downstream",
DROP COLUMN "transportation",
DROP COLUMN "upstream";

-- CreateTable
CREATE TABLE "ActivityProductKpi" (
    "id" TEXT NOT NULL,
    "activity" "Activity" NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "upstream" DOUBLE PRECISION NOT NULL,
    "core" DOUBLE PRECISION NOT NULL,
    "transportation" DOUBLE PRECISION NOT NULL,
    "downstream" DOUBLE PRECISION NOT NULL,
    "productKpiId" TEXT NOT NULL,

    CONSTRAINT "ActivityProductKpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Input" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,

    CONSTRAINT "Input_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityInput" (
    "value" DOUBLE PRECISION NOT NULL,
    "activityId" TEXT NOT NULL,
    "inputId" TEXT NOT NULL,

    CONSTRAINT "ActivityInput_pkey" PRIMARY KEY ("activityId","inputId")
);

-- AddForeignKey
ALTER TABLE "ActivityProductKpi" ADD CONSTRAINT "ActivityProductKpi_productKpiId_fkey" FOREIGN KEY ("productKpiId") REFERENCES "ProductKpi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityInput" ADD CONSTRAINT "ActivityInput_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "ActivityProductKpi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityInput" ADD CONSTRAINT "ActivityInput_inputId_fkey" FOREIGN KEY ("inputId") REFERENCES "Input"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
