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

const assignCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.assignCourses(id, req.body.courses);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course faculty assigned successfully',
    data: result,
  });
});

const removeCourses = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.removeCourses(id, req.body.faculties);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course faculty assigned successfully',
    data: result,
  });
});

export const FacultyController = {
  insertToDB,
  getSingleDataFromDB,
  assignCourses,
  removeCourses,
};
