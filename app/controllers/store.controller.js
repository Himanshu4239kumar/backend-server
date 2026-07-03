const TradeHistory = require("../models/store.model");

// Create Trade
exports.createTrade = async (req, res) => {
  try {
    const trade = await TradeHistory.create(req.body);

    res.status(201).json({
      success: true,
      data: trade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Trades
exports.getAllTrades = async (req, res) => {
  try {
    const trades = await TradeHistory.find().sort({ openTime: -1 });

    res.status(200).json({
      success: true,
      count: trades.length,
      data: trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Trade by ID
exports.getTradeById = async (req, res) => {
  try {
    const trade = await TradeHistory.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Trade not found",
      });
    }

    res.status(200).json({
      success: true,
      data: trade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Trades by User
exports.getTradesByUser = async (req, res) => {
  try {
    const trades = await TradeHistory.find({
      userId: req.params.userId,
    }).sort({ openTime: -1 });

    res.status(200).json({
      success: true,
      count: trades.length,
      data: trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Trade
exports.updateTrade = async (req, res) => {
  try {
    const trade = await TradeHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Trade not found",
      });
    }

    res.status(200).json({
      success: true,
      data: trade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Trade
exports.deleteTrade = async (req, res) => {
  try {
    const trade = await TradeHistory.findByIdAndDelete(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Trade not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Trade deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};