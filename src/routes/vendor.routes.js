import { Router } from 'express';

import { isAuthorized } from '../middlewares/auth.middlewares.js';
import {
  getVendorsController,
  addNewVendorController,
  updateVendorController,
} from '../controllers/vendor.controllers.js';

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

export { router as vendorRouter };