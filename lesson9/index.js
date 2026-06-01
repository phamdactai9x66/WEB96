import express from "express";

import dotenv from "dotenv";

import mongoose from "mongoose";

const app = express();

const env = process.env.NODE_ENV || "dev";

dotenv.config({
  path: `.env.${env}`,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
