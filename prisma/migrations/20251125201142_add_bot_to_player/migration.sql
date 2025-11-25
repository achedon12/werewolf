-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "botName" TEXT,
ADD COLUMN     "botType" TEXT,
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false;
