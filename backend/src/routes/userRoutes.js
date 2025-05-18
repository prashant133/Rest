const express = require("express");
const { registerUserController } = require("../controller/userController");

const router = express.Router();

router.post("/", registerUserController);

module.exports = router;
