const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Word = require('../models/Word');
const Category = require('../models/Category');
const { protect, adminOnly } = require('../middleware/auth');

// ============================================
// ADMIN STATISTICS
// ============================================

/**
 * @route   GET /api/admin/stats
 * @desc    Get overall system statistics
 * @access  Admin only
 */
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        console.log('📊 Admin fetching statistics...');

        const [totalUsers, totalWords, totalCategories] = await Promise.all([
            User.countDocuments(),
            Word.countDocuments(),
            Category.countDocuments()
        ]);

        // Get active users today (created or updated today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const activeToday = await User.countDocuments({
            $or: [
                { createdAt: { $gte: today } },
                { updatedAt: { $gte: today } }
            ]
        });

        const stats = {
            totalUsers,
            totalWords,
            totalCategories,
            activeToday
        };

        console.log('✅ Statistics:', stats);
        res.json({ success: true, data: stats });
    } catch (error) {
        console.error('❌ Error fetching statistics:', error);
        res.status(500).json({ success: false, message: 'Error fetching statistics', error: error.message });
    }
});

// ============================================
// USER MANAGEMENT
// ============================================

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with their word counts
 * @access  Admin only
 */
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        console.log('👥 Admin fetching all users...');

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .lean();

        // Get word counts for each user
        const usersWithCounts = await Promise.all(
            users.map(async (user) => {
                const wordCount = await Word.countDocuments({ createdBy: user._id });
                return { ...user, wordCount };
            })
        );

        console.log('✅ Found users:', usersWithCounts.length);
        res.json({ success: true, data: usersWithCounts });
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user details
 * @access  Admin only
 */
router.get('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get user's words and categories
        const [words, categories] = await Promise.all([
            Word.find({ createdBy: user._id }).lean(),
            Category.find({ userId: user._id }).lean()
        ]);

        const userData = {
            ...user,
            wordCount: words.length,
            categoryCount: categories.length,
            words,
            categories
        };

        res.json({ success: true, data: userData });
    } catch (error) {
        console.error('❌ Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
    }
});

/**
 * @route   PATCH /api/admin/users/:id/toggle-status
 * @desc    Toggle user active status (lock/unlock account)
 * @access  Admin only
 */
router.patch('/users/:id/toggle-status', protect, adminOnly, async (req, res) => {
    try {
        console.log('🔒 Admin toggling user status:', req.params.id);
        const { isActive } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent locking admin accounts
        if (user.isAdmin || user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot lock admin accounts' });
        }

        user.isActive = isActive;
        await user.save();

        console.log(`✅ User ${isActive ? 'unlocked' : 'locked'} successfully`);
        res.json({ 
            success: true, 
            message: `User ${isActive ? 'unlocked' : 'locked'} successfully`,
            data: { isActive: user.isActive }
        });
    } catch (error) {
        console.error('❌ Error toggling user status:', error);
        res.status(500).json({ success: false, message: 'Error toggling user status', error: error.message });
    }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user and all their data (DANGEROUS - use toggle-status instead)
 * @access  Admin only
 */
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        console.log('🗑️ Admin deleting user:', req.params.id);

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent deleting admin accounts
        if (user.isAdmin || user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete admin accounts' });
        }

        // Delete all user's words, categories, and progress
        await Promise.all([
            Word.deleteMany({ createdBy: user._id }),
            Category.deleteMany({ userId: user._id })
        ]);

        // Delete the user
        await user.deleteOne();

        console.log('✅ User deleted successfully');
        res.json({ success: true, message: 'User and all associated data deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
    }
});

/**
 * @route   PATCH /api/admin/users/:id
 * @desc    Update user information
 * @access  Admin only
 */
router.patch('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const { name, email, isAdmin } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (typeof isAdmin !== 'undefined') user.isAdmin = isAdmin;

        await user.save();

        const userData = user.toObject();
        delete userData.password;

        res.json({ success: true, data: userData });
    } catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
    }
});

// ============================================
// WORDS MANAGEMENT
// ============================================

/**
 * @route   GET /api/admin/words
 * @desc    Get all words created by admin only
 * @access  Admin only
 */
