const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./model/userModel");

// Force load .env.production
dotenv.config({ path: ".env.production" });
console.log("Loaded environment from: .env.production");
console.log("MONGO_URI:", process.env.MONGO_URI);

async function registerAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env.production");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminData = {
      employeeId: "ADMIN10",
      username: "admin10",
      surname: "admin10",
      address: "address",
      province: "provie",
      district: "distct",
      municipality: "munipality",
      wardNumber: "2",
      tole: "toe",
      telephoneNumber: "12341s32132",
      mobileNumber: "9851347856",
      dob: "1990-01-10",
      postAtRetirement: "admin",
      pensionLeaseNumber: "PLN10",
      office: "head offce",
      serviceStartDate: "2010-01-10",
      serviceRetirementDate: "2040-01-10",
      membershipNumber: "MN10",
      registrationNumber: "RN10",
      dateOfFillUp: "2023-01-10",
      place: "plae",
      email: "restntcadmi@gmail.com",
      password: "admin123", // let model handle hashing
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
