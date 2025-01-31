const express = require('express');
const passport = require('passport');
const router = express.Router();

// Redirect to Google authentication page
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Handle the callback after Google has authenticated
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  successRedirect: '/user/dashboard'
}));

module.exports = router;
