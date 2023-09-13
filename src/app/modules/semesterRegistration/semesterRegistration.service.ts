import {
  Course,
  OfferedCourse,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentEnrolledCourseStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { StudentEnrolledCourseMarkService } from '../studentEnrolledCouseMark/studentEnrolledCourseMark.service';
import { StudentSemesterPaymentService } from '../studentSemesterPayment/studentSemesterPayment.service';
import { StudentSemesterRegistrationCourseService } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service';
import { IEnrollCoursePayload } from './semesterRegistration.interface';
import { SemesterRegistrationUtils } from './semesterRegistration.utils';

const insertIntoDB = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isAnySemesterRegistationUpcomingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  if (isAnySemesterRegistationUpcomingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnySemesterRegistationUpcomingOrOngoing.status} registration.`
    );
  }
  const result = await prisma.semesterRegistration.create({
    data,
  });

  return result;
};

const startMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  if (!studentInfo) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student info not found.');
  }

  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });

  if (
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Registration is not started yet.'
    );
  }

  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo?.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });

  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }
  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

const enrollIntoCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
): Promise<{
  message: string;
}> => {
  return StudentSemesterRegistrationCourseService.enrollIntoCourse(
    authUserId,
    payload
  );
};

const withdrawFromCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
): Promise<{
  message: string;
}> => {
  return StudentSemesterRegistrationCourseService.withdrawFromCourse(
    authUserId,
    payload
  );
};

const confirmMyRegistration = async (
  authUserId: string
): Promise<{
  message: string;
}> => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      startDate: SemesterRegistrationStatus.ONGOING,
    },
  });
  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
    });

  if (!studentSemesterRegistration) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not recognized for this semster!'
    );
  }

  if (studentSemesterRegistration.totalCreditTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not enrolled in any course!'
    );
  }

  if (
    studentSemesterRegistration.totalCreditTaken &&
    semesterRegistration?.minCredit &&
    semesterRegistration.maxCredit &&
    (studentSemesterRegistration.totalCreditTaken <
      semesterRegistration?.minCredit ||
      studentSemesterRegistration.totalCreditTaken >
        semesterRegistration?.maxCredit)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can take only ${semesterRegistration.minCredit} to ${semesterRegistration.maxCredit}`
    );
  }

  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistration.id,
    },
    data: {
      isConfirmed: true,
    },
  });

  return {
    message: 'Your registration is confirmed.',
  };
};

const getMyRegistration = async (authUserId: string) => {
  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
    include: {
      academicSemester: true,
    },
  });

  const studentSemesterRegistration =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
      include: {
        student: true,
      },
    });
  return { semesterRegistration, studentSemesterRegistration };
};
const startNewSemester = async (
  id: string
): Promise<{
  message: string;
}> => {
  const semesterRegistration = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      `Semester registration not found.`
    );
  }
  if (semesterRegistration.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Semester registration is not ended yet!`
    );
  }

  if (semesterRegistration.academicSemester.isCurrent) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Semester is already started!`);
  }

  await prisma.$transaction(async prismaTransectionClient => {
    await prismaTransectionClient.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });

    await prismaTransectionClient.academicSemester.update({
      where: {
        id: semesterRegistration.academicSemester.id,
      },
      data: {
        isCurrent: true,
      },
    });

    const studentSemesterRegistrations =
      await prismaTransectionClient.studentSemesterRegistration.findMany({
        where: {
          semesterRegistration: {
            id,
          },
          isConfirmed: true,
        },
      });

    asyncForEach(
      studentSemesterRegistrations,
      async (studentSemReg: StudentSemesterRegistration) => {
        if (studentSemReg.totalCreditTaken) {
          const totalPaymentAmount = studentSemReg.totalCreditTaken * 5000;

          await StudentSemesterPaymentService.createSemesterPayment(
            prismaTransectionClient,
            {
              studentId: studentSemReg.studentId,
              academicSemesterId: semesterRegistration.academicSemesterId,
              totalPaymentAmount: totalPaymentAmount,
            }
          );
        }

        const studentSemesterRegistrationCourses =
          await prismaTransectionClient.studentSemesterRegistrationCourse.findMany(
            {
              where: {
                semesterRegistration: {
                  id,
                },
                student: {
                  id: studentSemReg.studentId,
                },
              },
              include: {
                offeredCourse: {
                  include: {
                    course: true,
                  },
                },
              },
            }
          );

        asyncForEach(
          studentSemesterRegistrationCourses,
          async (
            item: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse & {
                course: Course;
              };
            }
          ) => {
            const isExistEnrolledData =
              prismaTransectionClient.studentEnrolledCourse.findFirst({
                where: {
                  studentId: item.studentId,
                  courseId: item.offeredCourse.courseId,
                  academicSemesterId: semesterRegistration.academicSemesterId,
                },
              });

            if (!isExistEnrolledData) {
              const enrolledCourseData = {
                studentId: item.studentId,
                courseId: item.offeredCourse.courseId,
                academicSemesterId: semesterRegistration.academicSemesterId,
              };

              const studentEnrollCourseData =
                await prismaTransectionClient.studentEnrolledCourse.create({
                  data: enrolledCourseData,
                });

              await StudentEnrolledCourseMarkService.createStudentEnrolledCourseDefaultMark(
                prismaTransectionClient,
                {
                  studentId: studentEnrollCourseData.studentId,
                  studentEnrollCourseId: studentEnrollCourseData.id,
                  academicSemester: semesterRegistration.academicSemesterId,
                }
              );
            }
          }
        );
      }
    );
  });

  return {
    message: 'Semester started successfully.',
  };
  //end
};

const updateInDB = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  const isExist = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Data not found.');
  }

  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from UPCOMING to ONGOING.'
    );
  }
  if (
    payload.status &&
    isExist.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from ONGOING to ENDED.'
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const deleteByIdFromDB = async (id: string): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const getMySemesterRegCourses = async (authUserId: string) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.UPCOMING,
          SemesterRegistrationStatus.ONGOING,
        ],
      },
    },
    include: {
      academicSemester: true,
    },
  });

  if (!semesterRegistration) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Semester registration not found!'
    );
  }

  const studentCompletedCourse = await prisma.studentEnrolledCourse.findMany({
    where: {
      status: StudentEnrolledCourseStatus.COMPLETED,
      student: {
        id: student?.id,
      },
    },
    include: {
      course: true,
    },
  });

  const studentCurrentSemesterTakenCourse =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        student: {
          id: student?.id,
        },
        semesterRegistration: {
          id: semesterRegistration?.id,
        },
      },
      include: {
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });

  const offeredCourse = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistration: {
        id: semesterRegistration?.id,
      },
      academicDepartment: {
        id: student?.academicDepartmentId,
      },
    },
    include: {
      course: {
        include: {
          preRequisite: {
            include: {
              preRequisite: true,
            },
          },
        },
      },
      offeredCourseSections: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const availableCourses = SemesterRegistrationUtils.getAvailableCourses(
    offeredCourse,
    studentCompletedCourse,
    studentCurrentSemesterTakenCourse
  );

  return availableCourses;

  //end
};

export const SemesterRegistrationService = {
  insertIntoDB,
  updateInDB,
  deleteByIdFromDB,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
  getMySemesterRegCourses,
};
