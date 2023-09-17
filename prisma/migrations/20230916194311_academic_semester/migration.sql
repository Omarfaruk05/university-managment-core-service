/*
  Warnings:

  - You are about to drop the column `grate` on the `student_enrolled_course_mark` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "academic_semisters" ALTER COLUMN "year" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "student_enrolled_course_mark" DROP COLUMN "grate",
ADD COLUMN     "grade" TEXT;

-- CreateTable
CREATE TABLE "student_academic_info" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalCompletedCredit" INTEGER NOT NULL DEFAULT 0,
    "cgpa" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_academic_info_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_academic_info" ADD CONSTRAINT "student_academic_info_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
