const db = require("../models");
const User = db.user; // User model ko import kar rahe hain

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

// 🚨 NAYA FUNCTION: Admin Panel ke table ke liye
exports.getAllUsers = async (req, res) => {
  try {
    // Database se saare users nikalna, par unka password hide kar dena security ke liye
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    // BACKEND DEDUPLICATION: Agar database mein galti se duplicate entries hain, toh yahan unhe email ke basis par filter kar denge
    const uniqueUsers = Array.from(new Map(users.map(user => [user.email, user])).values());

    res.status(200).json({ success: true, users: uniqueUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};