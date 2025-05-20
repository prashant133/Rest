const { uploadOnCloudinary } = require("../utils/cloudinary");

const getSubfolderByMimeType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "Images";
  if (mimetype.startsWith("video/")) return "Videos";
  if (
    mimetype === "application/pdf" ||
    mimetype.includes("word")
  ) return "Documents";
  return "Others";
};

const uploadFileWithFolderLogic = async (filePath, mimetype, context = "General") => {
  const subfolder = getSubfolderByMimeType(mimetype);
  const folder = `${context}/${subfolder}`; // e.g., Event Files/Images
  return await uploadOnCloudinary(filePath, folder);
};

module.exports = {
  uploadFileWithFolderLogic,
};
