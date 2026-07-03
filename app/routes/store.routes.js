module.exports = app => {
  const trades = require("../controllers/store.controller.js");

  const router = require("express").Router();

  // Create a new Trade
  router.post("/", trades.create);

  // Retrieve all Trades
  router.get("/", trades.findAll);

  // Retrieve all Trades by User ID
  router.get("/user/:userId", trades.findByUser);

  // Retrieve a single Trade with id
  router.get("/:id", trades.findOne);

  // Update a Trade with id
  router.put("/:id", trades.update);

  // Delete a Trade with id
  router.delete("/:id", trades.delete);

  // Delete all Trades
  router.delete("/", trades.deleteAll);

  app.use("/api/stores", router);
};