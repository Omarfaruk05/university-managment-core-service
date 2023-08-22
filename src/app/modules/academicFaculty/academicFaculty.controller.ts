import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AcademicFacultyService } from './academicFaculty.service';

const insertToDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicFacultyService.insertToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully Academic Faculty is created.',
    data: result,
  });
});

const getSingleDataFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AcademicFacultyService.getSingleDataFromDB(
    req.params.id
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully Academic Faculty is created.',
    data: result,
  });
});

export const AcademicFacultyController = {
  insertToDB,
  getSingleDataFromDB,
};