router.get('/words', protect, adminOnly, async (req, res) => {
    try {
        console.log('📚 Admin fetching admin words...');

        // Only get words created by admins (isAdmin: true or role: 'admin')
        const adminUsers = await User.find({
            $or: [
                { isAdmin: true },
                { role: 'admin' }
            ]
        }).select('_id');

        const adminUserIds = adminUsers.map(u => u._id);

        const words = await Word.find({
            createdBy: { $in: adminUserIds }
        })
            .populate('createdBy', 'email name')
            .sort({ createdAt: -1 })
            .lean();

        console.log('✅ Found words:', words.length);
        res.json({ success: true, data: words });
    } catch (error) {
        console.error('❌ Error fetching words:', error);
        res.status(500).json({ success: false, message: 'Error fetching words', error: error.message });
    }
});

/**
 * @route   DELETE /api/admin/words/:id
 * @desc    Delete any word (admin override)
 * @access  Admin only
 */
router.delete('/words/:id', protect, adminOnly, async (req, res) => {
    try {
        console.log('🗑️ Admin deleting word:', req.params.id);

        const word = await Word.findById(req.params.id);
        if (!word) {
            return res.status(404).json({ success: false, message: 'Word not found' });
        }

        await word.deleteOne();

        console.log('✅ Word deleted successfully');
        res.json({ success: true, message: 'Word deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting word:', error);
        res.status(500).json({ success: false, message: 'Error deleting word', error: error.message });
    }
});

// ============================================
// CATEGORIES MANAGEMENT
// ============================================

/**
 * @route   GET /api/admin/categories
 * @desc    Get all categories from all users
 * @access  Admin only
 */
router.get('/categories', protect, adminOnly, async (req, res) => {
    try {
        console.log('📁 Admin fetching all categories...');

        const categories = await Category.find()
            .populate('userId', 'email name')
            .sort({ isSystem: -1, createdAt: -1 })
            .lean();

        console.log('✅ Found categories:', categories.length);
        res.json({ success: true, data: categories });
    } catch (error) {
        console.error('❌ Error fetching categories:', error);
        res.status(500).json({ success: false, message: 'Error fetching categories', error: error.message });
    }
});

/**
 * @route   DELETE /api/admin/categories/:id
 * @desc    Delete any category (admin override)
 * @access  Admin only
 */
router.delete('/categories/:id', protect, adminOnly, async (req, res) => {
    try {
        console.log('🗑️ Admin deleting category:', req.params.id);

        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Check if it's a system category
        if (category.isSystem) {
            return res.status(400).json({ success: false, message: 'Cannot delete system category' });
        }

        await category.deleteOne();

        console.log('✅ Category deleted successfully');
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('❌ Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Error deleting category', error: error.message });
    }
});

// ============================================
// ACTIVITY LOG
// ============================================

/**
 * @route   GET /api/admin/activity
 * @desc    Get recent activity logs
 * @access  Admin only
 */
