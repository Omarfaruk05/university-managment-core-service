import { ExamTypeStatus, PrismaClient } from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';

const createStudentEnrolledCourseDefaultMark = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    studentEnrollCourseId: string;
    academicSemester: string;
  }
) => {
  // for midterm
  const isExistMidtermData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamTypeStatus.MIDTERM,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrollCourseId,
        },
        academicSemester: {
          id: payload.academicSemester,
        },
      },
    });

  if (!isExistMidtermData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrollCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemester,
          },
        },
        examType: ExamTypeStatus.MIDTERM,
      },
    });
  }

  //for final
  const isExistFinalData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamTypeStatus.FINAL,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrollCourseId,
        },
        academicSemester: {
          id: payload.academicSemester,
        },
      },
    });

  if (!isExistFinalData) {
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrollCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemester,
          },
        },
        examType: ExamTypeStatus.FINAL,
      },
    });
  }
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
};
