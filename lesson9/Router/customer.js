import express from "express";
import customerController from "../controller/customer.js";
import { verifyToken } from "../middleware/auth.js";
import CustomerModel from "../Model/Customers.js";

const router = express.Router();

router.post("/", customerController.registerCustomer);
router.post("/login", customerController.loginCustomer);
router.post("/refresh-token", customerController.refreshToken);

// Protected routes
router.put("/:accountId", verifyToken, customerController.updateCustomerInfo);

// get all customers
router.get("/", verifyToken, async (req, res) => {
  try {
    const { pageSize = 10, pageNumber = 1 } = req.query;
    // code to get all customers from database
    const totalItems = await CustomerModel.countDocuments();

    const totalPages = Math.ceil(totalItems / pageSize);
    // Tính toán vị trí bắt đầu của trang hiện tại, trừ 1 vì mảng bắt đầu từ vị trí 0
    const skip = (pageNumber - 1) * pageSize;

    let condition = {};
    if (req.query.search) {
      condition.name = { $regex: req.query.search, $options: "i" };
    }

    // Truy vấn dữ liệu sử dụng Mongoose
    const result = await CustomerModel.find(condition)
      .skip(skip)
      .limit(pageSize);

    const data = {
      totalItems,
      totalPages,
      currentPage: +pageNumber,
      items: result,
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error getting customers" });
  }
});

// get all customers
router.get("/customers_v2", async (req, res) => {
  try {
    const { search = "" } = req.query;
    //     const result = await YourModel.find({
    //     userName: 'MindX'
    // });

    const result = await CustomerModel.find({
      name: { $regex: search, $options: "i" },
    });

    res.json({ items: result });
  } catch (error) {
    res.status(500).json({ message: "Error getting customers" });
  }
});

export default router;
