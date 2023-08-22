import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { FacultyService } from './faculty.service';

const insertToDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.insertToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully Faculty is created.',
    data: result,
  });
});

const getSingleDataFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.getSingleDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully Faculty is created.',
    data: result,
  });
});

export const FacultyController = {
  insertToDB,
  getSingleDataFromDB,
};
