import express from "express";
import mongoose from "mongoose";

import UsersModel from "./model/users.js";

import CustomerModel from "./model/customer.js";

import customerController from "./controller/customers.js";

import userController from "./controller/users.js";

import userRouter from "./routers/users.js";

import customerRouter from "./routers/customers.js";

import auth from "./middlewares/auth.js";

import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

//   local db
const url_db = "mongodb://localhost:27017/fullstack-web";

const app = express();

app.use(express.json());

console.log(`process.env.DATABASE_URL: ${process.env.DATABASE_URL}`);

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

const saltRounds = 10;

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  // tạo chuỗi ngẫu nhiên
  const salt = bcrypt.genSaltSync(saltRounds);
  // thực hiện mã hoá với chuỗi salt
  const hash = bcrypt.hashSync(password, salt);

  const newUser = await UsersModel.create({ email, password: hash, salt });

  res.status(201).json({
    message: "Register with hash password!",
    userInfo: newUser,
    success: true,
  });
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // tìm thông tin user | tài khoản với email được gửi lên
    const currentUser = await UsersModel.findOne({ email });

    if (!currentUser) throw new Error("Sai tài khoản hoặc mật khẩu");

    const hashingPasswordLogin = bcrypt.hashSync(password, currentUser.salt);

    // compare password
    if (hashingPasswordLogin !== currentUser.password)
      throw new Error("Sai tài khoản hoặc mật khẩu");

    res.status(201).send({
      message: "Login successfully!",
      email,
      userInfo: currentUser,
      // v.v user info
    });
  } catch (error) {
    res.status(500).send({
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

    app.listen(process.env.PORT, () => {
      console.log("Server is running!");
    });
  })
  .catch((error) => {
    console.log(error);
  });
