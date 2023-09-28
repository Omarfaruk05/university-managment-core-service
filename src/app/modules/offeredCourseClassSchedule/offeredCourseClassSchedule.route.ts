import express from 'express';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { OfferedCourseClassScheduleValidation } from './offeredCourseClassSchedule.validation';

const router = express.Router();

router.post('/', OfferedCourseClassScheduleController.insertIntoDB);

router.get('/', OfferedCourseClassScheduleController.getAllFromDB);
router.get('/:id', OfferedCourseClassScheduleController.getByIdFromDB);

router.patch(
  '/:id',
  validateRequest(
    OfferedCourseClassScheduleValidation.updateOfferedCourseClassScheduleZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseClassScheduleController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseClassScheduleController.deleteByIdFromDB
);

export const OfferedCourseClassScheduleRotues = router;
