const express = require("express");
const router = express.Router();
const {
  getPendingUsers,
  approveUser,
  rejectUser,
  getTeachers,
  getStudents,
  getAllUsers,
  getStudentById,
  getApprovedStudentAndTeacher
} = require("../../controllers/adminController");
const { protect, requireAdmin } = require("../../middleware/authMiddleware");


router.use(protect, requireAdmin);
router.get("/users/pending", getPendingUsers);
router.patch("/users/:userId/approve", approveUser);
router.delete("/users/:userId/reject", rejectUser);
router.get("/teachers", getTeachers);
router.get("/students", getStudents);
router.get("/users", getAllUsers);
router.get("/get-student/:id", getStudentById)
router.get("/approved-user-list", getApprovedStudentAndTeacher)

module.exports = router;
