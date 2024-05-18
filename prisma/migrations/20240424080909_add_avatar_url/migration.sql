/*
  Warnings:

  - You are about to drop the column `authorId` on the `Post` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "authorId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isModer" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Keyword" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_KeywordToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_title_key" ON "Keyword"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToUser_AB_unique" ON "_PostToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToUser_B_index" ON "_PostToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_KeywordToPost_AB_unique" ON "_KeywordToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_KeywordToPost_B_index" ON "_KeywordToPost"("B");

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToUser" ADD CONSTRAINT "_PostToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToPost" ADD CONSTRAINT "_KeywordToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_KeywordToPost" ADD CONSTRAINT "_KeywordToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
