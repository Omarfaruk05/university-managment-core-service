import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { academicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.get('/', AcademicSemesterController.getAllFromDB);
router.get('/:id', AcademicSemesterController.getSingleDataById);
router.post(
  '/',
  validateRequest(academicSemesterValidation.createZodSchema),
  AcademicSemesterController.insertToDB
);

export const AcademicSemestrRoutes = router;
