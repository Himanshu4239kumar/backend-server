const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    name: String
  })
);
const Role = mongoose.models.role || mongoose.model("role", schema);
module.exports = Role;
