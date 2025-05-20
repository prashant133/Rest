const mongoose = require("mongoose");

const eventPostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    img: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const EventPost = mongoose.model("EventPost", eventPostSchema);

module.exports = EventPost;
