const asyncHandler = require("../utils/asyncHandler");
const Event = require("../model/eventModel");
const uploadOnCloudinary = require("../utils/cloudinary");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// crate event
const createEventContoller = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  //   validate the data
  if (!title || !description) {
    throw new ApiError(400, "All fields are required");
  }

  //   check for the existing event
  const existingEvent = await Event.findOne({ title });

  if (existingEvent) {
    throw new ApiError(400, "event already exists");
  }

  if (!req.files || req.files.length < 1 || req.files.length > 5) {
    throw new ApiError(400, "At least one image should be uploaded (max 5)");
  }

  const imageUrls = [];
  for (const file of req.files) {
    const result = await uploadOnCloudinary(file.path, "Event Images");

    if (result && result.secure_url) {
      imageUrls.push(result.secure_url);
    }
  }

  if (imageUrls.length === 0) {
    throw new ApiError(400, "NO image urls");
  }

  const event = await Event.create({
    title,
    description,
    images: imageUrls,
  });

  //   created event
  const createdEvent = await Event.findById(event._id);

  return res
    .status(201)
    .json(new ApiResponse(201, createdEvent, "Event created successfully"));
});

// get all event
const getAllEventController = asyncHandler(async (req, res) => {
  const event = await Event.find({}).sort({ createdAt: -1 });

  if (!event.length) {
    throw new ApiError(400, "No event found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, event, "All events fetched"));
});

module.exports = { createEventContoller, getAllEventController };
