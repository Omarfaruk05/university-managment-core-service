import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  //   validateRequest(OfferedCourseSectionValidation.createZodSchema),
  OfferedCourseSectionController.insertIntoDB
);

export const OfferedCourseSectionRoutes = router;
