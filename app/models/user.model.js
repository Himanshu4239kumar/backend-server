const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String, // 🚨 ADDED: Admin panel ke mobile column ke liye
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    active: { type: Boolean, default: true }
  }, { timestamps: true })
);

module.exports = User;