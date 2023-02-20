const express = require('express');

const authRoutes = require('../core/authorization/auth.routes');
const customerRoutes = require('../customer/customer.route');

const router = express.Router();

router.use(authRoutes);
router.use(customerRoutes);

module.exports = router;
