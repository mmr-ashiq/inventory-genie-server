import { Router } from 'express';

import { isAuthorized } from '../middlewares/auth.middlewares.js';
import { loginController, registrationController } from '../controllers/auth.controller.js';

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

export { router as userRouter };
