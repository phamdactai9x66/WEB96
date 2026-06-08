import express from "express";

import managersController from "../controller/managers.js";

import EmployeesModel from "../model/Employees.js";

const router = express.Router();

router.post("/create_employee", managersController.createEmployee);

router.get("/employees", managersController.getAllEmployees);

export default router;
