import { Router } from 'express';

import { isAuthorized } from '../core/authorization/auth.middlewares.js';
import {
  getVendorsController,
  addNewVendorController,
  updateVendorController,
  getSingleVendorController,
} from './vendor.controllers.js';

const router = Router();

router.post(
  '/vendors',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  addNewVendorController
);
router.put(
  '/vendors/:vendorId',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  updateVendorController
);
router.get(
  '/vendors',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  getVendorsController
);
router.get(
  '/vendors/:vendorId/single',
  isAuthorized({
    allowedRole: ['admin'],
    allowedPermissions: [],
  }),
  getSingleVendorController
);

export { router as vendorRouter };
