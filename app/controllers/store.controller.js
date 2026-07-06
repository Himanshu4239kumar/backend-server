
const db = require("../models");
const Store = db.stores;
// Create Trade
exports.create= async (req, res) => {
  try {
    const trade = await Store.create(req.body);

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

// Get All Stores
exports.findAll = async (req, res) => {
  try {
    const trades = await Store.find().sort({ openTime: -1 });

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

// Get Store by ID
exports.findOne = async (req, res) => {
  try {
    const trade = await Store.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
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

// Get Stores by User
exports.findByUser = async (req, res) => {
  try {
    const stores = await Store.find({
      userId: req.params.userId,
    }).sort({ openTime: -1 });

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Store 
exports.update = async (req, res) => {
  try {
    const trade = await Store.findByIdAndUpdate(
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

// Delete Store
exports.delete = async (req, res) => {
  try {
    const trade = await Store.findByIdAndDelete(req.params.id);

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