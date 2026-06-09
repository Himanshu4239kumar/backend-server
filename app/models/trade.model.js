const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  userId: { type: String, default: "test_user_01" }, 
  symbol: { type: String, required: true },          
  tradeType: { type: String, enum: ["BUY", "SELL"], required: true }, 
  lotSize: { type: Number, required: true },
  openPrice: { type: Number, required: true },
  status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
  openTime: { type: Date, default: Date.now },
  
  // 👇 YEH 3 NAYE FIELDS ADD KIYE HAIN
  closePrice: { type: Number },
  pnl: { type: Number },
  closeTime: { type: Date }
});

module.exports = mongoose.model("Trade", tradeSchema);