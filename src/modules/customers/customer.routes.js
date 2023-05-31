import { Router } from 'express';

import { isAuthorized } from '../core/authorization/auth.middlewares.js';

import {
  getCustomersController,
  addNewCustomerController,
  updateCustomerController,
  getSingleCustomerController,
  deleteCustomerController,
} from './customer.controller.js';

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
router.get(
  '/customers/:customerId/single',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  getSingleCustomerController
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
