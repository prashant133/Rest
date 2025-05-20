const express = require("express");
const {
	createEventPost,
	getEventPost,
	deleteEventPost,
	editEventPost,
	getUserEventPosts,
	getEventFeedPosts,
} = require("../controller/eventController.js");
const verifyJWT = require("../middleware/authMiddleware.js");

const upload=require("../middleware/multer.js");

const router = express.Router();

router.get("/eventfeed", verifyJWT, getEventFeedPosts);
router.get("/:id", verifyJWT, getEventPost);
router.get("/user/:username", verifyJWT, getUserEventPosts);
router.post("/create",upload.single("img"), createEventPost);
router.put("/:id", editEventPost);
router.delete("/:id", deleteEventPost);

module.exports = router;
