import { Faculty } from '@prisma/client';
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

export const FacultyService = {
  insertToDB,
  getSingleDataFromDB,
};
