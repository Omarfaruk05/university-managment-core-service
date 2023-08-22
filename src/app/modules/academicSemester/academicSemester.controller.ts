import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemesterFilterAbleFildes } from './academicSemester.constant';
import { AcademicSemesterService } from './academicSemester.service';

const insertToDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSemesterService.insertToDB(req.body);

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, AcademicSemesterFilterAbleFildes);

  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await AcademicSemesterService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Semesters successfully fetched.',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDataById = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicSemesterService.getSingleDataById(req.params.id);

  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester succefully fetched',
    data: result,
  });
});

export const AcademicSemesterController = {
  insertToDB,
  getAllFromDB,
  getSingleDataById,
};
