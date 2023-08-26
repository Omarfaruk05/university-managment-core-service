import express from 'express';
import { SemseterRegistrationController } from './semesterRegistration.controller';

const router = express.Router();
router.post(
  '/',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SemseterRegistrationController.insertIntoDB
);

export const SemesterRegistrationRoutes = router;
