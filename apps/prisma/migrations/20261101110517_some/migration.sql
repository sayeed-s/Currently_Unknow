/*
  Warnings:

  - Added the required column `ChannelImage` to the `channels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "ChannelImage" TEXT NOT NULL,
ADD COLUMN     "channelPoster" TEXT,
ADD COLUMN     "joiningPrice" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "premiumUser" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "community_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "imageurl" TEXT,
    "channelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "community_posts_channelId_idx" ON "community_posts"("channelId");

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
