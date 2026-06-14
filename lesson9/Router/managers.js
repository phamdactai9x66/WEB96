import express from "express";
import managersController from "../controller/managers.js";
import { verifyToken, authorize } from "../middleware/auth.js";

const router = express.Router();

// Chỉ MANAGER mới được tạo employee và xem danh sách
router.post(
  "/create_employee",
  verifyToken,
  authorize("MANAGER"),
  managersController.createEmployee,
);

router.get(
  "/employees",
  verifyToken,
  authorize("MANAGER", "EMPLOYEE"),
  managersController.getAllEmployees,
);

export default router;
