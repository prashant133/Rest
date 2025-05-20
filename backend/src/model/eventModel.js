const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },  
    images: {
      type: [String], //cloudinary
      validate: {
        validator: function (value) {
          return value.length <= 5; //only 5 image
        },
        message: "you can only upload upto 5 images",
      },
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
