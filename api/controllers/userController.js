/**
 * User Controller
 * Handle user profile and management
 */

const User = require('../models/User');
const UserStats = require('../models/UserStats');
const Achievement = require('../models/Achievement');
const Notification = require('../models/Notification');
const Progress = require('../models/Progress');

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .lean();

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { displayName, bio, avatar, preferences } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Update fields
    if (displayName) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Cập nhật profile thành công',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/users/stats
 * @access  Private
 */
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Get progress data
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) {
      progress = {
        totalWordsLearned: 0,
        studyStreak: 0,
        learnedWords: []
      };
    }

    // Get recent stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentStats = await UserStats.find({
      userId: req.userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    // Get achievement stats (if method exists)
    let achievementStats = null;
    if (Achievement.getUserStats) {
      try {
        achievementStats = await Achievement.getUserStats(req.userId);
      } catch (err) {
        console.log('Achievement stats not available');
      }
    }

    res.json({
      success: true,
      data: {
        user: {
          level: user.level || 1,
          totalXP: user.totalXP || 0,
          currentLevelXP: user.currentLevelXP || 0,
          streak: user.streak || 0,
          longestStreak: user.longestStreak || 0,
          totalWords: progress.totalWordsLearned || 0
        },
        progress: {
          totalWordsLearned: progress.totalWordsLearned || 0,
          studyStreak: progress.studyStreak || 0,
          learnedWordsCount: progress.learnedWords ? progress.learnedWords.length : 0
        },
        recentStats,
        achievements: achievementStats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get leaderboard
 * @route   GET /api/users/leaderboard
 * @access  Public
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const { type = 'xp', limit = 10 } = req.query;

    let sortField;
    switch (type) {
      case 'xp':
        sortField = { totalXP: -1 };
        break;
      case 'level':
        sortField = { level: -1, totalXP: -1 };
        break;
      case 'streak':
        sortField = { streak: -1 };
        break;
      default:
        sortField = { totalXP: -1 };
    }

    const users = await User.find({ isActive: true })
      .select('username displayName avatar level totalXP streak')
      .sort(sortField)
      .limit(parseInt(limit));

    res.json({
      success: true,
      leaderboard: users
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Add XP to user
 * @route   POST /api/users/add-xp
 * @access  Private
 */
exports.addXP = async (req, res) => {
  try {
    const { xp, reason } = req.body;

    if (!xp || xp <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid XP amount' 
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const result = user.addXP(xp);
    await user.save();

    // Create notification if level up
    if (result.levelUp) {
      await Notification.createLevelUpNotification(req.userId, result.newLevel);
    }

    res.json({
      success: true,
      message: result.levelUp ? `Level up! Now level ${result.newLevel}` : 'XP added',
      data: {
        xpAdded: xp,
        levelUp: result.levelUp,
        newLevel: result.newLevel,
        totalXP: user.totalXP,
        currentLevel: user.level,
        reason
      }
    });
  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Update user streak
 * @route   POST /api/users/update-streak
 * @access  Private
 */
exports.updateStreak = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const oldStreak = user.streak;
    user.updateStreak();
    await user.save();

    // Create notification for milestone streaks
    if (user.streak > oldStreak && [7, 30, 100, 365].includes(user.streak)) {
      await Notification.createStreakNotification(req.userId, user.streak);
    }

    res.json({
      success: true,
      message: 'Streak updated',
      data: {
        streak: user.streak,
        longestStreak: user.longestStreak,
        increased: user.streak > oldStreak
      }
    });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Search users
 * @route   GET /api/users/search
 * @access  Public
 */
exports.searchUsers = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query must be at least 2 characters' 
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ],
      isActive: true
    })
    .select('username displayName avatar level totalXP')
    .limit(parseInt(limit));

    res.json({
      success: true,
      results: users
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
