import express from "express";
import mongoose from "mongoose";

// atlas db
// const url_db =
//   "mongodb+srv://tai15122003311_db_user:HlLVk0btbLIUA0wY@cluster0.mc2s1zi.mongodb.net/fullstack-web?appName=Cluster0";

//   local db
const url_db = "mongodb://localhost:27017/fullstack-web";

const app = express();

mongoose
  .connect(url_db)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(8080, () => {
      console.log("Server is running!");
    });
  })
  .catch((error) => {
    console.log(error);
  });
