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
};

export default managersController;
