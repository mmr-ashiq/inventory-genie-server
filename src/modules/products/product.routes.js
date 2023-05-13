import { Router } from 'express';

import { isAuthorized } from '../core/authorization/auth.middlewares.js';
import {
  addNewProductController,
  getProductsController,
  updateProductController,
} from './product.controller.js';
import {
  getSellsListController,
  productSellController,
  updateSellController,
} from './productSell.controller.js';
import { addNewStockInController } from './stockIn.controller.js';

const router = Router();

router.post(
  '/products',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  addNewProductController
);
router.put(
  '/products/:productId',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  updateProductController
);
router.get(
  '/products',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  getProductsController
);

router.post(
  '/stock-in',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  addNewStockInController
);
router.post(
  '/product-sells',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  productSellController
);
router.get(
  '/product-sells',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  getSellsListController
);
router.put(
  '/product-sells/:recordId',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  updateSellController
);

export { router as productRouter };
