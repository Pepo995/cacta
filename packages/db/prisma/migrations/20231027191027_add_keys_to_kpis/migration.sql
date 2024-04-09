/*
  Warnings:

  - Added the required column `key` to the `Kpi` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "KpiKey" AS ENUM ('TotalCarbonFootprint', 'WaterEutrophication', 'PotentialAcidification', 'WaterEcotoxicity', 'Smog', 'OzoneDepletion', 'NonCarcinogenic', 'Carcinogenic', 'UseOfElectricity', 'NonRenewables', 'MineralsAndMetals', 'WaterFootprint', 'WaterProductivity');

-- AlterTable
ALTER TABLE "Kpi" ADD COLUMN     "key" "KpiKey" NOT NULL;
