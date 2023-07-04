/*
  Warnings:

  - Made the column `desc` on table `Challenge` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "desc" SET NOT NULL;
