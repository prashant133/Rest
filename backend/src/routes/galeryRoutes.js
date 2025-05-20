const express = require("express");
const upload = require("../middleware/multer");
// const verifyJWT = require("../middleware/verifyJWT");
// const verifyAdmin = require("../middleware/verifyAdmin");
const {
  uploadImagesController,
  deleteImageController,
  getAllImagesController,
  getImageByIdController,
} = require("../controller/galleryController");

const router = express.Router();

// Public routes
router.get("/get-all-images", getAllImagesController);
router.get("/get-image/:id", getImageByIdController);

// Admin-only routes
router.post("/upload-images", upload.array("images", 10), uploadImagesController);
router.delete("/delete-image/:id", deleteImageController);

module.exports = router;