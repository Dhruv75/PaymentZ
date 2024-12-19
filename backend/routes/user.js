const express = require("express");
const { zodSchemaSignUp, zodSchemaForLogin } = require("../ZodSchema");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // For reading environment variables

const router = express.Router();

// Helper function to check if the user exists
const checkIfUserExists = async (userName) => {
  try {
    const existingUser = await User.findOne({ userName });
    return existingUser;
  } catch (error) {
    throw new Error("Error checking user existence");
  }
};

// User home page
router.get("/", (req, res) => {
  res.send("Hello from user home page");
});

// Signup page
router.get("/signup", (req, res) => {
  res.send("Hello from user signup");
});

// Signup handler
router.post("/signup", async (req, res) => {
  const data = req.body;
  const result = zodSchemaSignUp.safeParse(data);

  if (!result.success) {
    console.error("Validation failed:", result.error.errors);
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors,
    });
  }

  try {
    // Check if user exists
    const existingUser = await checkIfUserExists(result.data.userName);
    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    // Create a new user since username is unique
    const newUser = new User(result.data);
    await newUser.save();

    console.log("User created:", newUser);

    // Generate JWT token for the new user
    const token = jwt.sign(
      { userName: newUser.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Return success message with the new user and token
    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token: token, // Send JWT token back to the client
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Login page
router.get("/login", (req, res) => {
  res.send("Hello from user login");
});

// Login handler
router.post("/login", async (req, res) => {
  const data = req.body;
  const result = zodSchemaForLogin.safeParse(data);

  if (!result.success) {
    console.error("Validation failed:", result.error.errors);
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors,
    });
  }

  try {
    // Check if the user exists
    const user = await checkIfUserExists(result.data.userName);
    if (!user || user.password !== result.data.password) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send response with user info and token
    res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
