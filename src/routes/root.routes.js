import { Router } from 'express';
import { userRouter } from './user.routes.js';
import { customerRouter } from './customer.routes.js';

const router = Router();

router.use(userRouter);
router.use(customerRouter);

export { router as rootRouter };
