const asyncHandler = require("../utils/asyncHandler");
const Event = require("../model/eventModel");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const mongoose = require("mongoose");

// Debug log to verify import
console.log("Cloudinary import:", require("../utils/cloudinary"));

// Create event (Admin only)
const createEventContoller = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Validate input
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  // Check for existing event
  const existingEvent = await Event.findOne({ title });

  if (existingEvent) {
    throw new ApiError(400, "Event already exists");
  }

  // Validate file uploads
  if (!req.files || req.files.length < 1 || req.files.length > 10) {
    throw new ApiError(400, "At least one file is required (max 10)");
  }

  // Debug log for uploaded files
  console.log("Uploaded files paths:", req.files.map(file => file.path));

  // Validate file type limits
  const fileCounts = {
    images: 0,
    videos: 0,
    documents: 0,
  };

  req.files.forEach((file) => {
    if (file.mimetype.startsWith("image/")) fileCounts.images++;
    else if (file.mimetype.startsWith("video/")) fileCounts.videos++;
    else if (
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("msword")
    ) fileCounts.documents++;
  });

  if (fileCounts.images > 5) throw new ApiError(400, "Maximum 5 images allowed");
  if (fileCounts.videos > 3) throw new ApiError(400, "Maximum 3 videos allowed");
  if (fileCounts.documents > 2) throw new ApiError(400, "Maximum 2 document allowed");

  // Upload files to Cloudinary
  const files = [];
  for (const file of req.files) {
    try {
      const result = await uploadOnCloudinary(file.path, "Event Files");
      console.log(`Cloudinary upload result for ${file.path}:`, result);
      if (result && result.secure_url) {
        files.push({
          url: result.secure_url,
          type: file.mimetype,
        });
      } else {
        console.error(`No secure_url for file ${file.path}`);
      }
    } catch (error) {
      console.error(`Failed to upload file ${file.path}:`, error.message);
    }
  }

  if (files.length === 0) {
    throw new ApiError(400, "Failed to upload any files to Cloudinary");
  }

  // Debug log for files array before saving
  console.log("Files array before saving:", files);

  // Create event
  const event = await Event.create({
    title,
    description,
    files,
  });

  const createdEvent = await Event.findById(event._id);

  return res
    .status(201)
    .json(new ApiResponse(201, createdEvent, "Event created successfully"));
});

// Get all events
const getAllEventController = asyncHandler(async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });

  if (!events.length) {
    throw new ApiError(404, "No events found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, events, "All events fetched successfully"));
});

// Get single event by ID
const getEventController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid event ID");
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event fetched successfully"));
});

// Update event (Admin only)
const updateEventController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid event ID");
  }

  if (!title && !description && (!req.files || req.files.length === 0)) {
    throw new ApiError(400, "At least one field must be provided for update");
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (title) event.title = title;
  if (description) event.description = description;

  if (req.files && req.files.length > 0) {
    if (req.files.length > 10) {
      throw new ApiError(400, "Cannot upload more than 10 files");
    }

    // Debug log for uploaded files
    console.log("Uploaded files paths for update:", req.files.map(file => file.path));

    // Validate file type limits
    const fileCounts = {
      images: 0,
      videos: 0,
      documents: 0,
    };

    req.files.forEach((file) => {
      if (file.mimetype.startsWith("image/")) fileCounts.images++;
      else if (file.mimetype.startsWith("video/")) fileCounts.videos++;
      else if (
        file.mimetype === "application/pdf" ||
        file.mimetype.includes("msword")
      ) fileCounts.documents++;
    });

    if (fileCounts.images > 5) throw new ApiError(400, "Maximum 5 images allowed");
    if (fileCounts.videos > 3) throw new ApiError(400, "Maximum 3 videos allowed");
    if (fileCounts.documents > 2) throw new ApiError(400, "Maximum 2 document allowed");

    const files = [];
    for (const file of req.files) {
      try {
        const result = await uploadOnCloudinary(file.path, "Event Files");
        console.log(`Cloudinary upload result for ${file.path}:`, result);
        if (result && result.secure_url) {
          files.push({
            url: result.secure_url,
            type: file.mimetype,
          });
        } else {
          console.error(`No secure_url for file ${file.path}`);
        }
      } catch (error) {
        console.error(`Failed to upload file ${file.path}:`, error.message);
      }
    }

    if (files.length > 0) {
      event.files = files;
    }
  }

  // Debug log for event before saving
  console.log("Event before saving:", event);

  await event.save();

  return res
    .status(200)
    .json(new ApiResponse(200, event, "Event updated successfully"));
});

// Delete event (Admin only)
const deleteEventController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid event ID");
  }

  const event = await Event.findByIdAndDelete(id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Event deleted successfully"));
});

module.exports = {
  createEventContoller,
  getAllEventController,
  getEventController,
  updateEventController,
  deleteEventController,
};