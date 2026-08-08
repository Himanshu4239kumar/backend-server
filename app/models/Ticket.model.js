module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      mt5Id: String,
      email: String,
      mobile: String,
      category: String,
      description: String,
      userName: { type: String, default: "Trader" },
      status: { type: String, default: "Open" }
    },
    { timestamps: true }
  );

  const User = mongoose.models.user || mongoose.model("ticket", schema);
  return Ticket;
};