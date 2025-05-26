const express = require("express");
const upload = require("../middleware/multer");
// const verifyJwt=require("../middleware/authMiddleware");
// const verifyAdmin=require("../middleware/verifyAdmin");

const {
  createEventContoller,
  getAllEventController,
  getEventController,
  updateEventController,
  deleteEventController,
  deleteEventFileController,
} = require("../controller/eventController");

const router = express.Router();

// Public routes
router.get("/get-all-event", getAllEventController);
router.get("/get-event/:id", getEventController);

// Admin-only routes
router.post("/create-event", upload.array("files", 10), createEventContoller);
router.put("/update-event/:id", upload.array("files", 10), updateEventController);
router.delete("/delete-event/:id",  deleteEventController);
router.delete("/delete-event-file/:id/:fileUrl", deleteEventFileController);

module.exports = router;