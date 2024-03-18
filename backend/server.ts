import express, { Request, Response, NextFunction } from "express";
import mongoose, { Error } from "mongoose";
import cors from "cors";
import { userRoutes } from "./routes/user";

interface CustomError extends Error {
  status?: number;
}

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
app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    res
      .status(error.status || 500)
      .json({ message: error.message || "An unexpected error occurred" });
  }
);

// connect to MongoDB
if (MONGODB_URL) {
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
} else {
  console.error("MONGODB_URL is not defined");
}
