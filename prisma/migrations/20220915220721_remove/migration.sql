/*
  Warnings:

  - You are about to drop the column `value` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "value",
ALTER COLUMN "price" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "password" DROP DEFAULT;