router.get('/activity', protect, adminOnly, async (req, res) => {
    try {
        console.log('📋 Admin fetching activity logs...');

        // Get recent users
        const recentUsers = await User.find()
            .select('email createdAt')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Get recent words
        const recentWords = await Word.find()
            .populate('createdBy', 'email')
            .select('traditional createdBy createdAt')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        // Get recent categories
        const recentCategories = await Category.find()
            .populate('userId', 'email')
            .select('name userId createdAt')
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        const activities = [
            ...recentUsers.map(u => ({
                type: 'user_registered',
                user: u.email,
                timestamp: u.createdAt,
                description: 'Người dùng mới đăng ký'
            })),
            ...recentWords.map(w => ({
                type: 'word_added',
                user: w.createdBy?.email || 'Unknown',
                timestamp: w.createdAt,
                description: `Thêm từ vựng: ${w.traditional}`
            })),
            ...recentCategories.map(c => ({
                type: 'category_created',
                user: c.userId?.email || 'System',
                timestamp: c.createdAt,
                description: `Tạo danh mục: ${c.name}`
            }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 20);

        res.json({ success: true, data: activities });
    } catch (error) {
        console.error('❌ Error fetching activity:', error);
        res.status(500).json({ success: false, message: 'Error fetching activity', error: error.message });
    }
});

// ============================================
// DATABASE BACKUP
// ============================================

/**
 * @route   POST /api/admin/backup
 * @desc    Create database backup (export all collections)
 * @access  Admin only
 */
router.post('/backup', protect, adminOnly, async (req, res) => {
    try {
        console.log('💾 Admin creating database backup...');

        // Export all collections
        const [users, words, categories] = await Promise.all([
            User.find().select('-password').lean(),
            Word.find().lean(),
            Category.find().lean()
        ]);

        const backup = {
            metadata: {
                timestamp: new Date().toISOString(),
                version: '1.0',
                collections: ['users', 'words', 'categories']
            },
            data: {
                users,
                words,
                categories
            },
            stats: {
                totalUsers: users.length,
                totalWords: words.length,
                totalCategories: categories.length
            }
        };

        console.log('✅ Backup created:', {
            users: users.length,
            words: words.length,
            categories: categories.length
        });

        res.json({
            success: true,
            message: 'Backup created successfully',
            data: backup
        });
    } catch (error) {
        console.error('❌ Error creating backup:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating backup',
            error: error.message
        });
    }
});

/**
 * @desc    Restore default settings (delete all user's categories and words, create defaults)
 * @route   POST /api/admin/restore-defaults
 * @access  Admin only
 */
router.post('/restore-defaults', adminOnly, async (req, res) => {
    try {
        console.log('🔄 Restoring default settings for user:', req.userId);
        
        const Category = require('../models/Category');
        const Word = require('../models/Word');
        
        // Delete all categories and words for this user
        const deletedCategories = await Category.deleteMany({ userId: req.userId });
        const deletedWords = await Word.deleteMany({ createdBy: req.userId });
        
        console.log(`✅ Deleted ${deletedCategories.deletedCount} categories and ${deletedWords.deletedCount} words`);
        
        // Create default categories
        const defaultCategories = [
            { slug: 'beginner', name: 'Cơ bản', description: 'Từ vựng cơ bản cho người mới bắt đầu', icon: '📗', order: 1, isPublic: true, isSystem: true },
            { slug: 'intermediate', name: 'Trung cấp', description: 'Từ vựng trung cấp nâng cao', icon: '📘', order: 2, isPublic: true, isSystem: true },
            { slug: 'advanced', name: 'Nâng cao', description: 'Từ vựng nâng cao cho người thành thạo', icon: '📕', order: 3, isPublic: true, isSystem: true },
            { slug: 'common-phrases', name: 'Cụm từ thường dùng', description: 'Các cụm từ giao tiếp hàng ngày', icon: '💬', order: 4, isPublic: true, isSystem: true },
            { slug: 'numbers', name: 'Số đếm', description: 'Số đếm và phép tính', icon: '🔢', order: 5, isPublic: true, isSystem: true },
            { slug: 'colors', name: 'Màu sắc', description: 'Tên các màu sắc', icon: '🎨', order: 6, isPublic: true, isSystem: true },
            { slug: 'food', name: 'Đồ ăn', description: 'Thực phẩm và đồ uống', icon: '🍜', order: 7, isPublic: true, isSystem: true },
            { slug: 'family', name: 'Gia đình', description: 'Các thành viên trong gia đình', icon: '👨‍👩‍👧‍👦', order: 8, isPublic: true, isSystem: true },
            { slug: 'school', name: 'Trường học', description: 'Từ vựng liên quan đến giáo dục', icon: '🏫', order: 9, isPublic: true, isSystem: true },
            { slug: 'work', name: 'Công việc', description: 'Từ vựng về nghề nghiệp và công việc', icon: '💼', order: 10, isPublic: true, isSystem: true },
            { slug: 'travel', name: 'Du lịch', description: 'Từ vựng khi đi du lịch', icon: '✈️', order: 11, isPublic: true, isSystem: true },
            { slug: 'other', name: 'Khác', description: 'Từ vựng chung', icon: '📁', order: 99, isPublic: true, isSystem: true }
        ];
        
        const createdCategories = [];
        for (const cat of defaultCategories) {
            const newCat = await Category.create({
                ...cat,
                userId: req.userId
            });
            createdCategories.push(newCat);
        }
        
        console.log(`✅ Created ${createdCategories.length} default categories`);
        
        res.json({
            success: true,
            message: 'Đã khôi phục cài đặt gốc thành công',
            data: {
                deletedCategories: deletedCategories.deletedCount,
                deletedWords: deletedWords.deletedCount,
                createdCategories: createdCategories.length
            }
        });
    } catch (error) {
        console.error('❌ Error restoring defaults:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi khôi phục cài đặt gốc',
            error: error.message
        });
    }
});

module.exports = router;
