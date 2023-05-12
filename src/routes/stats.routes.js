import { Router } from 'express';

import { isAuthorized } from '../middlewares/auth.middlewares.js';
import {
  getTopSixProductsController,
  yearlySellReportController,
  getTopCustomerController,
  getMostDueCustomerController,
  getTopVendorsController,
  getTopVendorsWithDueController,
  getTotalSalesAmountController,
  getTotalDueAmountController,
} from '../controllers/stats.controller.js';

const router = Router();

router.get('/top-six-products', getTopSixProductsController);
router.get('/sell-report', yearlySellReportController);
router.get('/top-customers', getTopCustomerController);
router.get('/top-due-customers', getMostDueCustomerController);
router.get('/top-vendors', getTopVendorsController);
router.get('/top-due-vendors', getTopVendorsWithDueController);
router.get('/total-sales-amount', getTotalSalesAmountController);
router.get('/total-due-amount', getTotalDueAmountController);

export { router as statsRouter };