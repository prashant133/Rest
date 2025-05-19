const express = require("express");
const { registerUserController, sendOTPVerificationLogin, verifyUserOTPLogin } = require("../controller/userController");

const router = express.Router();

router.post("/register", registerUserController);
router.post("/send-otp",sendOTPVerificationLogin)
router.post("/verify-otp", verifyUserOTPLogin)

module.exports = router;
