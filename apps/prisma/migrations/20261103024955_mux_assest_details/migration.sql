/*
  Warnings:

  - You are about to drop the column `muxVideoUid` on the `videos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[muxUploadId]` on the table `videos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[muxAssetId]` on the table `videos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "videos" DROP COLUMN "muxVideoUid",
ADD COLUMN     "duration" DOUBLE PRECISION,
ADD COLUMN     "muxAssetId" TEXT,
ADD COLUMN     "muxPlaybackId" TEXT,
ADD COLUMN     "muxUploadId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "videos_muxUploadId_key" ON "videos"("muxUploadId");

-- CreateIndex
CREATE UNIQUE INDEX "videos_muxAssetId_key" ON "videos"("muxAssetId");

-- CreateIndex
CREATE INDEX "videos_muxAssetId_idx" ON "videos"("muxAssetId");
