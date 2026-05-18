import UsersModel from "../model/users.js";

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
};

export default customerController;
