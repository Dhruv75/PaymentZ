const express = require("express");
const { zodSchemaSignUp, zodSchemaForLogin } = require("../ZodSchema");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // For reading environment variables
const {Account} = require("../db");

const router = express.Router();

// Helper function to check if the user exists
const checkIfUserExists = async (username) => {
  try {
    const existingUser = await User.findOne({ username });
    return existingUser;
  } catch (error) {
    throw new Error("Error checking user existence");
  }
};

// User home page
router.get("/", (req, res) => {
  res.send("Hello from user home page");
});

//find user
router.get("/find", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
      $or: [
          {
              firstname: {
                  $regex: filter,
                  $options: "i",
              },
          },
          {
              lastname: {
                  $regex: filter,
                  $options: "i",
              },
          },
      ],
  });

  res.json({
      user: users.map((user) => ({
          username: user.username,
          firstname: user.firstname,
          lastname: user.lastname,
          _id: user._id,
      })),
  });
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
    const existingUser = await checkIfUserExists(result.data.username);
    if (existingUser) {
      return res.status(409).json({
        message: "username already exists",
      });
    }

    // Create a new user since username is unique
    const newUser = new User(result.data);
    await newUser.save();

    console.log("User created:", newUser);

    // Generate JWT token for the new user
    const token = jwt.sign(
      { username: newUser.username },
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
    const user = await checkIfUserExists(result.data.username);
    if (!user || user.password !== result.data.password) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { username: user.username },
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
