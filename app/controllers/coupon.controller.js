// 1. Create and Save a new Coupon 
exports.create = (req, res) => {
  if (!req.body.code) {
    return res.status(400).send({ message: "Coupon Code can not be empty!" });
  }

  // 🚨 ASLI FIX: Zero (0) ko properly database mein save karne ka logic
  let sizeToSave = req.body.applicableForSize;
  if (sizeToSave === undefined || sizeToSave === null) {
    sizeToSave = req.body.applicableforSize; // Purani spelling ka backup
  }
  if (sizeToSave === undefined || sizeToSave === null || sizeToSave === "") {
    sizeToSave = 0; // Agar kuch nahi mila toh default All Accounts (0) maano
  }

  const coupon = new Coupon({
    code: req.body.code.toUpperCase(),
    discountPercentage: req.body.discountPercentage,
    expiryDate: req.body.expiryDate,
    applicableForSize: Number(sizeToSave), // 🚨 Yahan confirm Number banega
    isActive: true
  });

  coupon.save()
    .then(data => {
      res.send({ success: true, data: data, message: "Coupon created successfully" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Some error occurred." });
    });
};