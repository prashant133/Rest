const ApiError = require("./ApiError");

function validateUserFiles(files) {
  if (!files || !files.profilePic || files.profilePic.length !== 1) {
    throw new ApiError(400, "Exactly one profile picture is required");
  }

  if (files.additionalFile && files.additionalFile.length > 1) {
    throw new ApiError(400, "Only one additional file is allowed");
  }

  const profilePic = files.profilePic[0];
  if (!profilePic.mimetype.startsWith("image/")) {
    throw new ApiError(400, "Profile picture must be an image");
  }

  if (files.additionalFile) {
    const additionalFile = files.additionalFile[0];
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(additionalFile.mimetype)) {
      throw new ApiError(400, "Additional file must be an image, PDF, or Word document");
    }
  }
}

module.exports = validateUserFiles;