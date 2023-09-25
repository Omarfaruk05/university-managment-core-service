import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { facultyFilterableFields } from './faculty.constant';
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

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, facultyFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await FacultyService.getAllFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties fetched successfully',
    meta: result.meta,
    data: result.data,
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

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.updateOneInDB(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully',
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyService.deleteByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty delete successfully',
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

const myCourses = catchAsync(async (req: Request, res: Response) => {
  const filter = pick(req.query, ['academicSemesterId', 'courseId']);
  const user = (req as any).user;
  const result = await FacultyService.myCourses(user, filter);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My coursres data fetched successfully',
    data: result,
  });
});

const getMyCourseStudents = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const filters = pick(req.query, [
    'academicSemesterId',
    'courseId',
    'offeredCourseSectionId',
  ]);
  const options = pick(req.query, ['limit', 'page']);
  const result = await FacultyService.getMyCourseStudents(
    filters,
    options,
    user
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty course students fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const FacultyController = {
  insertToDB,
  getAllFromDB,
  getSingleDataFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  assignCourses,
  removeCourses,
  myCourses,
  getMyCourseStudents,
};
