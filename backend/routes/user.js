const express = require("express");
const { zodSchemaSignUp, zodSchemaForLogin } = require("../ZodSchema");
const { User } = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from user home page");
});

router.get("/signup", (req, res) => {
  res.send("Hello from user signup");
});

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
    const existingUser = await User.findOne({ userName: result.data.userName });
    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const newUser = new User(result.data);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/login", (req, res) => {
  res.send("Hello from user login");
});

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
    const user = await User.findOne({ userName: result.data.userName });
    if (!user || user.password !== result.data.password) {
      // Replace plain password comparison with a hashed password check
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;
