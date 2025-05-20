const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// 🔴 Replace these with your actual Cloudinary credentials
cloudinary.config({
  cloud_name: "ddiswbjbw",
  api_key: "272882952667473",
  api_secret: "tRZTJajq6JgdSmFxTdeiZtndxpk",
});

const uploadOnCloudinary = async (localFilePath, folderName = "uploads") => {
  try {
    if (!localFilePath) throw new Error("File path is missing");

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName,
    });

    fs.unlinkSync(localFilePath); // Cleanup local file
    return uploadResult;
  } catch (error) {
    try {
      fs.unlinkSync(localFilePath); // Attempt cleanup
    } catch (_) {}
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

const deleteImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

module.exports = {
  uploadOnCloudinary,
  deleteImage,
};
