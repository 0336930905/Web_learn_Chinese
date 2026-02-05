/**
 * Achievement Model
 * User's earned achievements and badges
 */

const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['learning', 'streak', 'test', 'social', 'special', 'milestone'],
    default: 'learning'
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  progress: {
    current: {
      type: Number,
      default: 0
    },
    target: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  isNotified: {
    type: Boolean,
    default: false
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
    badges: [String],
    unlocks: [String]
  },
  rewardsClaimed: {
    type: Boolean,
    default: false
  },
  claimedAt: {
    type: Date
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
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
  collection: 'achievements'
});

// Indexes
achievementSchema.index({ achievementId: 1 });
achievementSchema.index({ userId: 1, badgeId: 1 });
achievementSchema.index({ userId: 1, isCompleted: 1 });
achievementSchema.index({ userId: 1, category: 1 });
achievementSchema.index({ completedAt: -1 });

// Compound unique index to prevent duplicate achievements
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

// Update percentage when progress changes
achievementSchema.pre('save', function(next) {
  if (this.progress.target > 0) {
    this.progress.percentage = Math.min(
      Math.round((this.progress.current / this.progress.target) * 100),
      100
    );
  }
  
  // Auto-complete if target reached
  if (this.progress.current >= this.progress.target && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  next();
});

// Method to update progress
achievementSchema.methods.updateProgress = function(value) {
  this.progress.current = Math.min(value, this.progress.target);
  return this.save();
};

// Method to increment progress
achievementSchema.methods.incrementProgress = function(amount = 1) {
  this.progress.current = Math.min(
    this.progress.current + amount,
    this.progress.target
  );
  return this.save();
};

// Method to claim rewards
achievementSchema.methods.claimRewards = async function() {
  if (!this.isCompleted) {
    throw new Error('Achievement not completed yet');
  }
  
  if (this.rewardsClaimed) {
    throw new Error('Rewards already claimed');
  }
  
  this.rewardsClaimed = true;
  this.claimedAt = new Date();
  await this.save();
  
  return this.rewards;
};

// Static method to get user's achievements
achievementSchema.statics.getUserAchievements = async function(userId, filter = {}) {
  return this.find({ userId, ...filter }).sort({ completedAt: -1, createdAt: -1 });
};

// Static method to get achievement statistics
achievementSchema.statics.getUserStats = async function(userId) {
  const achievements = await this.find({ userId });
  
  return {
    total: achievements.length,
    completed: achievements.filter(a => a.isCompleted).length,
    inProgress: achievements.filter(a => !a.isCompleted).length,
    byCategory: achievements.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + 1;
      return acc;
    }, {}),
    byRarity: achievements.reduce((acc, a) => {
      acc[a.rarity] = (acc[a.rarity] || 0) + 1;
      return acc;
    }, {}),
    totalXP: achievements
      .filter(a => a.isCompleted && a.rewardsClaimed)
      .reduce((sum, a) => sum + (a.rewards.xp || 0), 0),
    totalCoins: achievements
      .filter(a => a.isCompleted && a.rewardsClaimed)
      .reduce((sum, a) => sum + (a.rewards.coins || 0), 0)
  };
};

module.exports = mongoose.model('Achievement', achievementSchema);
