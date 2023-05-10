import { Router } from 'express';

import { isAuthorized } from '../middlewares/auth.middlewares.js';
import {
  getTopSixProductsController,
  yearlySellReportController,
  getTopCustomerController,
  getMostDueCustomerController,
  getTopVendorsController,
} from '../controllers/stats.controller.js';

const router = Router();

router.get('/top-six-products', getTopSixProductsController);
router.get('/sell-report', yearlySellReportController);
router.get('/top-customers', getTopCustomerController);
router.get('/top-due-customers', getMostDueCustomerController);
router.get('/top-vendors', getTopVendorsController);

export { router as statsRouter };