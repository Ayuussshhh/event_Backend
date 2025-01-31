const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();  // To access environment variables from .env

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Set your Google Client ID
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Set your Google Client Secret
  callbackURL: process.env.GOOGLE_CALLBACK_URL, // Set your callback URL
}, function(accessToken, refreshToken, profile, done) {
  // Here you can save the profile to your database if needed
  return done(null, profile);
}));

// Serialize and deserialize the user (used for sessions)
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
