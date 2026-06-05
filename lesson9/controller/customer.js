import AccountModel from "../Model/Account.js";

import CustomersModel from "../Model/Customers.js";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

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

      // create account
      const newAccount = await AccountModel.create({
        email,
        password: hashedPassword,
      });

      // create customer
      const newCustomer = await CustomersModel.create({
        accountId: newAccount._id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        salt,
      });

      res.json({
        message: "Register customer",
        infoCustomer: newCustomer,
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

      const findCustomerInfo = await CustomersModel.findOne({
        accountId: findCustomer._id,
      });

      const salt = findCustomerInfo.salt;

      // thực hiện mã hoá với chuỗi salt
      const hashingPasswordLogin = bcrypt.hashSync(password, salt);

      // compare passwords
      if (hashingPasswordLogin !== findCustomer.password) {
        return res
          .status(400)
          .json({ message: "Email or password is incorrect." });
      }

      const customerInfo = {
        id: findCustomerInfo._id,
        name: findCustomerInfo.name,
        email: findCustomerInfo.email,
      };

      // Tạo AT
      const access_token = jwt.sign(
        { ...customerInfo, tokenType: "AT" },
        process.env.SECRET_KEY,
        {
          expiresIn: "20m",
        },
      );

      // Tao RT
      const refresh_token = jwt.sign(
        { ...customerInfo, tokenType: "RT" },
        process.env.SECRET_KEY,
        {
          expiresIn: "4w",
        },
      );

      res.json({
        message: "Login successfully!",
        userInfo: findCustomer,
        access_token,
        refresh_token,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error logging in customer", error: error.message });
    }
  },
};

export default customerController;
