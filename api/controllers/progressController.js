/**
 * Progress Controller
 * Handle user learning progress
 */

const Progress = require('../models/Progress');
const UserStats = require('../models/UserStats');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * @desc    Get user progress
 * @route   GET /api/progress
 * @access  Private
 */
exports.getProgress = async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.userId })
      .populate('learnedWords.wordId');

    if (!progress) {
      // Create new progress if doesn't exist
      progress = await Progress.create({ userId: req.userId });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Update word progress
 * @route   POST /api/progress/word
 * @access  Private
 */
exports.updateWordProgress = async (req, res) => {
  try {
    const { wordId, isCorrect, timeSpent } = req.body;

    let progress = await Progress.findOne({ userId: req.userId });

    if (!progress) {
      progress = await Progress.create({ userId: req.userId });
    }

    // Find word in learned words
    const wordIndex = progress.learnedWords.findIndex(
      w => w.wordId.toString() === wordId
    );

    if (wordIndex >= 0) {
      // Update existing word progress
      const word = progress.learnedWords[wordIndex];
      word.reviewCount += 1;
      word.lastReviewed = new Date();
      
      // Update mastery level
      if (isCorrect) {
        word.masteryLevel = Math.min(word.masteryLevel + 10, 100);
      } else {
        word.masteryLevel = Math.max(word.masteryLevel - 5, 0);
      }
    } else {
      // Add new word
      progress.learnedWords.push({
        wordId,
        masteryLevel: isCorrect ? 10 : 0,
        lastReviewed: new Date(),
        reviewCount: 1
      });
      progress.totalWordsLearned += 1;
    }

    await progress.save();

    // Update user stats
    await updateDailyStats(req.userId, {
      wordsReviewed: 1,
      correctAnswers: isCorrect ? 1 : 0,
      wrongAnswers: isCorrect ? 0 : 1,
      studyTime: timeSpent || 0
    });

    res.json({
      success: true,
      message: 'Progress updated',
      data: progress
    });
  } catch (error) {
    console.error('Update word progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * @desc    Get learning statistics
 * @route   GET /api/progress/stats
 * @access  Private
 */
exports.getStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    const stats = await UserStats.find({
      userId: req.userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    // Get progress
    const progress = await Progress.findOne({ userId: req.userId });

    res.json({
      success: true,
      data: {
        stats,
        summary: {
          totalWordsLearned: progress?.totalWordsLearned || 0,
          studyStreak: progress?.studyStreak || 0,
          totalStudyTime: stats.reduce((sum, s) => sum + s.studyTime, 0),
          averageAccuracy: calculateAverageAccuracy(stats)
        }
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
 * @desc    Get words needing review (spaced repetition)
 * @route   GET /api/progress/review
 * @access  Private
 */
exports.getWordsForReview = async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.userId })
      .populate('learnedWords.wordId');

    if (!progress) {
      return res.json({
        success: true,
        data: []
      });
    }

    const now = new Date();
    
    // Calculate which words need review based on SRS algorithm
    const wordsForReview = progress.learnedWords.filter(word => {
      const daysSinceReview = Math.floor(
        (now - new Date(word.lastReviewed)) / (1000 * 60 * 60 * 24)
      );
      
      // Simple SRS: review interval increases with mastery
      const reviewInterval = Math.floor(word.masteryLevel / 10);
      return daysSinceReview >= reviewInterval;
    }).sort((a, b) => a.lastReviewed - b.lastReviewed);

    res.json({
      success: true,
      data: wordsForReview.slice(0, 20) // Limit to 20 words per session
    });
  } catch (error) {
    console.error('Get review words error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

/**
 * Helper: Update daily stats
 */
async function updateDailyStats(userId, updates) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await UserStats.findOneAndUpdate(
    {
      userId,
      date: today
    },
    {
      $inc: {
        wordsReviewed: updates.wordsReviewed || 0,
        correctAnswers: updates.correctAnswers || 0,
        wrongAnswers: updates.wrongAnswers || 0,
        studyTime: Math.floor((updates.studyTime || 0) / 60) // Convert to minutes
      },
      $setOnInsert: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        week: getWeekNumber(today),
        dayOfWeek: today.getDay()
      }
    },
    {
      upsert: true,
      new: true
    }
  );

  return stats;
}

/**
 * Helper: Get week number
 */
function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Helper: Calculate average accuracy
 */
function calculateAverageAccuracy(stats) {
  if (stats.length === 0) return 0;
  const totalAccuracy = stats.reduce((sum, s) => sum + (s.accuracy || 0), 0);
  return Math.round(totalAccuracy / stats.length);
}

/**
 * @desc    Save practice session results
 * @route   POST /api/progress/practice
 * @access  Private
 */
exports.savePracticeSession = async (req, res) => {
  try {
    const { 
      mode,           // listening, memory, quiz
      category,       // category slug
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      timeSpent,      // in seconds
      answers         // array of {wordId, correct}
    } = req.body;

    // Validate data
    if (!mode || !totalQuestions) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate accuracy
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    // Update user stats for today
    await updateDailyStats(req.userId, {
      wordsReviewed: totalQuestions,
      correctAnswers: correctAnswers || 0,
      wrongAnswers: wrongAnswers || 0,
      studyTime: timeSpent || 0
    });

    // Update progress for each word
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) {
      progress = await Progress.create({ userId: req.userId });
    }

    // Process each answer
    if (answers && Array.isArray(answers)) {
      for (const answer of answers) {
        const wordIndex = progress.learnedWords.findIndex(
          w => w.wordId.toString() === answer.wordId
        );

        if (wordIndex >= 0) {
          // Update existing word
          const word = progress.learnedWords[wordIndex];
          word.reviewCount += 1;
          word.lastReviewed = new Date();
          
          if (answer.correct) {
            word.masteryLevel = Math.min(word.masteryLevel + 10, 100);
          } else {
            word.masteryLevel = Math.max(word.masteryLevel - 5, 0);
          }
        } else {
          // Add new word
          progress.learnedWords.push({
            wordId: answer.wordId,
            masteryLevel: answer.correct ? 10 : 0,
            lastReviewed: new Date(),
            reviewCount: 1
          });
          progress.totalWordsLearned += 1;
        }
      }

      await progress.save();
    }

    // Update study streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastStudy = progress.lastStudyDate ? new Date(progress.lastStudyDate) : null;
    
    const previousStreak = progress.studyStreak;
    if (lastStudy) {
      lastStudy.setHours(0, 0, 0, 0);
      const dayDiff = Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        progress.studyStreak += 1;
      } else if (dayDiff > 1) {
        progress.studyStreak = 1;
      }
    } else {
      progress.studyStreak = 1;
    }
    
    progress.lastStudyDate = today;
    await progress.save();

    // Create streak notification if streak increased
    if (progress.studyStreak > previousStreak && progress.studyStreak >= 3) {
      try {
        await Notification.createStreakNotification(req.userId, progress.studyStreak);
      } catch (notifError) {
        console.error('Failed to create streak notification:', notifError);
      }
    }

    // Auto-check for new achievements
    let newAchievements = [];
    try {
      const achievementController = require('./achievementController');
      const mockReq = { userId: req.userId };
      const mockRes = {
        json: (result) => {
          if (result.success && result.data.newAchievements) {
            newAchievements = result.data.newAchievements;
          }
        },
        status: () => mockRes
      };
      await achievementController.checkAndAwardAchievements(mockReq, mockRes);
    } catch (error) {
      console.error('Achievement check error:', error);
    }

    res.json({
      success: true,
      message: 'Practice session saved successfully',
      data: {
        accuracy,
        studyStreak: progress.studyStreak,
        totalWordsLearned: progress.totalWordsLearned,
        newAchievements: newAchievements.map(a => ({
          name: a.name,
          description: a.description,
          icon: a.icon,
          rarity: a.rarity
        }))
      }
    });

  } catch (error) {
    console.error('Save practice session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = exports;
