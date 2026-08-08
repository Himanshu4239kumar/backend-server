const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mt5Id: {
      type: String,
      required: true,
      index: true,
    },

    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    tradeType: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },

    lotSize: {
      type: Number,
      required: true,
      min: 0,
    },

    openPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    closePrice: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "CANCELLED"],
      default: "OPEN",
    },

    openTime: {
      type: Date,
      required: true,
    },

    closeTime: {
      type: Date,
    },

    pnl: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Store || mongoose.models("Store", storeSchema);