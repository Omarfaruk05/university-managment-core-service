/*
  Warnings:

  - You are about to drop the column `academecSemesterId` on the `semester_registrations` table. All the data in the column will be lost.
  - Added the required column `academicSemesterId` to the `semester_registrations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "semester_registrations" DROP CONSTRAINT "semester_registrations_academecSemesterId_fkey";

-- AlterTable
ALTER TABLE "semester_registrations" DROP COLUMN "academecSemesterId",
ADD COLUMN     "academicSemesterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "semester_registrations" ADD CONSTRAINT "semester_registrations_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES "academic_semisters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
