import mongoose from "mongoose";

const employeesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    default: true,
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "manager",
  },
  department: {
    type: String,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
  },
});

export default mongoose.model("employee", employeesSchema);
