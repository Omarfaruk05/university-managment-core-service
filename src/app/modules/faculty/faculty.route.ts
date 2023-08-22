import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.get('/:id', FacultyController.getSingleDataFromDB);
router.post(
  '/',
  validateRequest(FacultyValidation.createZodSchema),
  FacultyController.insertToDB
);

export const AcademicFacultyRoutes = router;
