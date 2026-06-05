import AccountModel from "../Model/Account.js";

import CustomersModel from "../Model/Customers.js";

import bcrypt from "bcrypt";

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
};

export default customerController;
