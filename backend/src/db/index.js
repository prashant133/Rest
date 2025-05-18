const mongoose = require("mongoose");
const DB_NAME = require("../constants");
require("dotenv").config();

const connectDB = async () => {
  try {
    // making connection with database
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );

    console.log(
      `\n MongoDB connected! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(`Mongo DB connection Error : ${error.message}`);

    // exit if connection is not successful
    process.exit(1);
  }
};

module.exports = connectDB;
