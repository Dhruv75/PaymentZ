const express = require("express");
const zodSchema = require("../ZodSchema");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello form user home page ");
});
router.get("/signup", (req, res) => {
  res.send("Hello form user signup ");
});
router.post("/signup", (req, res) => {
  const data = req.body;
  const result = zodSchema.safeParse(data);

  if (result.success) {
    console.log("validation succesful :" + result.data);
  } else {
    console.error("validation failed ", result.error.errors);
  }

  res.send(data);
});
router.get("/login", (req, res) => {
  res.send("Hello form user login ");
});

module.exports = router;
