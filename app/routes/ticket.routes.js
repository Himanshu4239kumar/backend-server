const controller = require("../controllers/ticket.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // Ticket APIs
  app.post("/api/tickets/create", controller.createTicket);
  app.get("/api/tickets/all", controller.getAllTickets);
};