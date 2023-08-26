import { CourseFaculty, Faculty } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertToDB = async (data: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({ data });

  return result;
};

const getSingleDataFromDB = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: { id },
  });

  return result;
};

const assignCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(courseId => ({
      facultyId: id,
      courseId: courseId,
    })),
  });

  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
  return assignCoursesData;
};

const removeCourses = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });
  const assignCoursesData = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
  return assignCoursesData;
};

export const FacultyService = {
  insertToDB,
  getSingleDataFromDB,
  assignCourses,
  removeCourses,
};
