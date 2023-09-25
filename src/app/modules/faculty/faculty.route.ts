import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.get('/', FacultyController.getAllFromDB);

router.get(
  '/my-courses',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FacultyController.myCourses
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.FACULTY),
  FacultyController.getSingleDataFromDB
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FacultyValidation.createZodSchema),
  FacultyController.insertToDB
);

router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateZodSchema),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  FacultyController.deleteByIdFromDB
);

router.post(
  '/:id/assign-courses',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FacultyValidation.assignOrRemoveCoursesZodSchema),
  FacultyController.assignCourses
);

router.delete(
  '/:id/remove-courses',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(FacultyValidation.assignOrRemoveCoursesZodSchema),
  FacultyController.removeCourses
);

export const AcademicFacultyRoutes = router;
