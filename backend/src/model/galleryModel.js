const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    },
    publicId: { type: String, required: true },
    title: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
module.exports = Gallery;
