const express = require('express');
const router = express.Router();
const { createTicket, getAllTickets } = require('../controllers/ticket.controller');

// URL: POST /api/tickets/create
router.post('/create', createTicket);

// URL: GET /api/tickets/all
router.get('/all', getAllTickets);

module.exports = router;