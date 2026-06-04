const Trade = require("../models/trade.model.js"); // Apna model import kiya

module.exports = app => {
  // 🟢 Trade Open karne ki API (Frontend se BUY/SELL dabane par yahan aayega)
  app.post("/api/trades/open", async (req, res) => {
    try {
      const { symbol, tradeType, lotSize, openPrice } = req.body;

      // Database mein naya trade document banaya
      const newTrade = new Trade({
        symbol: symbol,
        tradeType: tradeType,
        lotSize: lotSize,
        openPrice: openPrice
      });

      await newTrade.save();
      
      res.status(201).json({ 
        success: true, 
        message: `${tradeType} Trade successfully opened!`, 
        trade: newTrade 
      });

    } catch (err) {
      console.error("Trade Open Error:", err);
      res.status(500).json({ success: false, message: "Trade open nahi ho payi." });
    }
  });

  // 🔵 Open Trades fetch karne ki API (Bottom tab mein dikhane ke liye)
  app.get("/api/trades/open", async (req, res) => {
    try {
      // Sirf 'OPEN' status wali trades nikalenge
      const openTrades = await Trade.find({ status: "OPEN" });
      res.status(200).json({ success: true, trades: openTrades });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
};