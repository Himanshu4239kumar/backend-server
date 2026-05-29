const db = require("../models");
const Payment = db.payments;
const fs = require("fs");
  //C:\Users\Administrator\AngularNodeExpressMySQL\node-js-server\resources\static\assets
  //C:\Users\Administrator\AngularNodeExpressMySQL\node-js-server\app\resources\static\assets\uploads\
  global.__basedir = __dirname;

// Create and Save a new User
exports.create = (req, res) => {
  console.log("Hello")
    try {
      // console.log(req);
  
      if (req.file === undefined) {
        return res.send(`You must select a file.`);
        console.log("You must select a file.");
      }
  
      Payment.create({
       userId: req.body.userId,
     challengeSize: req.body.challengeSize,
      challengeType: req.body.challengeType,
      amount: req.body.amount,
      method: req.body.method,
      txid: req.body.txid,
        status: req.body.status ? req.body.status : false,
        fileName: req.file.filename,
        
        
      }).then(data => {
            return res.send(data);
            console.log(data)
            return res.send(`File has been uploaded.`);
      });
    } catch (error) {
      console.log(error);
      return res.send(`Error when trying upload images: ${error}`);
    }
};


// Retrieve all Orders
exports.findAll = (req, res) => {
  Payment.find({})
      .populate("userId") 
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving orders."
      });
    });
};

// Find a single Order by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Payment.findById(id)
    .then(data => {
      if (!data) {
        res.status(404).send({ message: "Not found Order with id " + id });
      } else res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving Order with id=" + id });
    });
};
// Find a single Order by userID
exports.findUserPayment = async (req, res) => {
  try {
    const data = await Payment.find({
      userId: req.params.userId
    }).populate("userId");

    res.send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving payments."
    });
  }
};

// Update an Order by ID
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty!" });
  }

  const id = req.params.id;

  Payment.findByIdAndUpdate(id, req.body, { useFindAndModify: false, new: true })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Order with id=${id}. Maybe it was not found!`
        });
      } else res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Order with id=" + id
      });
    });
};

// Delete an Order by ID
exports.delete = (req, res) => {
  const id = req.params.id;

  Payment.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Order with id=${id}. Maybe it was not found!`
        });
      } else {
        res.send({ message: "Order was deleted successfully!" });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Order with id=" + id
      });
    });
};

// Delete all Orders
exports.deleteAll = (req, res) => {
  Payment.deleteMany({})
    .then(data => {
      res.send({ message: `${data.deletedCount} Orders were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all orders."
      });
    });
};

// Find all active Orders
exports.findAllActive = (req, res) => {
  Payment.find({ active: true })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving active orders."
      });
    });
};

//