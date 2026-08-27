const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/authMiddleware");
const { requireVerifiedEmail } = require("../../middleware/authMiddleware.js");
const {
  makePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
} = require("../../controllers/paymentController.js");

// Payment providers call these URLs without the user's JWT.
router.post("/success", paymentSuccess);
router.get("/success", paymentSuccess);
router.post("/fail", paymentFail);
router.get("/fail", paymentFail);
router.post("/cancel", paymentCancel);
router.get("/cancel", paymentCancel);

router.use(protect, requireVerifiedEmail);

router.get("/checkout", makePayment);

module.exports = router;
