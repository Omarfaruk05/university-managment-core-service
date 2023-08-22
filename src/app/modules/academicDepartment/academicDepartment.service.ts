import { AcademicDepartment } from '@prisma/client';
import prisma from '../../../shared/prisma';

const insertToDB = async (
  data: AcademicDepartment
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({ data });

  return result;
};

const getSingleDataFromDB = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: { id },
  });

  return result;
};

export const AcademicDepatrmentService = {
  insertToDB,
  getSingleDataFromDB,
};
