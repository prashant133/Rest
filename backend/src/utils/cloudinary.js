const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// uploading file to cloudinary
const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    // Check if the file is in the local space
    if (!localFilePath) return "File is not on local space";

    // Upload the file now, specifying the folder
    const uploadFile = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName, // Specify the folder where you want to upload the file
    });

    // Delete the local file after upload
    fs.unlinkSync(localFilePath);
    return uploadFile;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Remove the locally saved temp file as the operation failed
    return null;
  }
};

module.exports = uploadOnCloudinary;
