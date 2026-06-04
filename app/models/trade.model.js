const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  userId: { type: String, default: "test_user_01" }, // Abhi test ke liye dummy ID
  symbol: { type: String, required: true },          // BTCUSDT
  tradeType: { type: String, enum: ["BUY", "SELL"], required: true }, 
  lotSize: { type: Number, required: true },
  openPrice: { type: Number, required: true },
  status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
  openTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Trade", tradeSchema);