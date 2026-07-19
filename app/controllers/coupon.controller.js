const db = require("../models");
const Coupon = db.coupons;

// Create and Save a new Coupon 
exports.create = (req, res) => {
  // Validate request
  if (!req.body.code) {
    res.status(400).send({ message: "Coupon Code can not be empty!" });
    return;
  }

  // Create a Coupon
  const coupon = new Coupon({
    code: req.body.code,
    discountPercentage: req.body.discountPercentage,
    expiryDate: req.body.expiryDate,
    applicableforSize: req.body.applicableforSize
  });

  // Save coupon in the database
  coupon
    .save(coupon)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the coupon."
      });
    });
};

// Retrieve all coupons from the database.
exports.findAll = (req, res) => {
  const code = req.query.code;
  var condition = code ? { code: { $regex: new RegExp(code), $options: "i" } } : {};

  Coupon.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Coupons."
      });
    });
};

exports.checkDuplicateCoupon = async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(400).json({ error: 'Coupon Code is required' });
    }

    const coupon = await Coupon.findOne({ code });

    return res.json({ exists: !!coupon }); // cleaner than if/else
  } catch (err) {
    console.error('Error checking Coupon Code:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Find a single Coupon with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Coupon.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Coupon with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Coupon with id=" + id });
    });
};

// Update a Coupon by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Coupon.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Coupon with id=${id}. Maybe Coupon was not found!`
        });
      } else res.send({ message: "Coupon was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Coupon with id=" + id
      });
    });
};

// Delete a Coupon with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Coupon.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Coupon with id=${id}. Maybe Coupon was not found!`
        });
      } else {
        res.send({
          message: "Coupon was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Coupon with id=" + id
      });
    });
};

// Delete all Coupons from the database.
exports.deleteAll = (req, res) => {
  Coupon.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Coupons were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Coupons."
      });
    });
};

// Find all published Coupons   
exports.findAllActive = (req, res) => {
  Coupon.find({ active: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Coupons."
      });
    });
};
