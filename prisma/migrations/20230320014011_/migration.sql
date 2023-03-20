/*
  Warnings:

  - You are about to drop the column `capacity` on the `Location` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `Activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "capacity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "capacity";
