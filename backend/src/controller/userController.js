const asyncHandler = require("../utils/asyncHandler");
const User = require("../model/userModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { sendOTPController, verifyOTPController } = require("./otpController");
const OTP = require("../model/otpModel");
const { v4: uuidv4 } = require('uuid');

// Generate refresh and access tokens
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
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
  const {
    employeeId,
    username,
    surname,
    address,
    province,
    district,
    municipality,
    wardNumber,
    tole,
    telephoneNumber,
    mobileNumber,
    dob,
    postAtRetirement,
    pensionLeaseNumber,
    office,
    serviceStartDate,
    serviceRetirementDate,
    dateOfFillUp,
    place,
    email,
    password,
  } = req.body;

  const requiredFields = {
    employeeId,
    username,
    surname,
    address,
    province,
    district,
    municipality,
    wardNumber,
    tole,
    telephoneNumber,
    mobileNumber,
    dob,
    postAtRetirement,
    pensionLeaseNumber,
    office,
    serviceStartDate,
    serviceRetirementDate,
    dateOfFillUp,
    place,
    email,
    password,
    membershipNumber: `MEM-${uuidv4().slice(0, 8).toUpperCase()}`,
    registrationNumber: `REG-${uuidv4().slice(0, 8).toUpperCase()}`,
  };

  // Validate input
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value && key !== 'membershipNumber' && key !== 'registrationNumber') {
      throw new ApiError(400, `Field '${key}' is required`);
    }
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ employeeId }, { email }, { mobileNumber }, { telephoneNumber }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with this employee ID, email, or phone number");
  }

  // Create new user
  const user = await User.create(requiredFields);

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(400, "Error while creating user");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

const sendOTPVerificationLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Check for existing user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  // Verify password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid password");
  }

  // Send OTP for any valid user
  try {
    await sendOTPController(user.email);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP sent for verification"));
  } catch (error) {
    throw new ApiError(error.statusCode || 500, error.message || "Failed to send OTP");
  }
});

const verifyUserOTPLogin = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    throw new ApiError(400, "OTP is required");
  }

  try {
    const otpRecord = await verifyOTPController(otp);
    console.log("OTP record from verifyOTPController:", otpRecord);
    if (!otpRecord || !otpRecord.email) {
      console.log("Invalid or missing OTP record for OTP:", otp);
      throw new ApiError(404, "Invalid or expired OTP");
    }

    const email = otpRecord.email;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // For admin frontend: Check if user is admin
    if (req.headers['x-admin-frontend'] === 'true' && user.role !== "admin") {
      throw new ApiError(403, "This interface is for admin users only");
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "Strict",
    };

    // Delete OTP record after successful verification
    await OTP.findOneAndDelete({ otp });

    // Send response
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { loggedInUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("Error in verifyUserOTPLogin:", error);
    throw error;
  }
});

const logoutUserController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "No refresh token found");
  }

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }

  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "Strict",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "Strict",
    });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

module.exports = {
  registerUserController,
  generateAccessTokenAndRefreshToken,
  sendOTPVerificationLogin,
  verifyUserOTPLogin,
  logoutUserController,
};