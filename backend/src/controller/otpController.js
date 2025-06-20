const OTP = require('../model/otpModel');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { requestOtp, confirmOtp } = require('../utils/soapOtp');
const generateOTP = require('../utils/generateOTP');
const sendEmail = require('../utils/sendEmail');

const sendOTPController = asyncHandler(async ({ identifier, deliveryMethod }) => {
  if (!identifier || !deliveryMethod) {
    throw new ApiError(400, 'Identifier and delivery method are required');
  }
  if (!['sms', 'email'].includes(deliveryMethod)) {
    throw new ApiError(400, 'Invalid delivery method. Use "sms" or "email"');
  }

  // Delete previous OTPs/tokens for this identifier
  const query =
    deliveryMethod === 'sms' ? { mobileNumber: identifier } : { email: identifier };
  await OTP.deleteMany(query);

  let token;
  let message;

  if (deliveryMethod === 'sms') {
    // Send OTP via NTC SOAP API
    const { success, token: jwtToken, message: smsMessage } = await requestOtp(identifier);
    if (!success) {
      throw new ApiError(400, smsMessage);
    }
    token = jwtToken;
    message = smsMessage;
  } else {
    // Generate and send OTP via email
    const otp = generateOTP();
    try {
      await sendEmail({
        to: identifier,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        html: `<strong>Your OTP code is ${otp}. It will expire in 5 minutes.</strong>`,
      });
      token = otp;
      message = 'OTP sent successfully via email';
    } catch (error) {
      throw new ApiError(500, 'Failed to send OTP email');
    }
  }

  // Store OTP/token in MongoDB
  const otpRecord = await OTP.create({
    [deliveryMethod === 'sms' ? 'mobileNumber' : 'email']: identifier,
    token,
    deliveryMethod,
  });

  return {
    token,
    identifier,
    deliveryMethod,
    message,
  };
});

const verifyOTPController = asyncHandler(async ({ token, otp, deliveryMethod }) => {
  if (!token || !otp || !deliveryMethod) {
    throw new ApiError(400, 'Token, OTP, and delivery method are required');
  }
  if (!['sms', 'email'].includes(deliveryMethod)) {
    throw new ApiError(400, 'Invalid delivery method. Use "sms" or "email"');
  }

  // Find OTP/token record
  const otpRecord = await OTP.findOne({ token, deliveryMethod });
  if (!otpRecord) {
    throw new ApiError(404, 'Token/OTP not found or expired');
  }

  let identifier;
  let message;

  if (deliveryMethod === 'sms') {
    // Verify OTP via NTC SOAP API
    const { success, mdn, message: smsMessage } = await confirmOtp(token, otp);
    if (!success) {
      await OTP.findByIdAndDelete(otpRecord._id);
      throw new ApiError(400, smsMessage);
    }
    identifier = mdn;
    message = smsMessage;
  } else {
    // Verify email OTP
    if (otpRecord.token !== otp) {
      await OTP.findByIdAndDelete(otpRecord._id);
      throw new ApiError(400, 'Invalid OTP');
    }
    if (otpRecord.expiry < new Date()) {
      await OTP.findByIdAndDelete(otpRecord._id);
      throw new ApiError(400, 'OTP has expired');
    }
    identifier = otpRecord.email;
    message = 'OTP verified successfully';
  }

  // Delete OTP/token after successful verification
  await OTP.findByIdAndDelete(otpRecord._id);

  return {
    identifier,
    deliveryMethod,
    message,
  };
});

module.exports = { sendOTPController, verifyOTPController };