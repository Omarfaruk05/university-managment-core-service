import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './building.controller';
import { buildingValidation } from './building.validation';

const router = express.Router();

router.get('/', BuildingController.getAllFromDB);
router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(buildingValidation.createZodSchema),
  BuildingController.insertIntoDB
);

export const BuildingRoutes = router;
