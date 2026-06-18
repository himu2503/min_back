const express = require("express");

const router =
  express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  changePassword
} = require(
  "../controllers/authController"
);

const auth =
  require("../middleware/auth");

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.get(
  "/profile",
  auth,
  getProfile
);

router.put(
  "/change-password",
  auth,
  changePassword
);

module.exports = router;