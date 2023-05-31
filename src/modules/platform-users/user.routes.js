import { Router } from 'express';

import {
  getUserProfileController,
  isLoggedInController,
  loginController,
  logoutController,
  registrationController,
} from '../core/authorization/auth.controller.js';
import { isAuthorized } from '../core/authorization/auth.middlewares.js';
import { getUserListController } from './user.controller.js';

const router = Router();

router.post('/auth/login', loginController);
router.post(
  '/auth/registration',
  isAuthorized({
    allowedRole: ['manager'],
    allowedPermissions: [],
  }),
  registrationController
);

router.get('/auth/is-logged-in', isLoggedInController);
router.get('/auth/logout', logoutController);

router.get(
  '/user/profile',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  getUserProfileController
);
router.get(
  '/users',
  isAuthorized({
    allowedRole: ['manager'],
    allowedPermissions: [],
  }),
  getUserListController
);

export { router as userRouter };

