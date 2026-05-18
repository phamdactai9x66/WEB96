import express from "express";
import userController from "../controller/users.js";

const router = express.Router();

// get all users
router.get("/", userController.getAllUsers);

export default router;
