/**
 * WordSet Controller
 * Handle word set operations
 */

const WordSet = require('../models/WordSet');
const Word = require('../models/Word');

/**
 * @desc    Get all word sets
 * @route   GET /api/wordsets
 * @access  Public
 */
exports.getAllWordSets = async (req, res) => {
  try {
    const { category, difficulty, isPublic, page = 1, limit = 20 } = req.query;

    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [wordSets, total] = await Promise.all([
      WordSet.find(query)
        .populate('userId', 'username displayName avatar')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ 'statistics.totalStudies': -1 }),
      WordSet.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: wordSets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get word sets error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get word set by ID
 * @route   GET /api/wordsets/:id
 * @access  Public
 */
exports.getWordSetById = async (req, res) => {
  try {
    const wordSet = await WordSet.findById(req.params.id)
      .populate('userId', 'username displayName avatar')
      .populate('wordIds');

    if (!wordSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Word set not found' 
      });
    }

    res.json({
      success: true,
      data: wordSet
    });
  } catch (error) {
    console.error('Get word set error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Create new word set
 * @route   POST /api/wordsets
 * @access  Private
 */
exports.createWordSet = async (req, res) => {
  try {
    const wordSetData = {
      ...req.body,
      userId: req.userId
    };

    const wordSet = await WordSet.create(wordSetData);

    res.status(201).json({
      success: true,
      message: 'Word set created successfully',
      data: wordSet
    });
  } catch (error) {
    console.error('Create word set error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update word set
 * @route   PUT /api/wordsets/:id
 * @access  Private
 */
exports.updateWordSet = async (req, res) => {
  try {
    const wordSet = await WordSet.findById(req.params.id);

    if (!wordSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Word set not found' 
      });
    }

    // Check ownership
    if (wordSet.userId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this word set' 
      });
    }

    Object.assign(wordSet, req.body);
    await wordSet.save();

    res.json({
      success: true,
      message: 'Word set updated successfully',
      data: wordSet
    });
  } catch (error) {
    console.error('Update word set error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Delete word set
 * @route   DELETE /api/wordsets/:id
 * @access  Private
 */
exports.deleteWordSet = async (req, res) => {
  try {
    const wordSet = await WordSet.findById(req.params.id);

    if (!wordSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Word set not found' 
      });
    }

    // Check ownership
    if (wordSet.userId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this word set' 
      });
    }

    await wordSet.deleteOne();

    res.json({
      success: true,
      message: 'Word set deleted successfully'
    });
  } catch (error) {
    console.error('Delete word set error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Add words to word set
 * @route   POST /api/wordsets/:id/words
 * @access  Private
 */
exports.addWordsToSet = async (req, res) => {
  try {
    const { wordIds } = req.body;

    if (!Array.isArray(wordIds) || wordIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'wordIds must be a non-empty array' 
      });
    }

    const wordSet = await WordSet.findById(req.params.id);

    if (!wordSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Word set not found' 
      });
    }

    // Check ownership
    if (wordSet.userId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    // Verify all words exist
    const words = await Word.find({ _id: { $in: wordIds } });
    if (words.length !== wordIds.length) {
      return res.status(400).json({ 
        success: false, 
        message: 'Some word IDs are invalid' 
      });
    }

    // Add unique word IDs
    const uniqueWordIds = [...new Set([...wordSet.wordIds, ...wordIds])];
    wordSet.wordIds = uniqueWordIds;
    await wordSet.save();

    res.json({
      success: true,
      message: `Added ${wordIds.length} words to set`,
      data: wordSet
    });
  } catch (error) {
    console.error('Add words error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Remove words from word set
 * @route   DELETE /api/wordsets/:id/words
 * @access  Private
 */
exports.removeWordsFromSet = async (req, res) => {
  try {
    const { wordIds } = req.body;

    const wordSet = await WordSet.findById(req.params.id);

    if (!wordSet) {
      return res.status(404).json({ 
        success: false, 
        message: 'Word set not found' 
      });
    }

    // Check ownership
    if (wordSet.userId.toString() !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized' 
      });
    }

    wordSet.wordIds = wordSet.wordIds.filter(
      id => !wordIds.includes(id.toString())
    );
    await wordSet.save();

    res.json({
      success: true,
      message: 'Words removed from set',
      data: wordSet
    });
  } catch (error) {
    console.error('Remove words error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get user's word sets
 * @route   GET /api/wordsets/my-sets
 * @access  Private
 */
exports.getMyWordSets = async (req, res) => {
  try {
    const wordSets = await WordSet.find({ userId: req.userId })
      .populate('wordIds')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: wordSets
    });
  } catch (error) {
    console.error('Get my word sets error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
