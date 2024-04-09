/*
  Warnings:

  - You are about to drop the column `value` on the `ActivityInput` table. All the data in the column will be lost.
  - You are about to drop the column `core` on the `ActivityProductKpi` table. All the data in the column will be lost.
  - You are about to drop the column `downstream` on the `ActivityProductKpi` table. All the data in the column will be lost.
  - You are about to drop the column `transportation` on the `ActivityProductKpi` table. All the data in the column will be lost.
  - You are about to drop the column `upstream` on the `ActivityProductKpi` table. All the data in the column will be lost.
  - Added the required column `core` to the `ActivityInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `downstream` to the `ActivityInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalValue` to the `ActivityInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transportation` to the `ActivityInput` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upstream` to the `ActivityInput` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityInput" DROP COLUMN "value",
ADD COLUMN     "core" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "downstream" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "transportation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "upstream" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ActivityProductKpi" DROP COLUMN "core",
DROP COLUMN "downstream",
DROP COLUMN "transportation",
DROP COLUMN "upstream";
