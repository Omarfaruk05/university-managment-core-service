import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.get('/:id', AcademicDepartmentController.getSingleDataFromDB);
router.post(
  '/',
  validateRequest(AcademicDepartmentValidation.createZodSchema),
  AcademicDepartmentController.insertToDB
);

export const AcademicDepartmentRoutes = router;
