const express = require("express");
const {
  registerUserController,
  sendOTPVerificationLogin,
  verifyUserOTPLogin,
  logoutUserController,
} = require("../controller/userController");
const verifyJWT = require("../middleware/authMiddleware");
const verifyAdmin =require("../middleware/verifyAdmin")
const router = express.Router();

router.post("/register", registerUserController);
router.post("/send-otp", sendOTPVerificationLogin);
router.post("/verify-otp", verifyUserOTPLogin);

// protected route
router.post("/logout", verifyJWT, logoutUserController);

// Check authentication status
router.get("/check-auth", verifyJWT, async (req, res) => {
  return res.status(200).json(
    new (require("../utils/ApiResponse"))(200, req.user, "User is authenticated")
  );
});

module.exports = router;
