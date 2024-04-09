/*
  Warnings:

  - You are about to drop the column `latitud` on the `Establishment` table. All the data in the column will be lost.
  - You are about to drop the column `longitud` on the `Establishment` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Establishment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Establishment" DROP COLUMN "latitud",
DROP COLUMN "longitud",
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
