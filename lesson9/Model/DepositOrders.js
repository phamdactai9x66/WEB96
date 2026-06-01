import mongoose from "mongoose";

const depositOrdersSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "property",
  },
  depositAmount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["cancel", "sold", "pending"],
  },
});

export default mongoose.model("depositOrder", depositOrdersSchema);
