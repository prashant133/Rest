const asyncHandler = require("../utils/asyncHandler");
const Event = require("../model/eventModel");
const validateUploadedFiles=require("../utils/valiadateUploadedFiles")
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const {uploadFileWithFolderLogic}=require("../helper/cloudinaryHepler")
const mongoose = require("mongoose");



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
   validateUploadedFiles(req.files); 


  // Upload files to Cloudinary
  const files = [];
  for (const file of req.files) {
    try {
      const result = await uploadFileWithFolderLogic(file.path,file.mimetype,"Event Files");
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


  //validatefiletype
  if (req.files && req.files.length > 0) {

    validateUploadedFiles(req.files);
  
    //uploads on clouinary
    const files = [];
    for (const file of req.files) {
      try {
        const result = await uploadFileWithFolderLogic(file.path,file.mimetype,"Event Files");
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