const db = require("../models");
const Trade = db.trade; 

// 🟢 1. User ke liye: Nayi Trade lagana
exports.openTrade = async (req, res) => {
  try {
    const { userId, userName, mt5Id, symbol, tradeType, lotSize, openPrice } = req.body;
    
    const newTrade = new Trade({
      userId,
      userName: userName || "Trader",
      mt5Id,
      symbol,
      tradeType,
      lotSize,
      openPrice,
      status: "OPEN",
      openTime: new Date()
    });

    await newTrade.save();
    res.status(201).json({ success: true, message: "Trade opened successfully", data: newTrade });
  } catch (error) {
    console.error("Trade Open Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 2. Admin ke liye: Saari Trades dekhna
exports.getAllTradesAdmin = async (req, res) => {
  try {
    const trades = await Trade.find({}).sort({ createdAt: -1 }); 
    res.status(200).json({ success: true, data: trades });
  } catch (error) {
    console.error("Fetch All Trades Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟢 3. 🚨 NAYA FUNCTION: Trade Close karna (Jisme closePrice aur PnL aayega)
exports.closeTrade = async (req, res) => {
  try {
    const { tradeId, closePrice, pnl } = req.body;

    // Database mein us trade ko dhoondho aur update kar do
    const updatedTrade = await Trade.findByIdAndUpdate(
      tradeId,
      {
        closePrice: closePrice,
        pnl: pnl,
        status: "CLOSED", // Status change ho gaya
        closeTime: new Date() // Close hone ka time
      },
      { new: true } // Update hone ke baad naya data return karega
    );

    if (!updatedTrade) {
      return res.status(404).json({ success: false, message: "Trade nahi mili" });
    }

    res.status(200).json({ success: true, message: "Trade closed successfully", data: updatedTrade });
  } catch (error) {
    console.error("Trade Close Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};