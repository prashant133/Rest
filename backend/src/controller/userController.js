const asyncHandler = require('../utils/asyncHandler');
const User = require('../model/userModel');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { sendOTPController, verifyOTPController } = require('./otpController');
const { v4: uuidv4 } = require('uuid');

// Generate refresh and access tokens (unchanged)
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.error('Error generating tokens:', error);
    throw new ApiError(
      500,
      'Something went wrong while generating access token and refresh token'
    );
  }
};

// Register a new user (unchanged)
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

  for (const [key, value] of Object.entries(requiredFields)) {
    if (!value && key !== 'membershipNumber' && key !== 'registrationNumber') {
      throw new ApiError(400, `Field '${key}' is required`);
    }
  }

  const existingUser = await User.findOne({
    $or: [{ employeeId }, { email }, { mobileNumber }, { telephoneNumber }],
  });

  if (existingUser) {
    throw new ApiError(
      400,
      'User already exists with this employee ID, email, or phone number'
    );
  }

  const user = await User.create(requiredFields);

  const createdUser = await User.findById(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(400, 'Error while creating user');
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, 'User created successfully'));
});

// Send OTP for login
const sendOTPVerificationLogin = asyncHandler(async (req, res) => {
  const { email, password, deliveryMethod } = req.body;

  if (!email || !password || !deliveryMethod) {
    throw new ApiError(400, 'Email, password, and delivery method are required');
  }
  if (!['sms', 'email'].includes(deliveryMethod)) {
    throw new ApiError(400, 'Invalid delivery method. Use "sms" or "email"');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, 'User does not exist');
  }

  if (req.headers['x-admin-frontend'] === 'true' && user.role !== 'admin') {
    throw new ApiError(403, 'Not an admin user from this frontend');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, 'Invalid password');
  }

  const identifier = deliveryMethod === 'sms' ? user.mobileNumber : user.email;
  if (!identifier) {
    throw new ApiError(400, `User does not have a ${deliveryMethod === 'sms' ? 'mobile number' : 'email'} registered`);
  }

  try {
    const { token, identifier: returnedIdentifier, deliveryMethod: returnedMethod, message } = await sendOTPController({
      identifier,
      deliveryMethod,
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { token, identifier: returnedIdentifier, deliveryMethod: returnedMethod },
          message
        )
      );
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || 'Failed to send OTP'
    );
  }
});

// Verify OTP and login
const verifyUserOTPLogin = asyncHandler(async (req, res) => {
  const { token, otp, deliveryMethod } = req.body;

  if (!token || !otp || !deliveryMethod) {
    throw new ApiError(400, 'Token, OTP, and delivery method are required');
  }
  if (!['sms', 'email'].includes(deliveryMethod)) {
    throw new ApiError(400, 'Invalid delivery method. Use "sms" or "email"');
  }

  try {
    const { identifier, message } = await verifyOTPController({
      token,
      otp,
      deliveryMethod,
    });

    const user = await User.findOne(
      deliveryMethod === 'sms' ? { mobileNumber: identifier } : { email: identifier }
    );
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (req.headers['x-admin-frontend'] === 'true' && user.role !== 'admin') {
      throw new ApiError(403, 'This interface is for admin users only');
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(
      user._id
    );
    const loggedInUser = await User.findById(user._id).select(
      '-password -refreshToken'
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    };

    console.log('Setting cookies:', { accessToken, refreshToken });

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { loggedInUser, accessToken, refreshToken },
          'User logged in successfully'
        )
      );
  } catch (error) {
    console.error('Error in verifyUserOTPLogin:', error);
    throw error;
  }
});

// Logout user (unchanged)
const logoutUserController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, 'No refresh token found');
  }

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }

  res
    .clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    })
    .clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User logged out successfully'));
});

// Get all users (unchanged)
const getAllUsersController = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -refreshToken');

  if (!users || users.length === 0) {
    throw new ApiError(404, 'No users found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, 'Users retrieved successfully'));
});

// Get user by ID (unchanged)
const getUserByIdController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User retrieved successfully'));
});

// Update user by ID (unchanged)
const updateUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  delete updateData.password;
  delete updateData.refreshToken;
  delete updateData.role;
  delete updateData.membershipNumber;
  delete updateData.registrationNumber;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!updatedUser) {
    throw new ApiError(400, 'Error updating user');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'User updated successfully'));
});

// Delete user by ID (unchanged)
const deleteUserController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'User deleted successfully'));
});

module.exports = {
  registerUserController,
  generateAccessTokenAndRefreshToken,
  sendOTPVerificationLogin,
  verifyUserOTPLogin,
  logoutUserController,
  getAllUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
};