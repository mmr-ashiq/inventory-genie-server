const express = require('express');

const { isAuthorized } = require('../middlewares/auth.middleware');
const {
  register,
  login,
  isLoggedIn,
  updatePermissions,
  logout,
} = require('../authorization/auth.controller');

const router = express.Router();

router.post('/auth/login', login);
router.post(
  '/auth/registration',
  isAuthorized({
    allowedRole: ['manager', 'admin'],
  }),
  register
);
router.put(
  '/auth/update-permissions/:userId',
  isAuthorized({
    allowedRole: ['manager'],
  }),
  updatePermissions
);
router.get('/auth/is-logged-in', isLoggedIn);
router.get('/auth/logout', logout);

module.exports = router;
