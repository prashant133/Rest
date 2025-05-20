const asyncHandler = require("../utils/asyncHandler");
const User = require("../model/userModel");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const { sendOTPController, verifyOTPController } = require("./otpController");
const OTP = require("../model/otpModel");

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
    membershipNumber,
    registrationNumber,
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
    membershipNumber,
    registrationNumber,
    dateOfFillUp,
    place,
    email,
    password,
  };

  // Validate input
  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value) {
      throw new ApiError(400, `Field '${key}' is required`);
    }
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ employeeId }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
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
    .json(new ApiResponse(200, createdUser, "user created successfully"));
});

const sendOTPVerificationLogin = asyncHandler(async (req, res) => {
  const { employeeId, email, password } = req.body;

  // validate the data
  if (!(!employeeId || !email)) {
    throw new ApiError(400, "All fields are required");
  }

  // check for the existing user
  const user = await User.findOne({ $or: [{ employeeId }, { email }] });

  if (!user) {
    throw new ApiError(400, "No such error");
  }

  // check if password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Password is not correct");
  }

  try {
    await sendOTPController(user.email);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP sent for verification"));
  } catch (error) {
    // Handle any errors from sendOptController
    throw new ApiError(error.statusCode || 500, error.message);
  }
});

const verifyUserOTPLogin = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  try {
    await verifyOTPController(otp);

    const otpRecord = await OTP.findOne({ otp });
    let email = otpRecord.email;

    // 3. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 4. Generate tokens
    const { refreshToken, accessToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    // 5. Get user data without sensitive info
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    // 6. Set cookie options
    const options = {
      httpOnly: true,
      secure: true,
    };

    // 7. Send response
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
    throw new ApiError(
      error.statusCode || 500,
      error.message || "OTP verification error"
    );
  }
});

const logoutUserController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "No refresh Token found");
  }

  const user = await User.findOne({ refreshToken });

  if (!user) {
    // Still clear cookies for safety
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json(new ApiResponse(200, {}, "User logged out"));
  }

  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  // Clear cookies
  res
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    })
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "user logged out successfully"));
});

module.exports = {
  registerUserController,
  generateAccessTokenAndRefreshToken,
  sendOTPVerificationLogin,
  verifyUserOTPLogin,
  logoutUserController,
};
