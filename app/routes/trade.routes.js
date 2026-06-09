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
// 🔴 Trade Close (Cut) karne ki API
  app.post("/api/trades/close/:id", async (req, res) => {
    try {
      const tradeId = req.params.id;
      const { closePrice, pnl } = req.body;

      // Database mein trade ko update kar rahe hain
      const updatedTrade = await Trade.findByIdAndUpdate(
        tradeId,
        { 
          status: "CLOSED", 
          closePrice: closePrice, 
          pnl: pnl, 
          closeTime: Date.now() 
        },
        { new: true }
      );

      res.status(200).json({ success: true, message: "Trade closed successfully", trade: updatedTrade });
    } catch (err) {
      console.error("Trade Close Error:", err);
      res.status(500).json({ success: false, message: "Trade close nahi ho payi." });
    }
  });

  // 🟡 Closed Trades (History) fetch karne ki API
  app.get("/api/trades/closed", async (req, res) => {
    try {
      // Sirf 'CLOSED' status wali trades nikalenge, aur sabse nayi pehle dikhayenge (-1)
      const closedTrades = await Trade.find({ status: "CLOSED" }).sort({ closeTime: -1 });
      res.status(200).json({ success: true, trades: closedTrades });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });