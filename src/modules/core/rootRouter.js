const express = require("express");

const authRoutes = require("../core/authorization/auth.routes");

const router = express.Router();

router.use(authRoutes);

module.exports = router;
