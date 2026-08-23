const express = require("express");
const router = express.Router();

const auth = require("./auth.js");
const admin = require("./admin.js");
const subject = require("./subject.js")
const cls = require("./class.js")
const payment = require("./payment.js")

router.use("/auth", auth);
router.use("/admin", admin);
router.use("/subject", subject);
router.use("/class", cls);
router.use("/payment", payment)

module.exports = router;
