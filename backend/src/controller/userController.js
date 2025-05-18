const asyncHandler = require("../utils/asyncHandler");
const User = require("../model/userModel")
const ApiError = require("../utils/ApiError")
const ApiResponse = require("../utils/ApiResponse")

// generate refresh token and access token
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    // Retrieve the user by ID
    const user = await User.findById(userId);

    // Check if user exists
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Save the refresh token in the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Return tokens
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating access token and refresh token"
    );
  }
};

const registerUserController = asyncHandler(async (req, res) => {
  res.send("hello");
});

module.exports = { registerUserController, generateAccessTokenAndRefreshToken };
