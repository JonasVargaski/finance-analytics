-- CreateEnum
CREATE TYPE "eColorPallete" AS ENUM ('PRIMARY', 'ACCENT', 'PAIRED');

-- CreateTable
CREATE TABLE "colors" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "pallete" "eColorPallete" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);
