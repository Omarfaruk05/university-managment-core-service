import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectionValidation } from './offeredCorseSection.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(
    OfferedCourseSectionValidation.createOfferedCourseSectionZodSchema
  ),
  OfferedCourseSectionController.insertIntoDB
);

router.get('/', OfferedCourseSectionController.getAllFromDB);
router.get('/:id', OfferedCourseSectionController.getByIdFromDB);

router.patch(
  '/:id',
  validateRequest(
    OfferedCourseSectionValidation.updateOfferedCourseSectionZodSchema
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.updateOneInDB
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.deleteByIdFromDB
);

export const OfferedCourseSectionRoutes = router;
