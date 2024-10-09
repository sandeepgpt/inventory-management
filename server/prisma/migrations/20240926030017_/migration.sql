/*
  Warnings:

  - Added the required column `location` to the `Purchases` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchases" ADD COLUMN     "location" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sales" ADD COLUMN     "location" TEXT NOT NULL;
