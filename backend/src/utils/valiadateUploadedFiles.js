
const ApiError = require("./ApiError");

function validateUploadedFiles(files, maxFiles = 10) {
  if (!files || files.length < 1 || files.length > maxFiles) {
    throw new ApiError(400, `At least one file is required (max ${maxFiles})`);
  }
  
  // Debug log for uploaded files
    console.log("Uploaded files paths for update:", req.files.map(file => file.path));

  const fileCounts = {
    images: 0,
    videos: 0,
    documents: 0,
  };

  files.forEach((file) => {
    if (file.mimetype.startsWith("image/")) fileCounts.images++;
    else if (file.mimetype.startsWith("video/")) fileCounts.videos++;
    else if (
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("msword")
    ) fileCounts.documents++;
  });

  if (fileCounts.images > 5) throw new ApiError(400, "Maximum 5 images allowed");
  if (fileCounts.videos > 3) throw new ApiError(400, "Maximum 3 videos allowed");
  if (fileCounts.documents > 2) throw new ApiError(400, "Maximum 2 documents allowed");
}

module.exports = validateUploadedFiles;
