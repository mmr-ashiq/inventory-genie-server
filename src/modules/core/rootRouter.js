const express = require('express');

const authRoutes = require('../core/authorization/auth.routes');
const customerRoutes = require('../customers/customer.route');
const productRoutes = require('../products/product.route');

const router = express.Router();

router.use(authRoutes);
router.use(customerRoutes);

module.exports = router;
