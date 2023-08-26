import { Course, CourseFaculty } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import {
  ICourseCreateData,
  IPrerequisiteCourseRequest,
} from './course.interface';

const insertIntoDB = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transactionClient => {
    const result = await transactionClient.course.create({
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      await asyncForEach(
        preRequisiteCourses,
        async (preRequisiteCourse: IPrerequisiteCourseRequest) => {
          const createPrerequisite =
            await transactionClient.courseToPrerequisite.create({
              data: {
                courseId: result.id,
                preRequisiteId: preRequisiteCourse.courseId,
              },
            });
          console.log(createPrerequisite);
        }
      );
    }

    return result;
  });

  if (newCourse) {
    const responsData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });

    return responsData;
  }

  throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
};

const updateOneInDB = async (
  id: string,
  payload: ICourseCreateData
): Promise<Course | null> => {
  const { preRequisiteCourses, ...courseData } = payload;

  await prisma.$transaction(async transectionClient => {
    const result = await transectionClient.course.update({
      where: {
        id,
      },
      data: courseData,
    });
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to update course');
    }
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePrequisite = preRequisiteCourses.filter(
        coursePrequisite =>
          coursePrequisite.courseId && coursePrequisite.isDeleted
      );
      const newPrequisite = preRequisiteCourses.filter(
        coursePrequisite =>
          coursePrequisite.courseId && !coursePrequisite.isDeleted
      );

      // delete coursePrerequisite
      await asyncForEach(
        deletePrequisite,
        async (deletPreCourse: IPrerequisiteCourseRequest) => {
          await transectionClient.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  preRequisiteId: deletPreCourse.courseId,
                },
              ],
            },
          });
        }
      );

      // insert coursepreRequisite
      await asyncForEach(
        newPrequisite,
        async (insertPrerequisite: IPrerequisiteCourseRequest) => {
          await transectionClient.courseToPrerequisite.create({
            data: {
              courseId: id,
              preRequisiteId: insertPrerequisite.courseId,
            },
          });
        }
      );
    }

    return result;
  });

  const responsData = await prisma.course.findUnique({
    where: {
      id: id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  return responsData;
};

const assignFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(facultyId => ({
      courseId: id,
      facultyId: facultyId,
    })),
  });

  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });
  return assignFacultiesData;
};

const removeFaculties = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      courseId: id,
      facultyId: {
        in: payload,
      },
    },
  });
  const assignFacultiesData = await prisma.courseFaculty.findMany({
    where: {
      courseId: id,
    },
    include: {
      faculty: true,
    },
  });
  return assignFacultiesData;
};

export const CourseService = {
  insertIntoDB,
  updateOneInDB,
  assignFaculties,
  removeFaculties,
};
