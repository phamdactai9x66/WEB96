import express from "express";
import mongoose from "mongoose";

import UsersModel from "./model/users.js";

import CustomerModel from "./model/customer.js";

import customerController from "./controller/customers.js";

import userController from "./controller/users.js";

//   local db
const url_db = "mongodb://localhost:27017/fullstack-web";

const app = express();

app.use(express.json());

// get customers
app.get("/customers", customerController.getCustomer);

// GET /customers/:id

app.get("/customers/:id", customerController.getDetailCustomer);

// 6. Thêm mới khách hàng
// Viết API để thêm một khách hàng mới vào danh sách khách hàng.
// POST /customers

app.post("/customers", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name) throw new Error("name is required!");
    if (!email) throw new Error("email is required!");
    if (!age) throw new Error("age is required!");

    // check exist customer
    const dataCustomer = await CustomerModel.findOne({ email });

    if (dataCustomer) throw new Error("Email already exists!");

    // create Customer

    const createCustomer = await CustomerModel.create({
      name,
      email,
      age,
    });

    res.json({
      data: createCustomer,
      message: "Create Customer Successfully",
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// /customers/:id

app.delete("/customers/:id", async (req, res) => {
  try {
    const idCustomer = req.params.id;

    await CustomerModel.findByIdAndUpdate(idCustomer, {
      deleted: true,
    });

    res.json({
      data: null,
      message: "Delete Customer Successfully",
    });
  } catch (error) {
    res.status(403).send({
      message: error.message,
      data: null,
      success: false,
    });
  }
});

// get all users

app.get("/users", userController.getAllUsers);

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
