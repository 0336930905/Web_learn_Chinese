/**
 * Progress Routes
 * Using controller pattern
 */

const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.get('/', progressController.getProgress);
router.post('/word', progressController.updateWordProgress);
router.get('/stats', progressController.getStats);
router.get('/review', progressController.getWordsForReview);
router.post('/practice', progressController.savePracticeSession);

module.exports = router;

// @route   GET /api/progress
// @desc    Get user progress
// @access  Public
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    let progress = await Progress.findOne({ userId }).populate('learnedWords.wordId');
    
    if (!progress) {
      // Create default progress for new user
      progress = await Progress.create({ userId });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching progress',
      error: error.message
    });
  }
});

// @route   POST /api/progress/word
// @desc    Add or update word progress
// @access  Public
router.post('/word', async (req, res) => {
  try {
    const { userId = 'default-user', wordId, masteryLevel } = req.body;

    let progress = await Progress.findOne({ userId });
    
    if (!progress) {
      progress = await Progress.create({ userId });
    }

    // Check if word already exists in progress
    const existingWordIndex = progress.learnedWords.findIndex(
      w => w.wordId.toString() === wordId
    );

    if (existingWordIndex !== -1) {
      // Update existing word progress
      progress.learnedWords[existingWordIndex].masteryLevel = masteryLevel;
      progress.learnedWords[existingWordIndex].lastReviewed = Date.now();
      progress.learnedWords[existingWordIndex].reviewCount += 1;
    } else {
      // Add new word to progress
      progress.learnedWords.push({
        wordId,
        masteryLevel,
        lastReviewed: Date.now(),
        reviewCount: 1
      });
      progress.totalWordsLearned += 1;
    }

    progress.lastStudyDate = Date.now();
    await progress.save();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
});

// @route   POST /api/progress/streak
// @desc    Update study streak
// @access  Public
router.post('/streak', async (req, res) => {
  try {
    const { userId = 'default-user' } = req.body;
    
    let progress = await Progress.findOne({ userId });
    
    if (!progress) {
      progress = await Progress.create({ userId });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastStudy = progress.lastStudyDate ? new Date(progress.lastStudyDate) : null;
    
    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        progress.studyStreak += 1;
      } else if (daysDiff > 1) {
        // Streak broken
        progress.studyStreak = 1;
      }
      // If daysDiff === 0, already studied today, don't change streak
    } else {
      progress.studyStreak = 1;
    }

    progress.lastStudyDate = Date.now();
    await progress.save();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating streak',
      error: error.message
    });
  }
});

// @route   GET /api/progress/stats
// @desc    Get statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const userId = req.query.userId || 'default-user';
    const progress = await Progress.findOne({ userId });

    if (!progress) {
      return res.json({
        success: true,
        data: {
          totalWords: 0,
          studyStreak: 0,
          averageMastery: 0,
          level: 'beginner'
        }
      });
    }

    const totalWords = progress.totalWordsLearned;
    const averageMastery = progress.learnedWords.length > 0
      ? progress.learnedWords.reduce((sum, w) => sum + w.masteryLevel, 0) / progress.learnedWords.length
      : 0;

    res.json({
      success: true,
      data: {
        totalWords,
        studyStreak: progress.studyStreak,
        averageMastery: Math.round(averageMastery),
        level: progress.level,
        lastStudyDate: progress.lastStudyDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

module.exports = router;
