

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null 
  },
  customerName: { type: String, required: true },
  email: { type: String, required: true }, 
  product: { type: String, required: true }, 
  amount: { type: Number, default: 0 }, 
  status: { type: String, default: 'Pending', enum: ['Pending', 'Completed', 'Cancelled'] }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);