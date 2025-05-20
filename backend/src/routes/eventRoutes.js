const express = require("express");
const upload = require("../middleware/multer");
const {
  createEventContoller,
  getAllEventController,
} = require("../controller/eventController");

const router = express.Router();

router.post("/create-event", upload.array("images", 5), createEventContoller);
router.get("/get-all-event", getAllEventController);

module.exports = router;
