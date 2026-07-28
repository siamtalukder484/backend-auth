const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../../middleware/authMiddleware");
const { requireVerifiedEmail } = require("../../middleware/authMiddleware.js");
const subjectController = require("../../controllers/subjectController.js");

router.use(protect, requireAdmin, requireVerifiedEmail);
router.post("/create", subjectController.createSubject);
router.get("/get", subjectController.getSubjects);
router.put("/update/:id", subjectController.updateSubject);
router.delete("/delete/:id", subjectController.deleteSubject);

module.exports = router;