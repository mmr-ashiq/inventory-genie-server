import { Router } from 'express';

import { isAuthorized } from '../middlewares/auth.middlewares.js';
import {
  getTopSixProductsController,
  yearlySellReportController,
} from '../controllers/stats.controller.js';

const router = Router();

router.get('/top-six-products', getTopSixProductsController);
router.get('/sell-report', yearlySellReportController);

export { router as statsRouter };