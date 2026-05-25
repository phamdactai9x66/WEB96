import mongoose from "mongoose";
// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  deleted: { type: Boolean, default: false },
  password: String,
  salt: String,
});
// định nghĩa model cần truyền với phương thức model và các tham số lần lượt: tên collections, schema của document
const UsersModel = mongoose.model("customers", customerSchema);
export default UsersModel;
