const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Defining storage options for multer
const storage = multer.diskStorage({
  // Specifies the destination directory where files should be saved
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "public", "temp");

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true }); // Creates the directory if it doesn't exist
    }

    cb(null, uploadPath); // Saves uploaded files to the '.public/temp' folder
  },
  // Specifies the filename of the uploaded file
  filename: function (req, file, cb) {
    // Generate a unique filename using UUID and file extension
    const uniqueSuffix = uuidv4() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix); // Combines the field name with the unique suffix
  },
});

// Defining file filter to validate file types
const fileFilter = (req, file, cb) => {
  // Allowed image file types (jpeg, jpg, png, gif)
  const allowedTypes = /jpeg|jpg|png|gif/;

  // Check if the file extension matches allowed types (case-insensitive)
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // Check if the MIME type matches allowed types
  const mimeType = allowedTypes.test(file.mimetype);

  // If both checks pass, allow the file, otherwise reject it
  if (extname && mimeType) {
    return cb(null, true); // File is allowed
  } else {
    cb(new Error("Only image files are allowed!"), false); // Reject non-image files
  }
};

// Creating the multer upload middleware with storage and file filter options
const upload = multer({
  storage: storage, // Specifies the storage options
  fileFilter: fileFilter, // Specifies the file filter function
  limits: { fileSize: 5 * 1024 * 1024 }, // Limits file size to 5MB
});

module.exports = upload;
