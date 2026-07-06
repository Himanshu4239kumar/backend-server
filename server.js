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
/* ===================================
   CORS (Fixed for Vercel & Ionic)
=================================== */
app.use(cors({
  origin: true, // Yeh kisi bhi frontend origin (jaise localhost:8100) ko automatic allow kar dega
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
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

// Global variable mein connection save kar rahe hain taaki Vercel timeout na ho
let cachedDb = null;

async function connectDB() {
  // Agar connection pehle se hai, toh wahi use karo
  if (cachedDb) {
    console.log("Using cached MongoDB connection");
    return cachedDb;
  }

  // Naya connection banao (saath mein timeout limits badha rahe hain)
  try {
    const mongooseClient = await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // MongoDB connection dhoondhne ka max time
      socketTimeoutMS: 45000,          // Query execute karne ka max time
    });
    
    console.log("New MongoDB Connected");
    cachedDb = mongooseClient;
    
    // Sirf pehli baar role check karo
    initial();
    
    return mongooseClient;
  } catch (err) {
    console.error("MongoDB Connection Error", err);
    throw err;
  }
}

// Har API request aane par pehle connection check karo
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
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
require("./app/routes/payoutrequest.routes")(app);
// require("./app/routes/store.routes")(app);

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
   START SERVER (LOCAL PC KE LIYE)
=================================== */
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  // Local PC par start hote hi turant connect karne ke liye:
  connectDB().catch(console.error); 
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