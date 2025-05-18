const asyncHandler = (fn) => async (req, res, next) => {
  try {
    // Execute the passed function (fn) with req, res, and next
    await fn(req, res, next);
  } catch (error) {
    // If an error occurs, send a response with the error code (if available) or default to 500
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = asyncHandler;
