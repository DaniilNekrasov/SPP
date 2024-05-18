-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
