const mongoose = require("mongoose");

// 1. Schema ko bahar nikala aur ek variable (RoleSchema) mein rakha
const RoleSchema = new mongoose.Schema({
  name: String
});

// 2. Sirf ek baar 'const Role' banaya Vercel safe tarike se
const Role = mongoose.models.Role || mongoose.model("Role", RoleSchema);

module.exports = Role;