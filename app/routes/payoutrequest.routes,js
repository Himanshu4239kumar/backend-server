const express = require("express");
const router = express.Router();

const {
  createPayoutRequest,
  getAllPayoutRequests,
  getUserPayoutRequests,
  updatePayoutStatus,
} = require("../controllers/payoutrequest.controller");

router.post("/", createPayoutRequest);
router.get("/user/:userId", getUserPayoutRequests);

router.get("/", getAllPayoutRequests);
router.put("/:id/status", updatePayoutStatus);

module.exports = router;