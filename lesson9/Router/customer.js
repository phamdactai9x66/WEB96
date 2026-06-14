import express from "express";
import customerController from "../controller/customer.js";
import { verifyToken } from "../middleware/auth.js";
import CustomerModel from "../Model/Customers.js";

const router = express.Router();

router.post("/register", customerController.registerCustomer);
router.post("/login", customerController.loginCustomer);
router.post("/refresh-token", customerController.refreshToken);

// Protected routes
router.put("/:accountId", verifyToken, customerController.updateCustomerInfo);

// get all customers
router.get("/", verifyToken, customerController.getAllCustomers);

export default router;
