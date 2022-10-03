/*
  Warnings:

  - A unique constraint covering the columns `[fundId]` on the table `dataScraps` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "dataScraps_fundId_key" ON "dataScraps"("fundId");
