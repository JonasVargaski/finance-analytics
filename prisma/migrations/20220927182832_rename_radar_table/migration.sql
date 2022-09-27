/*
  Warnings:

  - You are about to drop the `radar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "radar" DROP CONSTRAINT "radar_fundId_fkey";

-- DropForeignKey
ALTER TABLE "radar" DROP CONSTRAINT "radar_userId_fkey";

-- DropTable
DROP TABLE "radar";

-- CreateTable
CREATE TABLE "radars" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "radars_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "radars" ADD CONSTRAINT "radars_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radars" ADD CONSTRAINT "radars_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
