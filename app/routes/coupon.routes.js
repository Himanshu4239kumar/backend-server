module.exports = app => {
  const coupons = require("../controllers/coupon.controller.js");
  var router = require("express").Router();

  // 🚨 FIX: "/" ki jagah "/create" kar diya
  router.post("/create", coupons.create);

  // 🚨 FIX: "/" ki jagah "/all" kar diya
  router.get("/all", coupons.findAll);

  // Retrieve all published coupons 
  router.get("/active", coupons.findAllActive);

    // Payment page verification ke liye
  router.post("/verify", coupons.verifyCoupon);

  router.get("/check", coupons.checkDuplicateCoupon);

  // Retrieve a single coupon with id
  router.get("/:id", coupons.findOne);

  // Update a coupon with id
  router.put("/:id", coupons.update);

  // Delete a coupon with id
  router.delete("/:id", coupons.delete);

  // Delete all coupons
  router.delete("/", coupons.deleteAll);

  app.use("/api/coupons", router);
};