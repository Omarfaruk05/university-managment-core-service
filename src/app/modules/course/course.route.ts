import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

const router = express.Router();

router.post(
  '/',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CourseController.insertIntoDB
);
router.patch(
  '/',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CourseController.updateOneInDB
);
router.post(
  '/:id/assign-faculties',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(CourseValidation.assignOrRemoveFacultiesZodSchema),
  CourseController.assignFaculties
);
router.delete(
  '/:id/remove-faculties',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(CourseValidation.assignOrRemoveFacultiesZodSchema),
  CourseController.removeFaculties
);

export const CourseRoutes = router;
