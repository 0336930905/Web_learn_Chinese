/**
 * Test Routes
 * Routes for test generation, results, and statistics
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  generateRandomTest,
  saveTestResults,
  getTestHistory,
  getTestResult,
  getTestStats
} = require('../controllers/testController');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/tests/random
 * @desc    Generate random test questions
 * @access  Private
 * @query   count - Number of questions (default: 20, max: 100)
 * @query   difficulty - Difficulty level: '1' (easy), '2' (medium), '3' (hard), 'mixed' (default)
 * @query   category - Category slug (optional)
 */
router.get('/random', generateRandomTest);

/**
 * @route   POST /api/tests/results
 * @desc    Save test results
 * @access  Private
 * @body    sessionId, answers[], score, timeSpent, totalQuestions, correctAnswers, incorrectAnswers
 */
router.post('/results', saveTestResults);

/**
 * @route   GET /api/tests/history
 * @desc    Get user's test history
 * @access  Private
 * @query   limit - Number of results per page (default: 10)
 * @query   skip - Number of results to skip (default: 0)
 */
router.get('/history', getTestHistory);

/**
 * @route   GET /api/tests/results/:resultId
 * @desc    Get detailed test result
 * @access  Private
 * @param   resultId - Test result ID
 */
router.get('/results/:resultId', getTestResult);

/**
 * @route   GET /api/tests/stats
 * @desc    Get user's test statistics
 * @access  Private
 */
router.get('/stats', getTestStats);

module.exports = router;
