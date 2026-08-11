const mongoose = require("mongoose");

// 1. Schema ko alag variable (RoleSchema) mein daala
const RoleSchema = new mongoose.Schema({
  name: String
});

// 2. Vercel ke liye safe wala model export
const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);

module.exports = Role;