/*
  Warnings:

  - A unique constraint covering the columns `[creatorId]` on the table `channels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "channels_creatorId_key" ON "channels"("creatorId");
