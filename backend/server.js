const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
require("dotenv").config();
const { MONGODB_URL, BACKEND_PORT } = process.env;

// express app
const app = express();

// middleware
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// routes
app.use("/api/auth", userRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res
    .status(error.status || 500)
    .json({ message: error.message || "An unexpected error occurred" });
});

// connect to MongoDB
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(BACKEND_PORT, () => {
      console.log(
        "Connected to MongoDB and listening on port",
        process.env.BACKEND_PORT
      );
    });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });