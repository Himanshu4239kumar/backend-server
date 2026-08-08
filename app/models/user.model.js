const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
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
  })
);
const User = mongoose.models.user || mongoose.model("user", schema); // 'schema' ya jo bhi variable name ho
module.exports = User;
