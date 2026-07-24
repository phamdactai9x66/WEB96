import express from "express";

import dotenv from "dotenv";

import mongoose from "mongoose";

import customerRouter from "./Router/customer.js";

import managersRouter from "./Router/managers.js";

import multer from "multer";

import { v2 as cloudinary } from "cloudinary";

const env = process.env.NODE_ENV || "dev";
// test123
// feature3/login

dotenv.config({
  path: `.env.${env}`,
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Khởi tạo tùy chọn lưu trữ memoryStorage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Xử lý yêu cầu tải lên tệp
app.post("/upload", upload.single("file"), (req, res) => {
  // Truy cập dữ liệu tệp từ req.file
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Không có tệp được tải lên." });
  }

  const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const fileName = file.originalname.split(".")[0];

  cloudinary.uploader.upload(
    dataUrl,
    {
      public_id: fileName,
      resource_type: "auto",
      // có thể thêm field folder nếu như muốn tổ chức
    },
    (err, result) => {
      if (result) {
        console.log(result.secure_url);
        // lấy secure_url từ đây để lưu vào database.
      }
    },
  );

  // Trả về phản hồi với thông tin về tệp đã tải lên
  res.json({ message: "Tệp được tải lên thành công.", data: file });
});

app.post("/upload_multiple", upload.array("files"), (req, res) => {
  const listFile = req.files;

  const listResult = [];
  if (!listFile) {
    return res.status(400).json({ error: "Không có tệp được tải lên." });
  }
  for (const file of listFile) {
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const fileName = file.originalname.split(".")[0];

    cloudinary.uploader.upload(
      dataUrl,
      {
        public_id: fileName,
        resource_type: "auto",
        // có thể thêm field folder nếu như muốn tổ chức
      },
      (err, result) => {
        if (result) {
          listResult.push(result);

          console.log(listResult);
        }
      },
    );
  }
  // code ...
  res.json({ message: "Tệp được tải lên thành công.", listFile });
});

app.delete("/delete_file", (req, res) => {
  const { public_id } = req.query;

  cloudinary.uploader.destroy(public_id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Lỗi khi xóa tệp." });
    }
    res.json({ message: "Tệp đã được xóa thành công.", result });
  });
});

app.use("/customers", customerRouter);
app.use("/managers", managersRouter);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
