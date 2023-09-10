import express from 'express';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';

const router = express.Router();

router.get(
  '/update-marks',
  StudentEnrolledCourseMarkController.updateStudentMarks
);

export const StudentEnrolledCourseMarkRoutes = router;
