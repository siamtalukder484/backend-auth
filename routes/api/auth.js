const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController.js");
const { protect, requireVerifiedEmail, requireApproved } = require("../../middleware/authMiddleware.js");
const upload = require("../../middleware/fileUpload.js");
const {rateLimit} = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 2,
    skipSuccessfulRequests: true,
    message: { error: 'Too many requests, please try again later.' },
})

const passport = require("passport");

router.post("/register", authController.register);
router.post("/login", authController.login);

// --- Google OAuth Routes ---
// 1. Redirect user to Google login page
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// 2. Google OAuth callback handler
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_auth_failed`,
    session: false,
  }),
  authController.googleCallback
);

router.get("/verify-email/:token", authController.verifyEmail);
router.post("/resend-verification", authController.resendVerification);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/me", protect, requireVerifiedEmail, requireApproved, authController.getMe);
router.put("/profile", protect, requireVerifiedEmail, requireApproved, upload.single("profilePicture"), authController.updateProfile);

module.exports = router;
