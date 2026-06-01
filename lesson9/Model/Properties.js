import mongoose from "mongoose";

const propertiesSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  area: {
    type: String,
  },
  status: {
    type: String,
    enum: ["available", "sold", "pending"],
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
  },
});

export default mongoose.model("property", propertiesSchema);
