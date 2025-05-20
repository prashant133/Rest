const mongoose = require("mongoose");

const optSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },

    expiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Automatically delete expired OTPs
optSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });

optSchema.pre("validate", function (next) {
  if (!this.expiry) {
    const expiryTimeMs = 60 * 60 * 1000; // default 5 mins for login
    this.expiry = new Date(Date.now() + expiryTimeMs);
  }
  next();
});

const OTP = mongoose.model("otp", optSchema);
module.exports = OTP;
