module.exports = app => {
  const coupons = require("../controllers/coupon.controller.js");

  var router = require("express").Router();

  // Create a new coupon
  router.post("/", coupons.create);

  // Retrieve all coupons
  router.get("/", coupons.findAll);

  // Retrieve all published coupons 
  router.get("/active", coupons.findAllActive);

  router.get("/check", coupons.checkDuplicateCoupon);

  // Retrieve a single coupon with id
  router.get("/:id", coupons.findOne);

  // Update a coupon with id
  router.put("/:id", coupons.update);

  // Delete a coupon with id
  router.delete("/:id", coupons.delete);

  // Create a new coupon
  router.delete("/", coupons.deleteAll);

  app.use("/api/coupons", router);
};
