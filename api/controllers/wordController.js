/**
 * Word Controller
 * Handle word management and operations
 */

const Word = require('../models/Word');
const Category = require('../models/Category');

/**
 * @desc    Get all words (only user's personal words - strict isolation)
 * @route   GET /api/words
 * @access  Private
 */
exports.getAllWords = async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      search,
      page = 1, 
      limit = 20 
    } = req.query;

    // Build query - ONLY get user's own words (strict isolation)
    const query = {
      createdBy: req.userId
    };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = parseInt(difficulty);
    if (search) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { traditional: { $regex: search, $options: 'i' } },
          { simplified: { $regex: search, $options: 'i' } },
          { pinyin: { $regex: search, $options: 'i' } },
          { vietnamese: { $regex: search, $options: 'i' } }
        ]
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [words, total] = await Promise.all([
      Word.find(query)
        .populate('createdBy', 'username displayName')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Word.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: words,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get words error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get word by ID
 * @route   GET /api/words/:id
 * @access  Private
 */
exports.getWordById = async (req, res) => {
  try {
    const word = await Word.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.userId },
        { isPublic: true }
      ]
    }).populate('createdBy', 'username displayName');

    if (!word) {
      return res.status(404).json({ 
        success: false, 
        message: 'Word not found or no access' 
      });
    }

    res.json({
      success: true,
      data: word
    });
  } catch (error) {
    console.error('Get word error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Create new word
 * @route   POST /api/words
 * @access  Private
 */
exports.createWord = async (req, res) => {
  try {
    console.log('📝 Create word request:', req.body);
    console.log('👤 User ID:', req.userId);

    // Validate category exists if provided (and not empty)
    if (req.body.category && req.body.category.trim() !== '') {
      const categoryExists = await Category.findOne({
        slug: req.body.category,
        $or: [
          { userId: req.userId },
          { isSystem: true }
        ]
      });

      if (!categoryExists) {
        console.log('❌ Category not found:', req.body.category);
        return res.status(400).json({
          success: false,
          message: `Category "${req.body.category}" not found. Please select a valid category.`
        });
      }
      console.log('✅ Category validated:', req.body.category);
    }

    const wordData = {
      ...req.body,
      createdBy: req.userId,
      isPublic: req.body.isPublic || false,
      category: req.body.category || 'other' // Default to 'other' if not provided
    };

    console.log('💾 Creating word with data:', wordData);
    const word = await Word.create(wordData);
    console.log('✅ Word created successfully:', word._id);

    res.status(201).json({
      success: true,
      message: 'Word created successfully',
      data: word
    });
  } catch (error) {
    console.error('❌ Create word error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update word
 * @route   PUT /api/words/:id
 * @access  Private (Owner only)
 */
exports.updateWord = async (req, res) => {
  try {
    // Only allow owner to update
    const word = await Word.findOne({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!word) {
      return res.status(404).json({ 
        success: false, 
        message: 'Word not found or no permission to edit' 
      });
    }

    // Validate category exists if being updated
    if (req.body.category && req.body.category !== word.category) {
      const categoryExists = await Category.findOne({
        slug: req.body.category,
        $or: [
          { userId: req.userId },
          { isSystem: true }
        ]
      });

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found. Please select a valid category.'
        });
      }
    }

    Object.assign(word, req.body);
    await word.save();

    res.json({
      success: true,
      message: 'Word updated successfully',
      data: word
    });
  } catch (error) {
    console.error('Update word error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Delete word
 * @route   DELETE /api/words/:id
 * @access  Private (Owner only)
 */
exports.deleteWord = async (req, res) => {
  try {
    const word = await Word.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.userId
    });

    if (!word) {
      return res.status(404).json({ 
        success: false, 
        message: 'Word not found or no permission to delete' 
      });
    }

    res.json({
      success: true,
      message: 'Word deleted successfully'
    });
  } catch (error) {
    console.error('Delete word error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get random words for practice (from user's words + public words)
 * @route   GET /api/words/random
 * @access  Private
 */
exports.getRandomWords = async (req, res) => {
  try {
    const { count = 10, category, difficulty } = req.query;

    const query = {
      $or: [
        { createdBy: req.userId },
        { isPublic: true }
      ]
    };
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = parseInt(difficulty);

    const words = await Word.aggregate([
      { $match: query },
      { $sample: { size: parseInt(count) } }
    ]);

    res.json({
      success: true,
      data: words
    });
  } catch (error) {
    console.error('Get random words error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get words for practice by category (user's words + admin public words)
 * @route   GET /api/words/practice/category/:category
 * @access  Private
 */
exports.getWordsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 100, shuffle = 'true' } = req.query;

    // Find admin users
    const User = require('../models/User');
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminUserIds = adminUsers.map(user => user._id);

    // Build query to get user's words + admin's public words in this category
    const query = {
      category: category,
      $or: [
        { createdBy: req.userId },
        { 
          createdBy: { $in: adminUserIds },
          isPublic: true 
        }
      ]
    };

    let words;
    if (shuffle === 'true') {
      // Use aggregation for random sampling
      words = await Word.aggregate([
        { $match: query },
        { $sample: { size: parseInt(limit) } }
      ]);
    } else {
      // Get sorted by creation date
      words = await Word.find(query)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      data: words,
      count: words.length,
      category: category
    });
  } catch (error) {
    console.error('Get words by category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get words for practice with filters (optimized for learning modes)
 * @route   GET /api/words/practice
 * @access  Private
 */
exports.getPracticeWords = async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      count = 10,
      includeAdmin = 'true',
      shuffle = 'true'
    } = req.query;

    const mongoose = require('mongoose');
    const User = require('../models/User');
    
    console.log('🎯 Practice request:', { category, difficulty, count, includeAdmin, shuffle });
    console.log('👤 User ID:', req.userId);
    
    // Build simple query first
    const query = {};
    
    // Category filter
    if (category && category !== '' && category !== 'all') {
      query.category = category;
    }
    
    // Difficulty filter
    if (difficulty && difficulty !== 'all') {
      query.difficulty = parseInt(difficulty);
    }

    // Find admin users if needed
    let adminUserIds = [];
    if (includeAdmin === 'true') {
      const adminUsers = await User.find({ role: 'admin' }).select('_id');
      adminUserIds = adminUsers.map(user => user._id);
      console.log('👑 Found admin users:', adminUserIds.length);
    }

    // User access: own words + optionally admin public words
    if (includeAdmin === 'true' && adminUserIds.length > 0) {
      query.$or = [
        { createdBy: req.userId },
        { 
          createdBy: { $in: adminUserIds },
          isPublic: true 
        }
      ];
    } else {
      query.createdBy = req.userId;
    }

    console.log('📊 Final query:', JSON.stringify(query, null, 2));

    let words;
    const requestedCount = parseInt(count);
    
    if (shuffle === 'true') {
      // Random sampling with aggregate
      words = await Word.aggregate([
        { $match: query },
        { $sample: { size: Math.min(requestedCount, 1000) } }
      ]);
    } else {
      // Sorted by creation date
      words = await Word.find(query)
        .limit(requestedCount)
        .sort({ createdAt: -1 })
        .lean();
    }

    // Also return some metadata for UI
    const totalAvailable = await Word.countDocuments(query);

    console.log(`✅ Found ${words.length} words out of ${totalAvailable} total`);

    res.json({
      success: true,
      data: words,
      count: words.length,
      totalAvailable: totalAvailable,
      filters: {
        category: category || 'all',
        difficulty: difficulty || 'all',
        includeAdmin: includeAdmin === 'true'
      }
    });
  } catch (error) {
    console.error('❌ Get practice words error:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get all admin words
 * @route   GET /api/words/admin
 * @access  Private
 */
exports.getAdminWords = async (req, res) => {
  try {
    // Find all users with admin role
    const User = require('../models/User');
    const Category = require('../models/Category');
    
    console.log('🔍 Fetching admin words...');
    const adminUsers = await User.find({ role: 'admin' }).select('_id');
    const adminUserIds = adminUsers.map(user => user._id);
    console.log(`✅ Found ${adminUsers.length} admin users`);

    // Get all words created by admin users
    const words = await Word.find({ createdBy: { $in: adminUserIds } })
      .populate('createdBy', 'username displayName email role')
      .sort({ createdAt: -1 });
    console.log(`✅ Found ${words.length} admin words`);

    // Manually populate category info (since category is stored as slug string, not ObjectId)
    const categories = await Category.find({ isSystem: true });
    console.log(`✅ Found ${categories.length} system categories`);
    
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon
      };
    });

    // Add category object to each word
    const wordsWithCategory = words.map(word => {
      const wordObj = word.toObject();
      wordObj.categoryInfo = categoryMap[word.category] || null;
      return wordObj;
    });

    console.log(`✅ Returning ${wordsWithCategory.length} words with category info`);
    res.json({
      success: true,
      data: wordsWithCategory
    });
  } catch (error) {
    console.error('❌ Get admin words error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Get word categories
 * @route   GET /api/words/categories
 * @access  Public
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Word.distinct('category');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
