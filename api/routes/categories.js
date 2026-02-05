/**
 * Category Routes
 */

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get only user's own categories (for admin management)
router.get('/my-categories', categoryController.getMyCategories);

// Get public categories (for learning)
router.get('/public', categoryController.getPublicCategories);

// Category CRUD
router.get('/', categoryController.getAllCategories);
router.get('/stats', categoryController.getCategoryStats);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

// Initialize default categories
router.post('/init-defaults', categoryController.initDefaultCategories);

module.exports = router;
