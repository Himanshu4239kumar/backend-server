const PayoutRequest = require("../models/payoutrequest.model");

exports.createPayoutRequest = async (req, res) => {
  try {
    const {
      userId,
      userName,
      amount,
      method,
      walletAddress,
    } = req.body;

    const payout = await PayoutRequest.create({
      payoutId: Date.now().toString(),
      userId,
      userName,
      amount,
      method,
      walletAddress,
    });

    res.status(201).json({
      success: true,
      message: "Payout request submitted successfully",
      data: payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllPayoutRequests = async (req, res) => {
  try {
    const payouts = await PayoutRequest.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payouts.length,
      data: payouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUserPayoutRequests = async (req, res) => {
  try {
    const payouts = await PayoutRequest.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: payouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePayoutStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const payout = await PayoutRequest.findByIdAndUpdate(
      req.params.id,
      {
        status,
        remarks,
        processedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!payout) {
      return res.status(404).json({
        success: false,
        message: "Payout request not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payout status updated",
      data: payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};