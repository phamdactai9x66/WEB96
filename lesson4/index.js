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
import jwt from "jsonwebtoken";

const env = process.env.NODE_ENV || "dev";

dotenv.config({
  path: `.env.${env}`,
});

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

// Secret key, thường được lưu trong biến môi trường (env)

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm kiếm user
    const userData = {
      id: "123",
      username: "john_doe",
      role: "user",
    };

    // Tạo AT
    const access_token = jwt.sign(
      { ...userData, tokenType: "AT" },
      process.env.SECRET_KEY,
      {
        expiresIn: "20m",
      },
    );

    // Tao RT
    const refresh_token = jwt.sign(
      { ...userData, tokenType: "RT" },
      process.env.SECRET_KEY,
      {
        expiresIn: "4w",
      },
    );

    res.status(201).send({
      message: "Login successfully!",
      access_token,
      refresh_token,
      userInfo: userData,
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

app.post("/refresh_token", (req, res) => {
  try {
    const { refresh_token } = req.query;

    if (!refresh_token) throw new Error("Refresh token is required!");

    const userInfo = jwt.verify(refresh_token, process.env.SECRET_KEY);

    // check exist user

    const userData = {
      id: userInfo.id,
      username: userInfo.username,
      role: userInfo.role,
    };

    // tao AT
    const access_token = jwt.sign({ ...userData, tokenType: "AT" }, secretKey, {
      expiresIn: "20m",
    });

    res.json({
      message: "Call refresh token successfully",
      access_token,
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
