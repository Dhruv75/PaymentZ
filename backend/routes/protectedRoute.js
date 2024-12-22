
const express = require("express");
const { authMiddleware } = require("../authMiddleware");
const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.send("Hello from Protected route  home page");
  console.log(req.username);
});

module.exports = router;
