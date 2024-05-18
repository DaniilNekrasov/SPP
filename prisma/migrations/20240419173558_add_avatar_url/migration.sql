-- AlterTable
ALTER TABLE "User" ADD COLUMN     "awards" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "job" TEXT;

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "public" BOOLEAN NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "finishTime" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
