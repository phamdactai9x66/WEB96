import express from "express";
import customerController from "../controller/customers.js";

import CustomerModel from "../model/customer.js";

import { v4 as uuidv4 } from "uuid";

import bcrypt from "bcrypt";

import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth.authentication, customerController.getCustomer);

router.get("/:id", auth.authentication, customerController.getDetailCustomer);

router.post("/", auth.authentication, customerController.createCustomer);

router.delete("/:id", auth.authentication, customerController.deleteCustomer);

router.get("/getApikey/:id", customerController.getApikey);

router.post(
  "/register",
  auth.checkFormInput,
  customerController.registerCustomer,
);

export default router;
