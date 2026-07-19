const db = require("../models");
const Coupon = db.coupons; // Make sure this matches your DB export

// Create and Save a new Coupon 
exports.create = (req, res) => {
  if (!req.body.code) {
    return res.status(400).send({ message: "Coupon Code can not be empty!" });
  }

  const coupon = new Coupon({
    code: req.body.code.toUpperCase(),
    discountPercentage: req.body.discountPercentage,
    expiryDate: req.body.expiryDate,
    applicableForSize: req.body.applicableForSize || req.body.applicableforSize,
    isActive: true
  });

  coupon.save()
    .then(data => {
      // 🚨 FIX: Added { success: true, data: data }
      res.send({ success: true, data: data, message: "Coupon created successfully" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Some error occurred." });
    });
};

// Retrieve all coupons (Admin Panel Table ke liye)
exports.findAll = (req, res) => {
  Coupon.find({}).sort({ createdAt: -1 })
    .then(data => {
      // 🚨 FIX: Wrapped array inside `data` key
      res.send({ success: true, data: data });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Find all active Coupons (User My Rewards ke liye)
exports.findAllActive = (req, res) => {
  const currentDate = new Date();
  
  // 🚨 FIX: Sirf wo coupons bhejenge jo abhi expire nahi hue hain
  Coupon.find({ expiryDate: { $gt: currentDate } }).sort({ createdAt: -1 })
    .then(data => {
      res.send({ success: true, data: data });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// 🚨 NEW FIX: Payment Page par Apply dabane ke liye yeh zaroori hai!
exports.verifyCoupon = async (req, res) => {
  try {
    const { code, challengeSize } = req.body;
    const currentDate = new Date();

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ success: false, message: "Invalid Coupon Code" });
    if (new Date(coupon.expiryDate) < currentDate) return res.status(400).json({ success: false, message: "Coupon has expired" });
    
    // Check if applicable for this size (0 means all accounts)
    let cSize = coupon.applicableForSize || coupon.applicableforSize;
    if (cSize !== 0 && cSize !== challengeSize) {
      return res.status(400).json({ success: false, message: `Only valid for ${cSize/1000}K Challenge` });
    }

    res.status(200).json({ success: true, message: "Coupon applied!", discountPercentage: coupon.discountPercentage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ... (Neeche tumhare baaki ke findOne, update, delete wale functions waise hi rehne do) ...