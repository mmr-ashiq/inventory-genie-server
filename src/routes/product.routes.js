import { Router } from 'express';

import { isAuthorized } from '../middlewares/auth.middlewares.js';
import {
  addNewProductController,
  getProductsController,
  updateProductController,
} from '../controllers/product.controller.js';

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

export { router as productRouter };