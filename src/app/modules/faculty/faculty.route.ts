import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.get(
  '/:id',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FacultyController.getSingleDataFromDB
);
router.post(
  '/',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),

  validateRequest(FacultyValidation.createZodSchema),
  FacultyController.insertToDB
);

router.post(
  '/:id/assign-courses',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FacultyController.assignCourses
);
router.delete(
  '/:id/remove-courses',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FacultyController.removeCourses
);

export const AcademicFacultyRoutes = router;
