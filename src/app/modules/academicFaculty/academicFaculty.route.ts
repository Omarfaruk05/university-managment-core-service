import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.get('/:id', AcademicFacultyController.getSingleDataFromDB);
router.post(
  '/',
  validateRequest(AcademicFacultyValidation.createZodSchema),
  AcademicFacultyController.insertToDB
);

export const AcademicFacultyRoutes = router;
