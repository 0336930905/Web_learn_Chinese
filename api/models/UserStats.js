/**
 * UserStats Model
 * Daily/weekly/monthly statistics for users
 */

const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  week: {
    type: Number,
    required: true,
    min: 1,
    max: 53
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6 // 0 = Sunday
  },
  
  // Study metrics
  wordsLearned: {
    type: Number,
    default: 0
  },
  wordsReviewed: {
    type: Number,
    default: 0
  },
  studyTime: {
    type: Number, // in minutes
    default: 0
  },
  sessionsCompleted: {
    type: Number,
    default: 0
  },
  
  // Test metrics
  testsCompleted: {
    type: Number,
    default: 0
  },
  testsPassed: {
    type: Number,
    default: 0
  },
  averageTestScore: {
    type: Number,
    default: 0
  },
  totalTestPoints: {
    type: Number,
    default: 0
  },
  
  // Progress metrics
  xpEarned: {
    type: Number,
    default: 0
  },
  levelsGained: {
    type: Number,
    default: 0
  },
  streakMaintained: {
    type: Boolean,
    default: false
  },
  dailyGoalAchieved: {
    type: Boolean,
    default: false
  },
  
  // Accuracy metrics
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number, // percentage
    default: 0
  },
  
  // Achievements
  badgesEarned: [{
    type: String
  }],
  achievementsUnlocked: [{
    type: String
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'userstats'
});

// Indexes
userStatsSchema.index({ userId: 1, date: -1 });
userStatsSchema.index({ userId: 1, year: 1, month: 1 });
userStatsSchema.index({ userId: 1, year: 1, week: 1 });
userStatsSchema.index({ year: 1, month: 1, week: 1 });

// Compound unique index to prevent duplicate stats for same user/date
userStatsSchema.index({ userId: 1, date: 1 }, { unique: true });

// Calculate accuracy before saving
userStatsSchema.pre('save', function(next) {
  const total = this.correctAnswers + this.wrongAnswers;
  if (total > 0) {
    this.accuracy = Math.round((this.correctAnswers / total) * 100);
  }
  next();
});

// Static method to get user stats for a date range
userStatsSchema.statics.getStatsForPeriod = async function(userId, startDate, endDate) {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 });
};

// Static method to aggregate weekly stats
userStatsSchema.statics.getWeeklyStats = async function(userId, year, week) {
  return this.aggregate([
    {
      $match: { userId: mongoose.Types.ObjectId(userId), year, week }
    },
    {
      $group: {
        _id: null,
        totalWordsLearned: { $sum: '$wordsLearned' },
        totalWordsReviewed: { $sum: '$wordsReviewed' },
        totalStudyTime: { $sum: '$studyTime' },
        totalXP: { $sum: '$xpEarned' },
        testsCompleted: { $sum: '$testsCompleted' },
        averageAccuracy: { $avg: '$accuracy' }
      }
    }
  ]);
};

// Static method to aggregate monthly stats
userStatsSchema.statics.getMonthlyStats = async function(userId, year, month) {
  return this.aggregate([
    {
      $match: { userId: mongoose.Types.ObjectId(userId), year, month }
    },
    {
      $group: {
        _id: null,
        totalWordsLearned: { $sum: '$wordsLearned' },
        totalWordsReviewed: { $sum: '$wordsReviewed' },
        totalStudyTime: { $sum: '$studyTime' },
        totalXP: { $sum: '$xpEarned' },
        testsCompleted: { $sum: '$testsCompleted' },
        averageAccuracy: { $avg: '$accuracy' },
        daysStudied: { $sum: { $cond: [{ $gt: ['$studyTime', 0] }, 1, 0] } }
      }
    }
  ]);
};

module.exports = mongoose.model('UserStats', userStatsSchema);
