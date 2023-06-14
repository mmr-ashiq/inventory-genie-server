import { Router } from 'express';

import {
  isLoggedInController,
  loginController,
  logoutController,
  registrationController,
} from '../core/authorization/auth.controller.js';
import { isAuthorized } from '../core/authorization/auth.middlewares.js';
import {
  getUserListController,
  EditUserController,
  DeleteUserController,
  getUserProfileController,
  passwordChangeController,
} from './user.controller.js';

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
    allowedRole: ['admin', 'manager'],
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
router.put(
  '/user/:id',
  isAuthorized({
    allowedRole: ['manager'],
    allowedPermissions: [],
  }),
  EditUserController
);
router.delete(
  '/user/:id',
  isAuthorized({
    allowedRole: ['manager'],
    allowedPermissions: [],
  }),
  DeleteUserController
);
router.put(
  '/user/change-password',
  isAuthorized({
    allowedRole: ['admin', 'manager'],
    allowedPermissions: [],
  }),
  passwordChangeController
);

export { router as userRouter };
