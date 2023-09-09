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

  //for final
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
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
};
