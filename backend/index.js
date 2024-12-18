const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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
    await mongoose.connect(
      "mongodb+srv://dhruvkashyap458:KLmqr9rC9iDVl6qC@cluster0.4unrm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to DB");
  } catch (error) {
    console.error("There is some error when connecting to DB:", error.message);
  }
}

ConnectDB();

app.listen(3000, function () {
  console.log("server started on port 3000");
});
