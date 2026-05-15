import mongoose from "mongoose";
// khởi tạo schema (định nghĩa các field cho các document và kiểu dữ liệu của field đó)
const commentSchema = new mongoose.Schema({
  postId: String,
  authorId: String,
  content: String,
});
// định nghĩa model cần truyền với phương thức model và các tham số lần lượt: tên collections, schema của document
const UsersModel = mongoose.model("comments", commentSchema);
export default UsersModel;
