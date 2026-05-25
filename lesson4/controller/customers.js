import UsersModel from "../model/users.js";

import CustomerModel from "../model/customer.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

const customerController = {
  getCustomer: async (req, res) => {
    try {
      const dataCustomer = await UsersModel.find();

      res.json({
        data: dataCustomer,
        message: "List Customer",
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
  getDetailCustomer: async (req, res) => {
    try {
      const idCustomer = req.params.id;

      const findCustomer = await CustomerModel.findById(idCustomer);

      if (!findCustomer) {
        return res.status(404).send({
          message: "not Found Customer",
          data: null,
          success: false,
        });
      }

      res.json({
        data: findCustomer,
        message: "List Customer",
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
  createCustomer: async (req, res) => {
    try {
      const { name, email, age } = req.body;

      if (!name) throw new Error("name is required!");
      if (!email) throw new Error("email is required!");
      if (!age) throw new Error("age is required!");

      // check exist customer
      const dataCustomer = await CustomerModel.findOne({ email });

      if (dataCustomer) throw new Error("Email already exists!");

      // create Customer

      const createCustomer = await CustomerModel.create({
        name,
        email,
        age,
      });

      res.json({
        data: createCustomer,
        message: "Create Customer Successfully",
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
  deleteCustomer: async (req, res) => {
    try {
      const idCustomer = req.params.id;

      await CustomerModel.findByIdAndUpdate(idCustomer, {
        deleted: true,
      });

      res.json({
        data: null,
        message: "Delete Customer Successfully",
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
  getApikey: async (req, res) => {
    try {
      const idParams = req.params.id;

      if (!idParams) throw new Error("ID is required!");

      // check exist customer by id
      const findCustomer = await CustomerModel.findById(idParams);

      if (!findCustomer) throw new Error("Customer not found");
      // web-${customerId}$-${email}-${randomString}$

      const apiKey = `web-$${findCustomer._id}$-$${findCustomer.email}$-$${uuidv4()}$`;

      res.json({
        api_key: apiKey,
        message: "Get Api Key Successfully",
        success: true,
      });
    } catch (error) {
      res.status(403).send({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
  registerCustomer: async (req, res) => {
    try {
      const { name, email, age, password } = req.body;

      const findCustomer = await CustomerModel.findOne({ email });

      if (findCustomer) throw new Error("Email already exists!");

      // tạo chuỗi ngẫu nhiên
      const salt = bcrypt.genSaltSync(saltRounds);

      // thực hiện mã hoá với chuỗi salt
      const hashPassword = bcrypt.hashSync(password, salt);

      const newCustomer = await CustomerModel.create({
        name,
        email,
        age,
        password: hashPassword,
        salt,
      });

      res.json({
        message: "Register with hash password!",
        userInfo: newCustomer,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
};

export default customerController;
