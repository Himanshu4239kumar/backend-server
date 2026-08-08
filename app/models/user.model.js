const mongoose = require("mongoose");

// 1. Pehle humne Schema ko ek alag variable (UserSchema) mein daal diya
const UserSchema = new mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ],
  active: Boolean
});

// 2. Phir Vercel ke liye safe wala model export kar diya
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;