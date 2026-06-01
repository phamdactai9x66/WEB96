import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
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
  address: {
    type: String,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "account",
  },
});

export default mongoose.model("customer", customerSchema);
