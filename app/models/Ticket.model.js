const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  mt5Id: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  mobile: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  userName: { 
    type: String, 
    default: 'Trader' // Agar user login hai, toh uska naam pass kar sakte ho, varna default 'Trader' rahega
  },
  status: { 
    type: String, 
    default: 'Open', 
    enum: ['Open', 'Resolved'] 
  }
}, { timestamps: true }); // timestamps true se createdAt aur updatedAt khud ban jayega

module.exports = mongoose.model('Ticket', ticketSchema);