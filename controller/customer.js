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
};

export default customerController;
