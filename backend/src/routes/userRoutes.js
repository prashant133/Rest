const express = require("express");
const {
  registerUserController,
  sendOTPVerificationLogin,
  verifyUserOTPLogin,
  logoutUserController,
} = require("../controller/userController");
const verifyJWT = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUserController);
router.post("/send-otp", sendOTPVerificationLogin);
router.post("/verify-otp", verifyUserOTPLogin);

// protected route
router.post("/logout", verifyJWT, logoutUserController);

module.exports = router;
