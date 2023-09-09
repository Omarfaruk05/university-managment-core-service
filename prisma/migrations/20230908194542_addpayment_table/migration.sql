/*
  Warnings:

  - You are about to drop the column `sutudentId` on the `student_semester_payment` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `student_semester_payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "student_semester_payment" DROP CONSTRAINT "student_semester_payment_sutudentId_fkey";

-- AlterTable
ALTER TABLE "student_semester_payment" DROP COLUMN "sutudentId",
ADD COLUMN     "studentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "student_semester_payment" ADD CONSTRAINT "student_semester_payment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
