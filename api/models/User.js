/**
 * User Model
 * Mongoose schema for user accounts
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password not required if Google login
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Profile
  displayName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  
  // Status
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: {
    type: Date
  },
  
  // Learning Progress
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  totalXP: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  lastStudyDate: {
    type: Date
  },
  
  // Preferences
  preferences: {
    dailyGoal: {
      type: Number,
      default: 20 // words per day
    },
    notifications: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    language: {
      type: String,
      enum: ['vi', 'en', 'zh'],
      default: 'vi'
    },
    soundEffects: {
      type: Boolean,
      default: true
    },
    autoPlayAudio: {
      type: Boolean,
      default: false
    }
  },
  
  // Dates
  lastLoginAt: {
    type: Date
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
  collection: 'users'
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ totalXP: -1 }); // For leaderboard
userSchema.index({ level: -1 });

// Virtual for current XP in level
userSchema.virtual('currentLevelXP').get(function() {
  const baseXP = 100;
  const previousLevelXP = baseXP * (this.level - 1) * this.level / 2;
  const nextLevelXP = baseXP * this.level * (this.level + 1) / 2;
  return {
    current: this.totalXP - previousLevelXP,
    required: nextLevelXP - previousLevelXP
  };
});

// Methods
userSchema.methods.addXP = function(xp) {
  this.totalXP += xp;
  
  // Check for level up
  const baseXP = 100;
  const nextLevelXP = baseXP * this.level * (this.level + 1) / 2;
  
  if (this.totalXP >= nextLevelXP) {
    this.level += 1;
    return { levelUp: true, newLevel: this.level };
  }
  
  return { levelUp: false };
};

userSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!this.lastStudyDate) {
    this.streak = 1;
    this.lastStudyDate = new Date();
    return;
  }
  
  const lastStudy = new Date(this.lastStudyDate);
  lastStudy.setHours(0, 0, 0, 0);
  
  const diffTime = today - lastStudy;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Already studied today
    return;
  } else if (diffDays === 1) {
    // Consecutive day
    this.streak += 1;
    if (this.streak > this.longestStreak) {
      this.longestStreak = this.streak;
    }
  } else {
    // Streak broken
    this.streak = 1;
  }
  
  this.lastStudyDate = new Date();
};

module.exports = mongoose.model('User', userSchema);
