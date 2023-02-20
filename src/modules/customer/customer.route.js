const express = require('express');
const { searchCustomer } = require('./customer.controller');

const { isAuthorized } = require('../core/middlewares/auth.middleware');

const router = express.Router();

router.get(
  '/customers/search',
  isAuthorized({
    allowedRole: ['admin', 'manager'],
  }),
  searchCustomer
);

module.exports = router;
