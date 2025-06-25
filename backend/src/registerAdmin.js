const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./model/userModel");

// Load .env file
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
      employeeId: "ADMIN001",
      username: "admin1",
      surname: "admin1",
      address: "address",
      province: "provie",
      district: "distct",
      municipality: "munipality",
      wardNumber: "2",
      tole: "toe",
      telephoneNumber: "12341s32132",
      mobileNumber: "9861599595",
      dob: "1990-01-11",
      postAtRetirement: "admin",
      pensionLeaseNumber: "PLN001",
      office: "head offce",
      serviceStartDate: "2010-01-1",
      serviceRetirementDate: "2040-01-1",
      membershipNumber: "MN001",
      registrationNumber: "RN001",
      dateOfFillUp: "2023-01-11",
      place: "plae",
      email: "zevilsshrestha007@gmail.com",
      password: "admin123", // Do NOT hash here; let the model handle it
      role: "admin",
    };

    const existingUser = await User.findOne({
      $or: [{ employeeId: adminData.employeeId }, { email: adminData.email }],
    });

    if (existingUser) {
      console.log("Admin already exists");
      return;
    }

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