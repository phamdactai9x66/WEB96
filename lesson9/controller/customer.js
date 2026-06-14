import AccountModel from "../Model/Account.js";
import CustomersModel from "../Model/Customers.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signTokens = (payload) => {
  const access_token = jwt.sign(
    { ...payload, tokenType: "AT" },
    process.env.SECRET_KEY,
    { expiresIn: "20m" },
  );
  const refresh_token = jwt.sign(
    { ...payload, tokenType: "RT" },
    process.env.REFRESH_SECRET,
    { expiresIn: "4w" },
  );
  return { access_token, refresh_token };
};

const customerController = {
  registerCustomer: async (req, res) => {
    try {
      const { email, password } = req.body;

      const findCustomer = await AccountModel.findOne({ email });

      // check exist customer
      if (findCustomer) {
        return res.status(400).json({ message: "Customer already exists." });
      }

      // tạo chuỗi ngẫu nhiên
      const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));

      // thực hiện má hoá với chuỗi salt
      const hashedPassword = bcrypt.hashSync(password, salt);

      // create customer info

      // create account
      const newAccount = await AccountModel.create({
        email,
        password: hashedPassword,
        salt,
      });

      res.json({
        message: "Register account successfully!",
        infoAccount: {
          email: newAccount.email,
        },
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering customer", error: error.message });
    }
  },
  loginCustomer: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required." });
      }

      // check exist customer
      const findCustomer = await AccountModel.findOne({ email });

      if (!findCustomer) {
        return res.status(404).json({ message: "Customer not found." });
      }

      if (!findCustomer.isActive) {
        return res.status(400).json({ message: "Customer is not active." });
      }

      const isMatch = bcrypt.compareSync(password, findCustomer.password);

      if (!isMatch)
        return res
          .status(400)
          .json({ message: "Email or password is incorrect." });

      const tokenPayload = {
        id: findCustomer._id,
        email: findCustomer.email,
        role: findCustomer.role,
      };

      const { access_token, refresh_token } = signTokens(tokenPayload);

      res.json({
        message: "Login successfully!",
        userInfo: { email: findCustomer.email, role: findCustomer.role },
        access_token,
        refresh_token,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in customer", error: error.message });
    }
  },
  updateCustomerInfo: async (req, res) => {
    try {
      const { accountId } = req.params;
      const { name, email, phone, address } = req.body;

      // kiem tra khach hang khong ton tai trong database

      const checkCustomer = await CustomersModel.findOne({ accountId });

      if (!checkCustomer) {
        const updatedCustomer = await CustomersModel.create({
          accountId,
          name,
          email,
          phone,
          address,
        });

        return res.json({
          message: "Customer created successfully.",
          infoCustomer: updatedCustomer,
        });
      }

      // kiem tra khach hang da ton tai trong database

      const updatedCustomer = await CustomersModel.findByIdAndUpdate(
        checkCustomer._id,
        { name, email, phone, address },
        { new: true },
      );

      res.json({
        message: "Customer updated successfully.",
        infoCustomer: updatedCustomer,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating customer", error: error.message });
    }
  },
  refreshToken: (req, res) => {
    const { refresh_token } = req.body;
    if (!refresh_token)
      return res.status(401).json({ message: "No refresh token provided." });
    try {
      const decoded = jwt.verify(refresh_token, process.env.REFRESH_SECRET);

      if (decoded.tokenType !== "RT")
        return res.status(401).json({ message: "Invalid token type." });

      const { id, email, role } = decoded;
      const { access_token, refresh_token: new_refresh_token } = signTokens({
        id,
        email,
        role,
      });

      res.json({ access_token, refresh_token: new_refresh_token });
    } catch {
      res.status(401).json({ message: "Refresh token is invalid or expired." });
    }
  },
  getAllCustomers: async (req, res) => {
    try {
      const { pageSize = 10, pageNumber = 1 } = req.query;
      // code to get all customers from database
      const totalItems = await CustomersModel.countDocuments();

      const totalPages = Math.ceil(totalItems / pageSize);
      // Tính toán vị trí bắt đầu của trang hiện tại, trừ 1 vì mảng bắt đầu từ vị trí 0
      const skip = (pageNumber - 1) * pageSize;

      let condition = {};
      if (req.query.search) {
        condition.name = { $regex: req.query.search, $options: "i" };
      }

      // Truy vấn dữ liệu sử dụng Mongoose
      const result = await CustomersModel.find(condition)
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
  },
};

export default customerController;
