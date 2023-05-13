import { Router } from 'express';

import {
  getMostDueCustomerController,
  getTopCustomerController,
  getTopSixProductsController,
  getTopVendorsController,
  getTopVendorsWithDueController,
  getTotalDueAmountController,
  getTotalSalesAmountController,
  yearlySellReportController,
} from './stats.controller.js';

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
