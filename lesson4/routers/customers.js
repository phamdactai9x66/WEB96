import express from "express";
import customerController from "../controller/customers.js";

const router = express.Router();

router.get("/", customerController.getCustomer);

router.get("/:id", customerController.getDetailCustomer);

router.post("/", customerController.createCustomer);

router.delete("/:id", customerController.deleteCustomer);

export default router;
