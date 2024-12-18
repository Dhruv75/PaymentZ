const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const userRouter = require("./routes/user");

app.use("/user", userRouter);

app.get("/", function (req, res) {
  res.send("hello form home page");
});

async function ConnectDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.error("There is some error when connecting to DB:", error.message);
  }
}

ConnectDB();

app.listen(3000, function () {
  console.log("server started on port 3000");
});
