import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemseterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semseterRegirtration.validation';

const router = express.Router();

router.get(
  '/get-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemseterRegistrationController.getMyRegistration
);

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SemesterRegistrationValidation.createZodSchem),
  SemseterRegistrationController.insertIntoDB
);

router.post(
  '/start-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemseterRegistrationController.startMyRegistration
);

router.post(
  '/enroll-into-course',
  validateRequest(
    SemesterRegistrationValidation.enrollOrWithdrawCourseZodSchema
  ),
  auth(ENUM_USER_ROLE.STUDENT),
  SemseterRegistrationController.enrollInotCourse
);

router.post(
  '/withdraw-from-course',
  validateRequest(
    SemesterRegistrationValidation.enrollOrWithdrawCourseZodSchema
  ),
  auth(ENUM_USER_ROLE.STUDENT),
  SemseterRegistrationController.withdrawFromCourse
);

router.post(
  '/confirm-my-registration',
  auth(ENUM_USER_ROLE.STUDENT),
  SemseterRegistrationController.confirmMyRegistration
);

router.post(
  '/:id/start-new-semester',
  auth(ENUM_USER_ROLE.ADMIN),
  SemseterRegistrationController.startNewSemester
);

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SemesterRegistrationValidation.updateZodSchem),
  SemseterRegistrationController.updateInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SemseterRegistrationController.deleteByIdFromDB
);

export const SemesterRegistrationRoutes = router;
