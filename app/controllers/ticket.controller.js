const db = require("../models");
const Ticket = db.tickets;

exports.createTicket = async (req, res) => {
  try {
    const { mt5Id, email, mobile, category, description, userName } = req.body;

    if (!mt5Id || !email || !mobile || !category || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const ticket = new Ticket({
      mt5Id,
      email,
      mobile,
      category,
      description,
      userName: userName || "Trader"
    });

    await ticket.save();
    res.status(201).json({ success: true, message: "Ticket created", data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};