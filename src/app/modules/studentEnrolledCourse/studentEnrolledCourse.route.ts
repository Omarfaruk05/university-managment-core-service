import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseController } from './studentEnrolledCourse.controller';
import { StudentEnrolledCourseValidation } from './studentEnrolledCourse.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(
    StudentEnrolledCourseValidation.createSemesterRegistrationCourseZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.insertIntoDB
);

router.get('/', StudentEnrolledCourseController.getAllFromDB);
router.get('/:id', StudentEnrolledCourseController.getByIdFromDB);

router.patch(
  '/:id',
  validateRequest(
    StudentEnrolledCourseValidation.updateSemesterRegistrationCourseZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  StudentEnrolledCourseController.deleteByIdFromDB
);

export const studentEnrolledCourseRoutes = router;
