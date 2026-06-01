import AccountModel from "../Model/Account.js";

const customerController = {
  registerCustomer: async (req, res) => {
    try {
      const { email, password } = req.body;

      const newCustomer = await AccountModel.create({
        email,
        password,
      });

      res.json({ message: "Register customer", customer: newCustomer });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error registering customer", error: error.message });
    }
  },
};

export default customerController;
