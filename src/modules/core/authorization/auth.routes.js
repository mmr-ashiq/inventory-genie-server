const express = require("express");

const { isAuthorized } = require("../middlewares/auth.middleware");
const {
  register,
  login,
  isLoggedIn,
  updatePermissions,
  logout,
} = require("../authorization/auth.controller");

const router = express.Router();

router.post("/login", login);
router.post(
  "/registration",
  isAuthorized({
    allowedRole: ["manager", "admin"],
  }),
  register
);
router.put(
  "/update-permissions/:userId",
  isAuthorized({
    allowedRole: ["manager"],
  })
);
router.get("/is-logged-in", isLoggedIn);
router.get("/logout", logout);

module.exports = router;
