/**
 * Category Controller
 * Handle category management operations
 */

const Category = require('../models/Category');
const Word = require('../models/Word');

/**
 * @desc    Get all categories for current user
 * @route   GET /api/categories
 * @access  Private
 */
exports.getAllCategories = async (req, res) => {
  try {
    // Only get categories owned by this user
    // Remove isSystem filter to avoid showing other admins' system categories
    const categories = await Category.find({
      userId: req.userId
    })
    .sort({ order: 1, createdAt: 1 });

    // Get word counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const wordCount = await Word.countDocuments({
          createdBy: req.userId,
          category: cat.slug
        });
        
        return {
          ...cat.toObject(),
          wordCount
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Private
 */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.userId },
        { isSystem: true }
      ]
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Get word count
    const wordCount = await Word.countDocuments({
      createdBy: req.userId,
      category: category.slug
    });

    res.json({
      success: true,
      data: {
        ...category.toObject(),
        wordCount
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private
 */
exports.createCategory = async (req, res) => {
  try {
    const { slug, name, description, icon, color, order } = req.body;

    // Validate required fields
    if (!slug || !name) {
      return res.status(400).json({
        success: false,
        message: 'Slug and name are required'
      });
    }

    // Check if slug already exists for this user
    const existing = await Category.findOne({
      userId: req.userId,
      slug: slug.toLowerCase()
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }

    const category = await Category.create({
      userId: req.userId,
      slug: slug.toLowerCase(),
      name,
      description: description || '',
      icon: icon || '📁',
      color: color || '#667eea',
      order: order || 0,
      isSystem: false
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        ...category.toObject(),
        wordCount: 0
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private
 */
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Cannot edit system categories
    if (category.isSystem) {
      return res.status(403).json({
        success: false,
        message: 'Cannot edit system categories'
      });
    }

    const { slug, name, description, icon, color, order } = req.body;

    // If slug is being changed, check for conflicts
    if (slug && slug !== category.slug) {
      const existing = await Category.findOne({
        userId: req.userId,
        slug: slug.toLowerCase(),
        _id: { $ne: req.params.id }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Category with this slug already exists'
        });
      }

      // Update all words with old category to new category
      const oldSlug = category.slug;
      category.slug = slug.toLowerCase();
      
      await Word.updateMany(
        { createdBy: req.userId, category: oldSlug },
        { category: category.slug }
      );
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (icon) category.icon = icon;
    if (color) category.color = color;
    if (order !== undefined) category.order = order;

    await category.save();

    // Get word count
    const wordCount = await Word.countDocuments({
      createdBy: req.userId,
      category: category.slug
    });

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: {
        ...category.toObject(),
        wordCount
      }
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this slug already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
exports.deleteCategory = async (req, res) => {
  try {
    const User = require('../models/User');
    
    // Find the requesting user to check if admin
    const user = await User.findById(req.userId);
    
    const category = await Category.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Only admin can delete system categories
    if (category.isSystem && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admin can delete system categories'
      });
    }

    // Check if category has words
    const wordCount = await Word.countDocuments({
      createdBy: req.userId,
      category: category.slug
    });

    // Delete all words in this category (CASCADE DELETE)
    if (wordCount > 0) {
      console.log(`⚠️ Deleting ${wordCount} words in category "${category.name}" (${category.slug})`);
      await Word.deleteMany({
        createdBy: req.userId,
        category: category.slug
      });
      console.log(`✅ Deleted ${wordCount} words`);
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: wordCount > 0 
        ? `Category and ${wordCount} words deleted successfully`
        : 'Category deleted successfully',
      deletedWords: wordCount
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get category statistics
 * @route   GET /api/categories/stats
 * @access  Private
 */
exports.getCategoryStats = async (req, res) => {
  try {
    const categories = await Category.find({
      $or: [
        { userId: req.userId },
        { isSystem: true }
      ]
    });

    const stats = await Promise.all(
      categories.map(async (cat) => {
        const wordCount = await Word.countDocuments({
          createdBy: req.userId,
          category: cat.slug
        });
        
        return {
          category: cat.slug,
          name: cat.name,
          icon: cat.icon,
          wordCount
        };
      })
    );

    const totalCategories = categories.length;
    const totalWords = stats.reduce((sum, s) => sum + s.wordCount, 0);
    const activeCategories = stats.filter(s => s.wordCount > 0).length;

    res.json({
      success: true,
      data: {
        totalCategories,
        totalWords,
        activeCategories,
        categories: stats
      }
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Initialize default categories for user
 * @route   POST /api/categories/init-defaults
 * @access  Private
 */
exports.initDefaultCategories = async (req, res) => {
  try {
    const defaultCategories = [
      { slug: 'beginner', name: 'Cơ bản', description: 'Từ vựng cơ bản cho người mới bắt đầu', icon: '📗', order: 1 },
      { slug: 'intermediate', name: 'Trung cấp', description: 'Từ vựng trung cấp nâng cao', icon: '📘', order: 2 },
      { slug: 'advanced', name: 'Nâng cao', description: 'Từ vựng nâng cao cho người thành thạo', icon: '📕', order: 3 },
      { slug: 'common-phrases', name: 'Cụm từ thường dùng', description: 'Các cụm từ giao tiếp hàng ngày', icon: '💬', order: 4 },
      { slug: 'numbers', name: 'Số đếm', description: 'Số đếm và phép tính', icon: '🔢', order: 5 },
      { slug: 'colors', name: 'Màu sắc', description: 'Tên các màu sắc', icon: '🎨', order: 6 },
      { slug: 'food', name: 'Đồ ăn', description: 'Thực phẩm và đồ uống', icon: '🍜', order: 7 },
      { slug: 'family', name: 'Gia đình', description: 'Các thành viên trong gia đình', icon: '👨‍👩‍👧‍👦', order: 8 },
      { slug: 'school', name: 'Trường học', description: 'Từ vựng liên quan đến giáo dục', icon: '🏫', order: 9 },
      { slug: 'work', name: 'Công việc', description: 'Từ vựng về nghề nghiệp và công việc', icon: '💼', order: 10 },
      { slug: 'travel', name: 'Du lịch', description: 'Từ vựng khi đi du lịch', icon: '✈️', order: 11 },
      { slug: 'other', name: 'Khác', description: 'Từ vựng chung', icon: '📁', order: 99 }
    ];

    const created = [];
    
    for (const cat of defaultCategories) {
      const existing = await Category.findOne({
        userId: req.userId,
        slug: cat.slug
      });

      if (!existing) {
        const newCat = await Category.create({
          ...cat,
          userId: req.userId,
          isSystem: false
        });
        created.push(newCat);
      }
    }

    res.json({
      success: true,
      message: `Initialized ${created.length} default categories`,
      data: created
    });
  } catch (error) {
    console.error('Init default categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get only user's own categories (for admin management)
 * @route   GET /api/categories/my-categories
 * @access  Private
 */
exports.getMyCategories = async (req, res) => {
  try {
    // Only get categories created by this user
    const categories = await Category.find({
      userId: req.userId
    })
    .sort({ order: 1, createdAt: 1 });

    // Get word counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const wordCount = await Word.countDocuments({
          createdBy: req.userId,
          category: cat.slug
        });
        
        return {
          ...cat.toObject(),
          wordCount
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCounts
    });
  } catch (error) {
    console.error('Get my categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * @desc    Get all public categories (for learning)
 * @route   GET /api/categories/public
 * @access  Private
 */
exports.getPublicCategories = async (req, res) => {
  try {
    // Get all public categories from all users
    const categories = await Category.find({
      isPublic: true
    })
    .populate('userId', 'username email role')
    .sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get public categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
