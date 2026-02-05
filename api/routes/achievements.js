/**
 * Achievement Routes
 */

const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get user achievements
router.get('/', achievementController.getUserAchievements);

// Get all available badges
router.get('/badges', achievementController.getAllBadges);

// Get achievement progress
router.get('/progress', achievementController.getAchievementProgress);

// Check and award achievements
router.post('/check', achievementController.checkAndAwardAchievements);

// Get stats summary
router.get('/stats-summary', achievementController.getStatsSummary);

module.exports = router;
