import express from 'express';
import { signup, login, logout, checkAuth } from '../controllers/auth.controller.js';  // Adjust path as necessary
import passport from 'passport';

const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route (clears JWT cookie)
router.post('/logout', logout);

// Check if the user is authenticated
router.get('/checkAuth', checkAuth);

// OAuth login routes (Google example)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('/');
  }
);

export default router;
