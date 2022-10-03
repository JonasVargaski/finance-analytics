/*
  Warnings:

  - Added the required column `updatedAt` to the `radars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "radars" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "dataScraps" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dataScraps_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "dataScraps" ADD CONSTRAINT "dataScraps_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
