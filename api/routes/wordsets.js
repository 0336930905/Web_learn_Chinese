/**
 * WordSet Routes
 * Using controller pattern
 */

const express = require('express');
const router = express.Router();
const wordSetController = require('../controllers/wordSetController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', wordSetController.getAllWordSets);
router.get('/:id', wordSetController.getWordSetById);

// Protected routes
router.use(authMiddleware);
router.get('/my/sets', wordSetController.getMyWordSets);
router.post('/', wordSetController.createWordSet);
router.put('/:id', wordSetController.updateWordSet);
router.delete('/:id', wordSetController.deleteWordSet);
router.post('/:id/words', wordSetController.addWordsToSet);
router.delete('/:id/words', wordSetController.removeWordsFromSet);

module.exports = router;
