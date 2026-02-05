/**
 * Authentication Routes
 * Handle login, register, Google OAuth
 */

const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { authMiddleware } = require('../middleware/auth');
const authController = require('../controllers/authController');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/pages/auth/login.html?error=Authentication%20failed'
  }),
  authController.googleCallback
);

// Protected routes
router.get('/verify', authMiddleware, authController.verifyToken);
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authController.logout);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
