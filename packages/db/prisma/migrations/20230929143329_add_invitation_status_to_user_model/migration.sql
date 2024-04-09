-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('Pending', 'Accepted');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invitationStatus" "InvitationStatus" NOT NULL DEFAULT 'Pending';
