import { Router } from 'express';
import { userRouter } from './user.routes.js';
import { customerRouter } from './customer.routes.js';
import { productRouter } from './product.routes.js';
import { vendorRouter } from './vendor.routes.js';

const router = Router();

router.use(userRouter);
router.use(customerRouter);
router.use(productRouter);
router.use(vendorRouter)

export { router as rootRouter };
