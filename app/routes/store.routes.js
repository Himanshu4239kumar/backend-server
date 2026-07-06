module.exports = (app) => {
  const stores = require("../controllers/store.controller.js");

  const router = require("express").Router();

  // Create a new Trade
  router.post("/", stores.create);

  // Retrieve all stores
  router.get("/", stores.findAll);

  // Retrieve all stores by User ID
  router.get("/user/:userId", stores.findByUser);

  // Retrieve a single Trade with id
  router.get("/:id", stores.findOne);

  // Update a Trade with id
  router.put("/:id", stores.update);

  // Delete a Trade with id
  router.delete("/:id", stores.delete);

  // Delete all stores
  // router.delete("/", stores.deleteAll);

  app.use("/api/stores", router);
};