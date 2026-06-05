import express from "express";
import customerController from "../controller/customer.js";

const router = express.Router();

router.post("/", customerController.registerCustomer);

router.post("/login", customerController.loginCustomer);

export default router;
