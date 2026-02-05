/**
 * User Routes
 * Using controller pattern
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/leaderboard', userController.getLeaderboard);
router.get('/search', userController.searchUsers);
router.get('/:id', userController.getUserById);

// Protected routes
router.use(authMiddleware);
router.put('/profile', userController.updateProfile);
router.get('/stats/me', userController.getUserStats);
router.post('/add-xp', userController.addXP);
router.post('/update-streak', userController.updateStreak);

module.exports = router;
