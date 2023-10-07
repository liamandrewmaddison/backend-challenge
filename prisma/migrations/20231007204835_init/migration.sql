/*
  Warnings:

  - You are about to drop the column `createdDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedDate` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdDate",
DROP COLUMN "updatedDate",
ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
