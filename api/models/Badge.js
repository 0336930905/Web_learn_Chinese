/**
 * Badge Model
 * Collectible badges/achievements for users
 */

const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  badgeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['learning', 'streak', 'test', 'social', 'special', 'milestone'],
    default: 'learning'
  },
  icon: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: '#FFD700'
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 10
  },
  criteria: {
    type: {
      type: String,
      enum: ['words_learned', 'study_streak', 'mastery_level', 'accuracy', 'practice_sessions', 'perfect_score', 'tests_passed', 'streak_days', 'study_hours', 'perfect_scores', 'custom'],
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    count: Number,
    description: String
  },
  rewards: {
    xp: {
      type: Number,
      default: 0
    },
    coins: {
      type: Number,
      default: 0
    },
    unlocks: [String]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSecret: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  statistics: {
    totalEarned: {
      type: Number,
      default: 0
    },
    earnedByUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
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
  collection: 'badges'
});

// Indexes
badgeSchema.index({ badgeId: 1 }, { unique: true });
badgeSchema.index({ category: 1 });
badgeSchema.index({ rarity: 1 });
badgeSchema.index({ isActive: 1 });
badgeSchema.index({ displayOrder: 1 });

// Check if user meets criteria for this badge
badgeSchema.methods.checkEligibility = function(userStats) {
  const { type, target } = this.criteria;
  
  switch (type) {
    case 'words_learned':
      return userStats.totalWordsLearned >= target;
    case 'tests_passed':
      return userStats.totalTestsPassed >= target;
    case 'streak_days':
      return userStats.currentStreak >= target;
    case 'study_hours':
      return userStats.totalStudyTime / 60 >= target;
    case 'perfect_scores':
      return userStats.perfectScores >= target;
    default:
      return false;
  }
};

module.exports = mongoose.model('Badge', badgeSchema);
