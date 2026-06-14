import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["MANAGER", "CUSTOMER", "EMPLOYEE"],
    default: "CUSTOMER",
  },
  salt: {
    type: String,
    required: true,
  },
});

export default mongoose.model("accounts", accountSchema);
