import express from "express";
import mongoose from "mongoose";

import UsersModel from "./model/users.js";

//   local db
const url_db = "mongodb://localhost:27017/fullstack-web";

const app = express();

app.use(express.json());

app.post("/api/v1/users", async (req, res) => {
  try {
    const { userName, email } = req.body;
    if (!userName) throw new Error("userName is required!");
    if (!email) throw new Error("email is required!");

    const createdUser = await UsersModel.create({
      userName,
      email,
    });

    res.status(201).send({
      data: createdUser,
      message: "Register successful!",
      success: true,
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

mongoose
  .connect(url_db)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(8080, () => {
      console.log("Server is running!");
    });
  })
  .catch((error) => {
    console.log(error);
  });
