import express from "express";
import mongoose from "mongoose";

import UsersModel from "./model/users.js";

import CustomerModel from "./model/customer.js";

import customerController from "./controller/customers.js";

import userController from "./controller/users.js";

import userRouter from "./routers/users.js";

import customerRouter from "./routers/customers.js";

import auth from "./middlewares/auth.js";

//   local db
const url_db = "mongodb://localhost:27017/fullstack-web";

const app = express();

app.use(express.json());

function myLogger(req, res, next) {
  console.log(`Received request for: ${req.url}`);
  next(); // Để middleware tiếp theo hoặc xử lý route chính tiếp tục được gọi
}

// Authentication (Facebook)

app.use(myLogger);

// all route customer
app.use("/customers", customerRouter);

// get all users == Admin
app.use("/users", auth.auhthorizationAdmin, userRouter);

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
