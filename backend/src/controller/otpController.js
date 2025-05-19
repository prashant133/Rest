const OTP = require("../model/otpModel");
const asyncHandler = require("../utils/asyncHandler");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

const sendOTPController = asyncHandler(async (email) => {
  if (!email) {
    throw new ApiError(400, "Email is not defined");
  }
  // 3. Generate OTP
  const otp = generateOTP();
  console.log(otp);

  // 4. Delete previous OTPs for this email
  await OTP.deleteMany({ email });

  // 5. Create new OTP record

  const otpRecord = await OTP.create({ email, otp });

  // 6. Prepare response data
  const responseData = {
    otp: otpRecord.otp,
    email: email,
  };

  // 7. Send email
  try {
    await sendEmail({
      to: email,
      subject: `Your OTP Code`,
      text: `Your OTP code is ${otp}. It will expire at ${otpRecord.expiry}`,
      html: `<strong>Your OTP code is ${otp}. It will expire at ${otpRecord.expiry}</strong>`,
    });

    return responseData;
  } catch (error) {
    console.error("Email sending failed:", error);
    // Clean up: Delete the OTP record if email failed
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(500, "Failed to send OTP email. Please try again.");
  }
});

const verifyOTPController = asyncHandler(async (otp) => {
  if (!otp) {
    throw new ApiError(400, "All fields are required");
  }

  const otpRecord = await OTP.findOne({ otp });
  if (!otpRecord) {
    throw new ApiError(404, "OTP not found or expired");
  }

  // Compare the OTP string properly
  if (otpRecord.otp !== otp) {
    throw new ApiError(400, "OTP does not match");
  }

  if (otpRecord.expiry < new Date()) {
    await OTP.findByIdAndDelete(otpRecord._id);
    throw new ApiError(400, "OTP has expired");
  }

  // Get the email
  const email = otpRecord.email;
  console.log(email);

  return {
    email: email,
  };
});
module.exports = { sendOTPController, verifyOTPController };
