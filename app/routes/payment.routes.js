module.exports = app => {
  const payments = require("../controllers/payment.controller.js");

  const fs = require("fs");
  const multer = require("multer");
  const path = require("path");
  const { v4: uuidv4 } = require("uuid"); 
  
  global.__basedir = __dirname;
  
  
  const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  };
  
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __basedir + "../../../uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, uuidv4() +
      path.extname(file.originalname));
    },
  });
  
  var uploadFile = multer({ storage: storage, fileFilter: imageFilter });

  var router = require("express").Router();
  
  // Create a new Payment
  router.post("/", uploadFile.single("file"), payments.create);
  

  // Retrieve all payments
  router.get("/", payments.findAll);

  // Retrieve all active payments
  router.get("/active", payments.findAllActive);

  // Retrieve a single Order with id
  router.get("/:id", payments.findOne);

  router.get("/user/:userId", payments.findUserPayment);

  // Update an Order with id
  router.put("/:id", payments.update);

  // Delete an Order with id
  router.delete("/:id", payments.delete);

  // Delete all payments
  router.delete("/", payments.deleteAll);

  app.use("/api/payments", router);
};
//
