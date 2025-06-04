const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const User = require("./model/userModel");

// Load .env file from D:\rest\backend\src
dotenv.config();

// Debug: Log MONGO_URI to verify
console.log("MONGO_URI:", process.env.MONGO_URI);

async function registerAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminData = {
      employeeId: "ADMIN002",
      username: "admin2",
      surname: "admin",
      address: "admin address",
      province: "province",
      district: "district",
      municipality: "municipality",
      wardNumber: "1",
      tole: "tole",
      telephoneNumber: "12345678922",
      mobileNumber: "9876543230",
      dob: "1990-01-01",
      postAtRetirement: "admin",
      pensionLeaseNumber: "PLN002",
      office: "head office",
      serviceStartDate: "2010-01-01",
      serviceRetirementDate: "2040-01-01",
      membershipNumber: "MN002",
      registrationNumber: "RN002",
      dateOfFillUp: "2023-01-01",
      place: "place",
      email: "zevilsshrestha007@gmail.com",
      password: "admin123",
      role: "admin",
    };

    const existingUser = await User.findOne({
      $or: [{ employeeId: adminData.employeeId }, { email: adminData.email }],
    });

    if (existingUser) {
      console.log("Admin already exists");
      return;
    }

    // Optional: Hash password with bcrypt
    const bcrypt = require("bcrypt");
    adminData.password = await bcrypt.hash(adminData.password, 10);

    await User.create(adminData);
    console.log("Admin registered successfully");
  } catch (error) {
    console.error("Error registering admin:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

registerAdmin();