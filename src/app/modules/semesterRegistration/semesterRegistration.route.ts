import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SemseterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semseterRegirtration.validation';

const router = express.Router();
router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SemesterRegistrationValidation.createZodSchem),
  SemseterRegistrationController.insertIntoDB
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
