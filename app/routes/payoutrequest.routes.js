module.exports = app => {
  const payoutRequests = require("../controllers/payoutrequest.controller.js");
  var router = require("express").Router();

  // 1. User Post karega
  router.post("/", payoutRequests.create);
  
  // 2. Admin Get karega
  router.get("/", payoutRequests.findAll);
  
  // 3. User History Get karega
  router.get("/user/:userId", payoutRequests.findUserPayouts);
  
  // 4. Admin Put karke Approve karega
  router.put("/:id/status", payoutRequests.updateStatus);

  // Yeh saare routes "/api/payouts" ke andar chalenge
  app.use("/api/payouts", router);
};