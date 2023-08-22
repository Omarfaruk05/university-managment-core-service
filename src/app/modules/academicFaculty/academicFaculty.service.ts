import { AcademicFaculty } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertToDB = async (data: AcademicFaculty): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({ data });

  return result;
};

const getSingleDataFromDB = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: { id },
  });

  return result;
};

export const AcademicFacultyService = {
  insertToDB,
  getSingleDataFromDB,
};
