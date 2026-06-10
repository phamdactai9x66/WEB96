import EmployeesModel from "../model/Employees.js";

import AccountModel from "../Model/Account.js";

const managersController = {
  createEmployee: async (req, res) => {
    try {
      const { name, email, phone, department, accountId } = req.body;

      const existingEmployee = await EmployeesModel.findOne({ accountId });

      //   check exist employee
      if (existingEmployee) {
        return res
          .status(400)
          .json({ message: "Employee with this account ID already exists." });
      }

      const createEmployee = await EmployeesModel.create({
        name,
        email,
        phone,
        department,
        accountId,
      });

      const updateRoleAccount = await AccountModel.findOneAndUpdate(
        { _id: accountId },
        { role: "EMPLOYEE" },
        { new: true },
      );

      // code to create employee in database

      res.json({
        message: "Employee created successfully.",
        employeeInfo: createEmployee,
        accountInfo: {
          email: updateRoleAccount.email,
          role: updateRoleAccount.role,
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating employee", error: error.message });
    }
  },
  getAllEmployees: async (req, res) => {
    try {
      const { pageSize = 10, pageNumber = 1 } = req.query;
      // code to get all employees from database
      const totalItems = await EmployeesModel.countDocuments();

      const totalPages = Math.ceil(totalItems / pageSize);
      // Tính toán vị trí bắt đầu của trang hiện tại, trừ 1 vì mảng bắt đầu từ vị trí 0
      const skip = (pageNumber - 1) * pageSize;

      let condition = {};
      if (req.query.search) {
        condition.name = { $regex: req.query.search, $options: "i" };
      }

      // Truy vấn dữ liệu sử dụng Mongoose
      const result = await EmployeesModel.find(condition)
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
      res.status(500).json({ message: "Error getting employees" });
    }
  },
};

export default managersController;
