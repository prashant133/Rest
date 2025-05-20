const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../model/userModel");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // retrive the token either cookiesor the authorization header

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "").trim();

    // if no token is provided
    if (!token) {
      throw new ApiError(401, "unauthorized access");
    }

    // verif the token using the secret key and decode the otkne payload
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Fetch the user from the database using the decoded user ID.
    // Exclude sensitive fields like password and refreshToken from the query result.

    const user = await User.findById(decodeToken?._id).select(
      "-password -refreshToken"
    );

    // If the user does not exist, throw an error indicating an invalid token.
    if (!user) {
      throw new ApiError(401, "Invalid Token");
    }

    // Attach the user information to the request object for further use.
    req.user = user;

    // Pass control to the next middleware in the stack.
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

module.exports = verifyJWT;
