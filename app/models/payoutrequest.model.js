const mongoose = require("mongoose");

const PayoutRequestSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  walletAddress: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  remarks: { type: String, default: "" }
}, { timestamps: true }); // timestamps se createdAt aur updatedAt automatically database mein save ho jayega

module.exports = mongoose.model("PayoutRequest", PayoutRequestSchema);