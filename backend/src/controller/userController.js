const asyncHandler = require("../utils/asyncHandler");

const registerUserController = asyncHandler(async (req, res) => {
  res.send("hello");
});

module.exports = { registerUserController };
