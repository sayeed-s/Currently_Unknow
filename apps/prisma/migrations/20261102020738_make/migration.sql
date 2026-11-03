/*
  Warnings:

  - You are about to drop the column `ChannelImage` on the `channels` table. All the data in the column will be lost.
  - Added the required column `channelImage` to the `channels` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelImagePublicId` to the `channels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channels" DROP COLUMN "ChannelImage",
ADD COLUMN     "channelImage" TEXT NOT NULL,
ADD COLUMN     "channelImagePublicId" TEXT NOT NULL,
ADD COLUMN     "channelPosterPublicId" TEXT;

-- AlterTable
ALTER TABLE "community_posts" ADD COLUMN     "imagePublicId" TEXT;
