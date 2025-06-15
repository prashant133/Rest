  const express = require("express");
  const {
    registerUserController,
    sendOTPVerificationLogin,
    verifyUserOTPLogin,
    logoutUserController,
    getAllUsersController,
    getUserByIdController,
    updateUserController,
    deleteUserController,
  } = require("../controller/userController");
  const verifyJWT = require("../middleware/authMiddleware");
  const verifyAdmin = require("../middleware/verifyAdmin");
  const router = express.Router();

  // Public routes
  router.post("/register", registerUserController);
  router.post("/send-otp", sendOTPVerificationLogin);
  router.post("/verify-otp", verifyUserOTPLogin);

  // Protected routes (require authentication)
  router.post("/logout", verifyJWT, logoutUserController);
  router.get("/check-auth", verifyJWT, async (req, res) => {
    return res.status(200).json(
      new (require("../utils/ApiResponse"))(200, req.user, "User is authenticated")
    );
  });

  // Admin-only routes
  router.get("/get-all-users", getAllUsersController);
  router.delete("/delete-user/:id",  deleteUserController);

  // Authenticated user routes (get and update user by ID)
  router.get("/get-user/:id",  getUserByIdController);
  router.patch("/update-user/:id",  updateUserController);

  module.exports = router;
