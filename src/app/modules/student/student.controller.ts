import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { studentFilterableFields } from './student.constant';
import { StudentService } from './student.service';

const insertToDB = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.insertToDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully Student is created.',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, studentFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await StudentService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleDataFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.getSingleDataFromDB(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully Student is fetched.',
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const result = await StudentService.updateIntoDB(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully Student is Updated.',
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await StudentService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Successfully Student is Deleted.',
    data: result,
  });
});

const myCourses = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const filter = pick(req.query, ['courseId', 'academicSemesterId']);
  const result = await StudentService.myCourses(user.userId, filter);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student courses data fetched successfully.',
    data: result,
  });
});

const getMyCourseSchedules = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const filter = pick(req.query, ['courseId', 'academicSemesterId']);
  const result = await StudentService.getMyCourseSchedules(user.userId, filter);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course schedules data fetched successfully.',
    data: result,
  });
});

const getMyAcademicInfo = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const result = await StudentService.getMyAcademicInfo(user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My academic info data fetched successfully.',
    data: result,
  });
});

export const StudentController = {
  insertToDB,
  getSingleDataFromDB,
  getAllFromDB,
  updateIntoDB,
  deleteFromDB,
  myCourses,
  getMyCourseSchedules,
  getMyAcademicInfo,
};
