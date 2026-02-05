/**
 * Achievement Controller
 * Handle user achievements and badges
 */

const Achievement = require('../models/Achievement');
const Badge = require('../models/Badge');
const Progress = require('../models/Progress');
const UserStats = require('../models/UserStats');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * @desc    Check and award achievements based on user progress
 * @route   POST /api/achievements/check
 * @access  Private
 */
exports.checkAndAwardAchievements = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user data
    const progress = await Progress.findOne({ userId });
    const user = await User.findById(userId);
    
    if (!progress) {
      return res.json({
        success: true,
        data: { newAchievements: [] }
      });
    }

    // Get all available badges
    const allBadges = await Badge.find({ isActive: true });
    
    // Get user's current achievements
    const userAchievements = await Achievement.find({ userId });
    const earnedBadgeIds = userAchievements.map(a => a.badgeId);
    
    const newAchievements = [];

    // Check each badge criteria
    for (const badge of allBadges) {
      // Skip if already earned
      if (earnedBadgeIds.includes(badge.badgeId)) continue;

      let earned = false;

      // Check criteria based on badge type
      switch (badge.criteria.type) {
        case 'words_learned':
          earned = progress.totalWordsLearned >= badge.criteria.target;
          break;
          
        case 'study_streak':
          earned = progress.studyStreak >= badge.criteria.target;
          break;
          
        case 'mastery_level':
          const masteredWords = progress.learnedWords.filter(
            w => w.masteryLevel >= badge.criteria.target
          ).length;
          earned = masteredWords >= (badge.criteria.count || 1);
          break;
          
        case 'accuracy':
          // Get recent stats
          const recentStats = await UserStats.find({
            userId,
            date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          });
          
          if (recentStats.length > 0) {
            const avgAccuracy = recentStats.reduce((sum, s) => {
              const total = s.correctAnswers + s.wrongAnswers;
              return sum + (total > 0 ? (s.correctAnswers / total) * 100 : 0);
            }, 0) / recentStats.length;
            
            earned = avgAccuracy >= badge.criteria.target;
          }
          break;
          
        case 'practice_sessions':
          const statsCount = await UserStats.countDocuments({
            userId,
            sessionsCompleted: { $gt: 0 }
          });
          earned = statsCount >= badge.criteria.target;
          break;
          
        case 'perfect_score':
          const perfectSessions = await UserStats.countDocuments({
            userId,
            accuracy: 100
          });
          earned = perfectSessions >= badge.criteria.target;
          break;
      }

      if (earned) {
        // Award achievement
        const achievement = await Achievement.create({
          achievementId: `${userId}_${badge.badgeId}_${Date.now()}`,
          userId,
          badgeId: badge.badgeId,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          category: badge.category,
          rarity: badge.rarity,
          progress: {
            current: badge.criteria.target,
            target: badge.criteria.target,
            percentage: 100
          },
          earnedAt: new Date(),
          isUnlocked: true
        });

        // Update user points
        if (user) {
          user.totalPoints = (user.totalPoints || 0) + badge.points;
          await user.save();
        }

        // Create notification for the achievement
        try {
          await Notification.createAchievementNotification(userId, {
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            points: badge.points,
            rarity: badge.rarity
          });
        } catch (notifError) {
          console.error('Failed to create achievement notification:', notifError);
          // Don't fail achievement award if notification fails
        }

        newAchievements.push(achievement);
      }
    }

    res.json({
      success: true,
      data: {
        newAchievements,
        message: newAchievements.length > 0 
          ? `Chúc mừng! Bạn đã đạt được ${newAchievements.length} thành tích mới!`
          : 'Tiếp tục cố gắng để mở khóa thành tích!'
      }
    });

  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get user achievements
 * @route   GET /api/achievements
 * @access  Private
 */
exports.getUserAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ 
      userId: req.userId,
      isUnlocked: true 
    }).sort({ earnedAt: -1 });

    // Get available badges not yet earned
    const earnedBadgeIds = achievements.map(a => a.badgeId);
    const availableBadges = await Badge.find({
      badgeId: { $nin: earnedBadgeIds },
      isActive: true
    });

    res.json({
      success: true,
      data: {
        earned: achievements,
        available: availableBadges,
        totalEarned: achievements.length,
        totalAvailable: availableBadges.length
      }
    });

  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get all available badges
 * @route   GET /api/achievements/badges
 * @access  Private
 */
