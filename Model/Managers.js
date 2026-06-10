import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
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
  department: {
    type: String,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
  },
});

export default mongoose.model("manager", managerSchema);
