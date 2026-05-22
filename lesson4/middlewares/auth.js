const authMiddleware = {
  authentication: async (req, res, next) => {
    try {
      const apiKey = req.query.api_key;
      if (!apiKey) throw new Error("API key is required!");

      const idCustomer = apiKey.split("$")[1];

      if (!idCustomer) throw new Error("Customer id not Found!");

      const findCustomer = await CustomerModel.findById(idCustomer);

      if (!findCustomer) throw new Error("Customer not found!");

      // check exist customer by api key

      next();
    } catch (error) {
      res.status(403).send({
        error: error.message,
        message: "Authentication failed",
        data: null,
        success: false,
      });
    }
  },
  auhthorizationAdmin: (req, res, next) => {
    const userRole = "admin"; // Vai trò của người dùng (ví dụ: admin hoặc user)
    if (userRole === "admin") {
      next(); // Cho phép truy cập vào route
    } else {
      res.status(403).send("Forbidden"); // Trả về lỗi 403 nếu không có quyền truy cập
    }
  },
};

export default authMiddleware;
