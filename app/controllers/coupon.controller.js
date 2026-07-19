const db = require("../models");
const Coupon = db.coupons; 

// 1. Create and Save a new Coupon 
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
      res.send({ success: true, data: data, message: "Coupon created successfully" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Some error occurred." });
    });
};

// 2. Retrieve all coupons (Admin Panel Table ke liye)
exports.findAll = (req, res) => {
  Coupon.find({}).sort({ createdAt: -1 })
    .then(data => {
      res.send({ success: true, data: data });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// 3. Find all active Coupons (User My Rewards ke liye)
exports.findAllActive = (req, res) => {
  const currentDate = new Date();
  
  Coupon.find({ expiryDate: { $gt: currentDate } }).sort({ createdAt: -1 })
    .then(data => {
      res.send({ success: true, data: data });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// 4. Verify Coupon (Payment page ke liye)
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

// 5. Check Duplicate Coupon
exports.checkDuplicateCoupon = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: 'Coupon Code is required' });
    }
    const coupon = await Coupon.findOne({ code });
    return res.json({ exists: !!coupon });
  } catch (err) {
    console.error('Error checking Coupon Code:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// 6. Find a single Coupon with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Coupon.findById(id)
    .then(data => {
      if (!data) res.status(404).send({ message: "Not found Coupon with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving Coupon with id=" + id });
    });
};

// 7. Update a Coupon by the id
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty!" });
  }
  const id = req.params.id;
  Coupon.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot update Coupon with id=${id}. Maybe Coupon was not found!` });
      } else res.send({ message: "Coupon was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating Coupon with id=" + id });
    });
};

// 8. Delete a Coupon
exports.delete = (req, res) => {
  const id = req.params.id;
  Coupon.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({ message: `Cannot delete Coupon with id=${id}. Maybe Coupon was not found!` });
      } else {
        res.send({ message: "Coupon was deleted successfully!" });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Could not delete Coupon with id=" + id });
    });
};

// 9. Delete all Coupons
exports.deleteAll = (req, res) => {
  Coupon.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} Coupons were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Some error occurred while removing all Coupons." });
    });
};