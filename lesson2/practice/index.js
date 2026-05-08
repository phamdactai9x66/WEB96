import express from "express";
import { customers, orders, products } from "./data.js";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Viết API để lấy toàn bộ danh sách khách hàng.

app.get("/customers", (req, res) => {
  res.send(customers);
});

app.get("/customers/:id", (req, res) => {
  const idCustomer = req.params.id;

  if (!idCustomer) {
    return res.status(404).send({
      message: "Not found id customer",
      success: false,
    });
  }

  const findCustomer = customers.find((customer) => customer.id === idCustomer);

  //   not found user trong system
  if (!findCustomer) {
    return res.status(404).send({
      message: "Not found id customer",
      success: false,
    });
  }

  res.status(200).send({
    message: "customer detail",
    success: true,
    data: findCustomer,
  });
});

app.get("/customers/:customerId/orders", (req, res) => {
  const idCustomer = req.params.customerId;
  //   check exist customer in system

  const findCustomer = customers.find((customer) => customer.id === idCustomer);

  if (!findCustomer) {
    return res.status(404).send({
      message: "User not Found in system",
      success: false,
    });
  }

  const filterOrder = orders.filter((order) => order.customerId === idCustomer);

  res.status(200).send({
    message: "customer detail",
    success: true,
    data: filterOrder,
  });
});

app.get("/products", (req, res) => {
  const min = +req.query.min;
  const max = +req.query.max;

  if (!min || !max) {
    return res.status(200).send({
      message: "list product",
      success: true,
      data: products,
    });
  }

  if (min > max) {
    return res.status(400).send({
      message: "Min price must be less than max price",
      success: false,
      data: null,
    });
  }

  const filterProduct = products.filter(
    (product) => product.price >= min && product.price <= max,
  );

  res.send({
    message: "list product",
    success: true,
    data: filterProduct,
  });
});

app.post("/customers", (req, res) => {
  const body = req.body;

  if (!body.name || !body.age || !body.email) {
    return res.status(400).send({
      message: "Missing required fields",
      success: false,
      data: null,
    });
  }

  //   exist email

  const existEmail = customers.find(
    (customer) => customer.email === body.email,
  );

  if (existEmail) {
    return res.status(400).send({
      message: "Email already exist",
      success: false,
      data: null,
    });
  }

  const idRandom = Date.now();

  customers.push({
    id: idRandom,
    name: body.name,
    email: body.email,
    age: body.age,
  });

  res.send({
    message: "Create customer success",
    success: true,
    data: {
      id: idRandom,
      name: body.name,
      email: body.email,
      age: body.age,
    },
  });
});

app.listen(8080, () => {
  console.log("Server is running!");
});
