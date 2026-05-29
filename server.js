const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require("path");
const multer = require("multer");

const app = express();

/* ===================================
   MULTER
=================================== */

const upload = multer({
  dest: "/tmp"
});

/* ===================================
   CORS
=================================== */

// const allowedOrigins = [
//   "http://localhost:3000",
//   "http://localhost:8100",
//   "http://localhost:8081",
//   "https://jyoti-bhagat.vercel.app"
// ];
const allowedOrigins = ["*"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS"
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept"
  ]
}));

app.options("*", cors());

/* ===================================
   BODY PARSER
=================================== */

app.use(express.json());

app.use(express.urlencoded({
  extended: true
}));

/* ===================================
   COOKIE SESSION
=================================== */

app.use(
  cookieSession({
    name: "kit-session",
    keys: [
      process.env.COOKIE_SECRET || "COOKIE_SECRET"
    ],
    httpOnly: true,
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
    secure:
      process.env.NODE_ENV === "production"
  })
);

/* ===================================
   DATABASE
=================================== */

const db = require("./app/models");

const Role = db.role;

db.mongoose.set("strictQuery", false);

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {

    console.log("MongoDB Connected");

    initial();

  })
  .catch((err) => {

    console.error("MongoDB Connection Error");

    console.error(err);

  });

/* ===================================
   TEST ROUTE
=================================== */

app.get("/test", (req, res) => {

  res.status(200).json({
    success: true,
    message: "Server working correctly"
  });

});

/* ===================================
   ROOT ROUTE
=================================== */

app.get("/", (req, res) => {

  res.json({
    message: "Backend running"
  });

});

/* ===================================
   STATIC FILES
=================================== */

app.use(express.static("public"));

/* ===================================
   FILE UPLOAD
=================================== */

app.post(
  "/upload",
  upload.single("file"),
  (req, res) => {

    try {

      const ename = req.body.ename;

      const qname = req.body.qname;

      const file = req.file;

      console.log("ename:", ename);

      console.log("qname:", qname);

      console.log("file:", file);

      res.status(200).json({
        success: true,
        message: "File uploaded",
        file
      });

    } catch (error) {

      console.error("Upload Error");

      console.error(error);

      res.status(500).json({
        success: false,
        error: error.message
      });

    }

  }
);

/* ===================================
   ROUTES
=================================== */

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/payment.routes")(app);
require("./app/routes/address.routes")(app);

/* ===================================
   GLOBAL ERROR HANDLER
=================================== */

app.use((err, req, res, next) => {

  console.error("GLOBAL ERROR");

  console.error(err);

  res.status(500).json({
    success: false,
    error: err.message
  });

});

/* ===================================
   EXPORT FOR VERCEL
=================================== */

module.exports = app;

/* ===================================
   INITIAL ROLES
=================================== */

function initial() {

  Role.estimatedDocumentCount((err, count) => {

    if (!err && count === 0) {

      new Role({
        name: "user"
      }).save();

      new Role({
        name: "moderator"
      }).save();

      new Role({
        name: "admin"
      }).save();

      console.log("Default roles added");

    }

  });

}