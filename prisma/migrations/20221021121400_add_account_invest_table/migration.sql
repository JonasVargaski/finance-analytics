-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'OUTCOME', 'REVENUE');

-- CreateTable
CREATE TABLE "accountInvest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accountInvest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountInvestTransaction" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL DEFAULT 'INCOME',
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "accruedIncome" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "accountTransactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accountInvestTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "accountInvest" ADD CONSTRAINT "accountInvest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accountInvestTransaction" ADD CONSTRAINT "accountInvestTransaction_accountTransactionId_fkey" FOREIGN KEY ("accountTransactionId") REFERENCES "accountInvest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
