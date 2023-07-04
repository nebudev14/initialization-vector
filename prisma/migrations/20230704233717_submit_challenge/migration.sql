/*
  Warnings:

  - You are about to drop the column `tags` on the `Challenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "SubmitChallenge" (
    "id" TEXT NOT NULL,
    "challengeId" TEXT,

    CONSTRAINT "SubmitChallenge_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SubmitChallenge" ADD CONSTRAINT "SubmitChallenge_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE SET NULL ON UPDATE CASCADE;
