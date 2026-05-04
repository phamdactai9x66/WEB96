import http from "http";
import { customers, orders } from "./data.js";
// data học sinh

const app = http.createServer((request, response) => {
  const endpoint = request.url;

  console.log(`endpoint: ${endpoint}`);
  switch (endpoint) {
    // với endpoint /students
    case "/customers":
      response.end(JSON.stringify(customers));

      break;

    // nếu không khớp bất kỳ một endpoint nào
    default:
      // bai3: Viết API để lấy danh sách các đơn hàng của một khách hàng cụ thể dựa trên customerId.

      // /customers/:customerId/orders
      if (
        request.method == "GET" &&
        endpoint.startsWith("/customers/") &&
        endpoint.endsWith("/orders")
      ) {
        const idCustomer = endpoint.split("/")[2];

        const filterOrder = orders.filter(
          (order) => order.customerId === idCustomer,
        );

        response.end(JSON.stringify(filterOrder));
        break;

        break;
      }

      // bai2:  Viết API để lấy thông tin chi tiết của một khách hàng dựa trên id.

      if (endpoint.startsWith("/customers/") && request.method === "GET") {
        // get ID customer
        const idCustomer = endpoint.split("/")[2];

        // find customer
        const findCustomer = customers.find(
          (customer) => customer.id === idCustomer,
        );

        // if exist user
        if (findCustomer) {
          response.end(JSON.stringify(findCustomer));
          break;
        }

        // if not exist
        response.end("not Found Customer");
      }

      break;
  }
});

app.listen(8080, () => {
  console.log("Server is running!");
});
