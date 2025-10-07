-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "configuration" TEXT NOT NULL DEFAULT '{}',
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'classic';
