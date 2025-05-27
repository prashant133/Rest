const OTP = require("../model/otpModel");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

const sendOTPController = asyncHandler(async (email) => {
  if (!email) {
    throw new ApiError(400, "Email is not defined");
  }
  // Generate OTP
  const otp = generateOTP();
  console.log("Generated OTP:", otp);

  // Delete previous OTPs for this email
  await OTP.deleteMany({ email });

  // Create new OTP record
  const otpRecord = await OTP.create({ email, otp });

  // Prepare response data
  const responseData = {
    otp: otpRecord.otp,
    email: email,
  };

  // Send email
  try {
    await sendEmail({
      to: email,
      subject: `Your OTP Code`,
      text: `Your OTP code is ${otp}. It will expire at ${otpRecord.expiry}`,
      html: `<strong>Your OTP code is ${otp}. It will expire at ${otpRecord.expiry}</strong>`,
    });
    console.log("Email sent successfully:", email);
    return responseData;
  } catch (error) {
    console.error("Email sending failed:", error);
    // Clean up: Delete the OTP record if email failed
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(500, "Failed to send OTP email. Please try again.");
  }
});

const verifyOTPController = asyncHandler(async (otp) => {
  console.log("Verifying OTP:", otp);
  if (!otp) {
    console.log("No OTP provided");
    throw new ApiError(400, "OTP is required");
  }

  const otpRecord = await OTP.findOne({ otp });
  if (!otpRecord) {
    console.log("OTP not found for:", otp);
    throw new ApiError(404, "OTP not found or expired");
  }

  if (otpRecord.otp !== otp) {
    console.log("OTP mismatch:", otpRecord.otp, "vs", otp);
    throw new ApiError(400, "OTP does not match");
  }

  if (otpRecord.expiry < new Date()) {
    console.log("OTP expired for:", otp);
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(400, "OTP has expired");
  }

  const result = { email: otpRecord.email };
  console.log("Returning OTP verification result:", result);
  return result;
});

module.exports = { sendOTPController, verifyOTPController };