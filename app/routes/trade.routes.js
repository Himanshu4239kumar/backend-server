const Trade = require("../models/trade.model.js");

module.exports = app => {
  
  // 🟢 1. Trade Open karne ki API
  app.post("/api/trades/open", async (req, res) => {
    try {
      // 🚨 mt5Id ko req.body se receive kar rahe hain
      const { userId, mt5Id, symbol, tradeType, lotSize, openPrice } = req.body;
      
      const newTrade = new Trade({
        userId: userId,
        mt5Id: mt5Id, // 🚨 Database me save kar diya
        symbol: symbol,
        tradeType: tradeType,
        lotSize: lotSize,
        openPrice: openPrice
      });
      
      await newTrade.save();
      res.status(201).json({ success: true, message: `${tradeType} Trade successfully opened!`, trade: newTrade });
    } catch (err) {
      console.error("Trade Open Error:", err);
      res.status(500).json({ success: false, message: "Trade open nahi ho payi." });
    }
  });

  // 🔵 2. Open Trades fetch karne ki API (User aur MT5 ID ke hisaab se)
  app.get("/api/trades/open/:userId/:mt5Id", async (req, res) => {
    try {
      // 🚨 Sirf usi user aur usi MT5 ID ki open trades bhejo
      const openTrades = await Trade.find({ 
        userId: req.params.userId,
        mt5Id: req.params.mt5Id,
        status: "OPEN" 
      });
      res.status(200).json({ success: true, trades: openTrades });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // 🔴 3. Trade Close (Cut) karne ki API
  app.post("/api/trades/close/:id", async (req, res) => {
    try {
      const tradeId = req.params.id;
      const { closePrice, pnl } = req.body;

      const updatedTrade = await Trade.findByIdAndUpdate(
        tradeId,
        { status: "CLOSED", closePrice: closePrice, pnl: pnl, closeTime: Date.now() },
        { new: true }
      );
      res.status(200).json({ success: true, message: "Trade closed successfully", trade: updatedTrade });
    } catch (err) {
      res.status(500).json({ success: false, message: "Trade close nahi ho payi." });
    }
  });

  // 🟡 4. Closed Trades (History) fetch karne ki API (User aur MT5 ID ke hisaab se)
  app.get("/api/trades/closed/:userId/:mt5Id", async (req, res) => {
    try {
      // 🚨 Sirf usi user aur usi MT5 ID ki history bhejo
      const closedTrades = await Trade.find({ 
        userId: req.params.userId,
        mt5Id: req.params.mt5Id,
        status: "CLOSED" 
      }).sort({ closeTime: -1 });
      
      res.status(200).json({ success: true, trades: closedTrades });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

};