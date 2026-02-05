/**
 * Word Routes
 * Using controller pattern - Personalized learning
 */

const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication (personalized learning)
router.use(authMiddleware);

// Special routes first (must be before /:id)
router.get('/admin', wordController.getAdminWords);
router.get('/admin-words', wordController.getAdminWords); // Alias for backwards compatibility
router.get('/random', wordController.getRandomWords);
router.get('/categories', wordController.getCategories);

// Practice mode routes (must be before /:id)
router.get('/practice', wordController.getPracticeWords);
router.get('/practice/category/:category', wordController.getWordsByCategory);

// Standard CRUD routes
router.get('/', wordController.getAllWords);
router.get('/:id', wordController.getWordById);
router.post('/', wordController.createWord);
router.put('/:id', wordController.updateWord);
router.delete('/:id', wordController.deleteWord);

module.exports = router;
