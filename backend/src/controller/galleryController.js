    const asyncHandler = require("../utils/asyncHandler");
    const Gallery = require("../model/galleryModel");
    const { uploadOnCloudinary, deleteImage } = require("../utils/cloudinary");
    const ApiError = require("../utils/ApiError");
    const ApiResponse = require("../utils/ApiResponse");
    const mongoose = require("mongoose");

    // Upload images (Admin only)
    const uploadImagesController = asyncHandler(async (req, res) => {
    const { title } = req.body;

    // Validate file uploads
    if (!req.files || req.files.length < 1 || req.files.length > 10) {
        throw new ApiError(400, "At least one image is required (max 10)");
    }

    // Validate file types (only images)
    const allowedImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    req.files.forEach((file) => {
        if (!allowedImageTypes.includes(file.mimetype)) {
        throw new ApiError(400, "Only JPEG, PNG, GIF, or WebP images are allowed");
        }
    });

    // Upload files to Cloudinary
    const images = [];
    for (const file of req.files) {
        try {
        const result = await uploadOnCloudinary(file.path, "Gallery Images");
        console.log(`Cloudinary upload result for ${file.path}:`, result);
        if (result && result.secure_url) {
            images.push({
                url: result.secure_url,
                type: file.mimetype,
                publicId: result.public_id,
                title: title || undefined,
            });

        } else {
            console.error(`No secure_url for file ${file.path}`);
        }
        } catch (error) {
        console.error(`Failed to upload file ${file.path}:`, error.message);
        }
    }

    if (images.length === 0) {
        throw new ApiError(400, "Failed to upload any images to Cloudinary");
    }

    // Save images to MongoDB
    const savedImages = await Gallery.insertMany(images);
    console.log("✅ Images saved to MongoDB:", savedImages);


    return res
        .status(201)
        .json(new ApiResponse(201, savedImages, "Images uploaded successfully"));
    });

    // Delete image by ID (Admin only)
    const deleteImageController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid image ID");
    }

    const image = await Gallery.findById(id);
    if (!image) {
        throw new ApiError(404, "Image not found");
    }

    // Delete from Cloudinary
    try {
        await deleteImage(image.publicId);
    } catch (error) {
        throw new ApiError(500, `Failed to delete image from Cloudinary: ${error.message}`);
    }

    // Delete from MongoDB
    await Gallery.findByIdAndDelete(id);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Image deleted successfully"));
    });

    // Get all images (Public)
    const getAllImagesController = asyncHandler(async (req, res) => {
    const images = await Gallery.find({}).sort({ createdAt: -1 });

    if (!images.length) {
        throw new ApiError(404, "No images found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, images, "All images fetched successfully"));
    });

    // Get image by ID (Public)
    const getImageByIdController = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid image ID");
    }

    const image = await Gallery.findById(id);

    if (!image) {
        throw new ApiError(404, "Image not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, image, "Image fetched successfully"));
    });

    module.exports = {
    uploadImagesController,
    deleteImageController,
    getAllImagesController,
    getImageByIdController,
    };