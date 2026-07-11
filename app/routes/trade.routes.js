const Trade = require("../models/trade.model.js");

module.exports = app => {
  
  // 🟢 1. Trade Open karne ki API
  app.post("/api/trades/open", async (req, res) => {
    try {
      // 🚨 FIX: userName ko bhi req.body se receive kar rahe hain
      const { userId, userName, mt5Id, symbol, tradeType, lotSize, openPrice } = req.body;
      
      const newTrade = new Trade({
        userId: userId,
        userName: userName || "Trader", // 🚨 NAYA: Database me userName save kar diya
        mt5Id: mt5Id, 
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

  // 🟣 5. 🚨 NAYA ROUTE ADMIN KE LIYE: Saari trades (kisi bhi user ki) fetch karna
  app.get("/api/trades/all", async (req, res) => {
    try {
      // Database se saari trades utha lo aur naye se purane ke hisaab se sort karo
      const allTrades = await Trade.find({}).sort({ openTime: -1 });
      
      // Admin Panel data ko "data" key ke andar dhoondhta hai, isliye aise bheja
      res.status(200).json({ success: true, data: allTrades }); 
    } catch (err) {
      console.error("Fetch All Trades Error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  });

};