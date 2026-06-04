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
   CORS (Fixed for Universal Access with Credentials)
=================================== */
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
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

      res.status(200).json({
        success: true,
        message: "File uploaded",
        file
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);
/* ===================================
   🚨 LIVE PRICE FEED API (MINUTE-BY-MINUTE DYNAMIC) 🚨
=================================== */
app.get("/api/price/live", (req, res) => {
  const timeSeed = Math.floor(Date.now() / 1000); // Seconds mein time

  // 1. Time ko Minutes aur Hours mein tod liya
  const minutesPassed = timeSeed / 60;   
  const hoursPassed = timeSeed / 3600;

  // 2. 🚨 MINUTE TREND (Sabse zaroori) 🚨
  // Ab har 1-2 minute mein price 50 points tak upar ya neeche ja sakta hai
  const minuteTrend = Math.sin(minutesPassed * 0.8) * 50; 
  
  // Har ghante ka bada swing (100 points)
  const hourlyTrend = Math.cos(hoursPassed * 0.5) * 100; 

  // Asli base price ab har minute tezi se badlega
  const dynamicBasePrice = 4500.00 + hourlyTrend + minuteTrend;

  // 3. SECONDS TREND (Live screen par jo fast flickering hoti hai)
  const wave1 = Math.sin(timeSeed * 0.5) * 3;     
  const wave2 = Math.cos(timeSeed * 0.2) * 1.5;   
  const noise = Math.sin(timeSeed * 10) * 0.5;    

  // 4. FINAL PRICE
  const currentPrice = (dynamicBasePrice + wave1 + wave2 + noise).toFixed(2);

  res.json({
    success: true,
    symbol: "XAUUSD",
    price: parseFloat(currentPrice),
    timestamp: Date.now()
  });
});

/* ===================================
   ROUTES
=================================== */
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/profile.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/payment.routes")(app);
require("./app/routes/address.routes")(app);
require("./app/routes/trade.routes")(app);

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
      new Role({ name: "user" }).save();
      new Role({ name: "moderator" }).save();
      new Role({ name: "admin" }).save();
      console.log("Default roles added");
    }
  });
}