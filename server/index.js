// Root of the application

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

const mongoose = require("mongoose");

require("dotenv").config();
const port = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("Welcome out chat app API");
});

const userRoute = require("./Routes/userRoute");
app.use("/api/users", userRoute);

const chatRoute = require("./Routes/chatRoute");
app.use("/api/chats", chatRoute);

app.listen(port, (req, res) => {
  console.log("Server running on port: ", port);
});

mongoose
  .connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection failed: ", error.message);
  });
