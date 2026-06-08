import express from "express";

import managersController from "../controller/managers.js";

const router = express.Router();

router.post("/create_employee", managersController.createEmployee);

export default router;
