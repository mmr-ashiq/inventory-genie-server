import { Router } from 'express';

import {
  isLoggedInController,
  loginController,
  registrationController,
  logoutController,
  getUserProfileController,
} from '../controllers/auth.controller.js';
import { isAuthorized } from '../middlewares/auth.middlewares.js';

const router = Router();

router.post('/auth/login', loginController);
router.post(
  '/auth/registration',
  isAuthorized({
    allowedRole: ['admin'],
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

export { router as userRouter };
