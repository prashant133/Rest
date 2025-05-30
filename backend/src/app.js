const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
dotenv.config();

const app = express();

// to communicate with frontend and to allow the only certain server to communicate with our backend
// Define allowed origins
  const allowedOrigins = [
    process.env.CORS_ORIGIN, // http://localhost:3000
    process.env.USER_CORS_ORIGIN, // http://localhost:5173
  ];
// Configure CORS to allow multiple origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// to commmunicate with json file ans setting limit for the json so that serer does no crash dur ot over load of jason dat
app.use(express.json({ limit: "16kb" }));

// most of the url are encoded so to make machine understand this url this is done
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// to save or communicate with static file
app.use(express.static("public"));

// to communicate with cookie
app.use(cookieParser());

// import routes
const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes")
const galleryRouter=require("./routes/galeryRoutes")

app.use("/api/v1/user/", userRouter);
app.use("/api/v1/event/", eventRouter);
app.use("/api/v1/gallery/",galleryRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("Error in request:", err);
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});


module.exports = app;
