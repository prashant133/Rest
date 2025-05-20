const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
dotenv.config();

const app = express();

// to communicate with frontend and to allow the only certain server to communicate with our backend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
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

app.use("/api/v1/user/", userRouter);
app.use("/api/v1/event/", eventRouter);

module.exports = app;
