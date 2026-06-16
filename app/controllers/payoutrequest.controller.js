const PayoutRequest = require("../models/payoutrequest.model.js");

// 🟢 1. POST API - Jab User Naya Payout Request karega
exports.create = async (req, res) => {
  try {
    const { userId, userName, amount, method, walletAddress } = req.body;
    
    const newRequest = new PayoutRequest({
      userId,
      userName,
      amount,
      method,
      walletAddress,
      status: "Pending" // Naya request hamesha Pending jayega
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔵 2. GET API (Admin Ke Liye) - Admin panel mein saari requests dikhane ke liye
exports.findAll = async (req, res) => {
  try {
    // sort({ createdAt: -1 }) se sabse nayi request sabse upar aayegi
    const requests = await PayoutRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🟡 3. GET API (User Ke Liye) - User ko uski history dikhane ke liye
exports.findUserPayouts = async (req, res) => {
  try {
    const userRequests = await PayoutRequest.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(userRequests);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔴 4. PUT API (Admin Ke Liye) - Pending se Approve/Reject karne ke liye
exports.updateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    
    const updatedRequest = await PayoutRequest.findByIdAndUpdate(
      req.params.id,
      { status: status, remarks: remarks },
      { new: true } // new: true karne se update hone ke baad naya data return hota hai
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: "Payout request not found" });
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};