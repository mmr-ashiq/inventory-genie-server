import { Router } from 'express';

import { isAuthorized } from '../middlewares/auth.middlewares.js';

import {
  getCustomersController,
  addNewCustomerController,
  updateCustomerController,
  deleteCustomerController,
} from '../controllers/customer.controller.js';

const router = Router();

router.post(
  '/customers',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  addNewCustomerController
);
router.put(
  '/customers/:customerId',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  updateCustomerController
);
router.get(
  '/customers',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  getCustomersController
);
router.delete(
  '/customers/:customerId',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  deleteCustomerController
);

export { router as customerRouter };
