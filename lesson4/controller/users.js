import UsersModel from "../model/users.js";

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const dataUser = await UsersModel.find();

      res.json({
        data: dataUser,
        message: "List User",
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

export default userController;
