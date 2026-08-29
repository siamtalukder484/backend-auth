const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

/**
 * Configure Passport to use Google OAuth 2.0 Strategy
 * 
 * Flow:
 * 1. User clicks "Sign in with Google" on frontend.
 * 2. Redirected to Google consent screen.
 * 3. Upon authorization, Google redirects to backend callback URL with code.
 * 4. Passport exchanges code for profile info & invokes this callback function.
 * 5. We find or create the user in MongoDB database, then pass the user object to the route handler.
 */
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL =
  process.env.GOOGLE_CALLBACK ||
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:8000/api/v1/auth/google/callback";

if (clientID && clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Extract primary email and profile image from Google profile object
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
          const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : "";

          if (!email) {
            return done(new Error("No email address found in Google account profile"), null);
          }

          // 1. Check if user already exists with this googleId
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            if (!user.isApproved || !user.isEmailVerified) {
              user.isApproved = true;
              user.isEmailVerified = true;
              await user.save();
            }
            return done(null, user);
          }

          // 2. If googleId not found, check if user exists with the same email address
          user = await User.findOne({ email });

          if (user) {
            // Link existing account with Google ID and ensure email is verified & approved
            user.googleId = profile.id;
            user.isEmailVerified = true;
            user.isApproved = true;
            if (!user.profilePicture && photo) {
              user.profilePicture = photo;
            }
            await user.save();
            return done(null, user);
          }

          // 3. If user does not exist at all, create a new user record in backend database
          const displayName = profile.displayName || 
            (profile.name ? `${profile.name.givenName || ""} ${profile.name.familyName || ""}`.trim() : "") || 
            "Google User";

          user = await User.create({
            name: displayName,
            email: email,
            googleId: profile.id,
            profilePicture: photo,
            isEmailVerified: true,
            isApproved: true, // Google OAuth users are verified and auto-approved
            role: "student",
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.warn("⚠️ Warning: Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) missing in .env");
}

module.exports = passport;
