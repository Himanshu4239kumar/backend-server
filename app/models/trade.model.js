const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Jis user ne trade li
  userName: { type: String }, // 🚨 YEH ADD KARNA ZAROORI HAI: User ka asli naam save karne ke liye
  mt5Id: { type: String, required: true },  // Kis account (MT5 ID) se trade li
  symbol: { type: String, required: true },          
  tradeType: { type: String, enum: ["BUY", "SELL"], required: true }, 
  lotSize: { type: Number, required: true },
  openPrice: { type: Number, required: true },
  status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
  openTime: { type: Date, default: Date.now },
  
  closePrice: { type: Number },
  pnl: { type: Number },
  closeTime: { type: Date }
});

module.exports = mongoose.models.Trade || mongoose.model("Trade", tradeSchema);