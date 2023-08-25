import express from 'express';
import { CourseController } from './course.controller';

const router = express.Router();

router.post(
  '/',
  //   auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  CourseController.insertIntoDB
);

export const CourseRoutes = router;
