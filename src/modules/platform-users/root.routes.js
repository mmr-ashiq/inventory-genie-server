import { Router } from 'express';
import { userRouter } from './user.routes.js';
import { customerRouter } from '../customers/customer.routes.js';
import { productRouter } from '../products/product.routes.js';
import { vendorRouter } from '../vendors/vendor.routes.js';
import { statsRouter } from '../stats/stats.routes.js';

const router = Router();

router.use(userRouter);
router.use(customerRouter);
router.use(productRouter);
router.use(vendorRouter);
router.use(statsRouter);

export { router as rootRouter };
