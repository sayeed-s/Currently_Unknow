/*
  Warnings:

  - You are about to drop the column `cfVideoUid` on the `videos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "videos" DROP COLUMN "cfVideoUid",
ADD COLUMN     "muxVideoUid" TEXT;
