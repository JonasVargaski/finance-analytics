-- CreateTable
CREATE TABLE "radar" (
    "id" TEXT NOT NULL,
    "fundId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "radar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "radar" ADD CONSTRAINT "radar_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "radar" ADD CONSTRAINT "radar_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