exports.getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true })
      .sort({ rarity: 1, points: 1 });

    res.json({
      success: true,
      data: badges
    });

  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get achievement progress
 * @route   GET /api/achievements/progress
 * @access  Private
 */
exports.getAchievementProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await Progress.findOne({ userId });
    const badges = await Badge.find({ isActive: true });
    const userAchievements = await Achievement.find({ userId });
    
    const earnedBadgeIds = userAchievements.map(a => a.badgeId);
    
    // Calculate progress for each badge
    const badgeProgress = [];
    
    for (const badge of badges) {
      const isEarned = earnedBadgeIds.includes(badge.badgeId);
      let currentProgress = 0;
      
      if (!isEarned && progress) {
        switch (badge.criteria.type) {
          case 'words_learned':
            currentProgress = progress.totalWordsLearned;
            break;
          case 'study_streak':
            currentProgress = progress.studyStreak;
            break;
          case 'mastery_level':
            currentProgress = progress.learnedWords.filter(
              w => w.masteryLevel >= badge.criteria.target
            ).length;
            break;
          case 'practice_sessions':
            currentProgress = await UserStats.countDocuments({
              userId,
              sessionsCompleted: { $gt: 0 }
            });
            break;
        }
      }
      
      badgeProgress.push({
        badge,
        isEarned,
        progress: {
          current: isEarned ? badge.criteria.target : currentProgress,
          target: badge.criteria.target,
          percentage: isEarned ? 100 : Math.min(
            Math.round((currentProgress / badge.criteria.target) * 100),
            100
          )
        }
      });
    }

    res.json({
      success: true,
      data: badgeProgress
    });

  } catch (error) {
    console.error('Get achievement progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get user statistics summary
 * @route   GET /api/achievements/stats-summary
 * @access  Private
 */
exports.getStatsSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const progress = await Progress.findOne({ userId });
    const user = await User.findById(userId);
    
    // Get stats for different periods
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    
    const weekStats = await UserStats.find({
      userId,
      date: { $gte: weekAgo }
    });
    
    const monthStats = await UserStats.find({
      userId,
      date: { $gte: monthAgo }
    });
    
    // Calculate mastery levels
    const masteryLevels = {
      beginner: 0,    // 0-25
      intermediate: 0, // 26-50
      advanced: 0,     // 51-75
      expert: 0        // 76-100
    };
    
    if (progress) {
      progress.learnedWords.forEach(word => {
        const level = word.masteryLevel;
        if (level <= 25) masteryLevels.beginner++;
        else if (level <= 50) masteryLevels.intermediate++;
        else if (level <= 75) masteryLevels.advanced++;
        else masteryLevels.expert++;
      });
    }
    
    // Calculate weekly accuracy
    const weekAccuracy = weekStats.length > 0
      ? weekStats.reduce((sum, s) => {
          const total = s.correctAnswers + s.wrongAnswers;
          return sum + (total > 0 ? (s.correctAnswers / total) * 100 : 0);
        }, 0) / weekStats.length
      : 0;
    
    const summary = {
      // Overall stats
      totalWordsLearned: progress?.totalWordsLearned || 0,
      studyStreak: progress?.studyStreak || 0,
      totalPoints: user?.totalPoints || 0,
      level: user?.level || 1,
      
      // Mastery distribution
      masteryLevels,
      
      // Weekly performance
      weeklyStats: {
        studyDays: weekStats.length,
        totalStudyTime: weekStats.reduce((sum, s) => sum + s.studyTime, 0),
        totalWords: weekStats.reduce((sum, s) => sum + s.wordsReviewed, 0),
        accuracy: Math.round(weekAccuracy)
      },
      
      // Monthly performance
      monthlyStats: {
        studyDays: monthStats.length,
        totalStudyTime: monthStats.reduce((sum, s) => sum + s.studyTime, 0),
        totalWords: monthStats.reduce((sum, s) => sum + s.wordsReviewed, 0)
      },
      
      // Achievements
      totalAchievements: await Achievement.countDocuments({ 
        userId, 
        isUnlocked: true 
      })
    };

    res.json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Get stats summary error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

module.exports = exports;
