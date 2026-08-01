const Ticket = require('../models/Ticket');

// User ke ticket ko Database me save karne ka logic
exports.createTicket = async (req, res) => {
  try {
    const { mt5Id, email, mobile, category, description, userName } = req.body;

    // Basic Validation
    if (!mt5Id || !email || !mobile || !category || !description) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newTicket = new Ticket({
      mt5Id,
      email,
      mobile,
      category,
      description,
      userName: userName || 'Trader'
    });

    await newTicket.save();

    res.status(201).json({ 
        success: true, 
        message: "Ticket created successfully", 
        data: newTicket 
    });
  } catch (error) {
    console.error("Ticket Create Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin ke liye saare tickets lane ka logic
exports.getAllTickets = async (req, res) => {
  try {
    // .sort({ createdAt: -1 }) se naye tickets sabse upar aayenge
    const tickets = await Ticket.find().sort({ createdAt: -1 }); 
    
    res.status(200).json({ 
        success: true, 
        data: tickets 
    });
  } catch (error) {
    console.error("Fetch Tickets Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};