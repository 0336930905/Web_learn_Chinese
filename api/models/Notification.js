/**
 * Notification Model
 * User notifications and alerts
 */

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'achievement',
      'badge',
      'level_up',
      'streak',
      'test_result',
      'reminder',
      'social',
      'system',
      'promotion'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#667eea'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  actionUrl: {
    type: String,
    trim: true
  },
  actionLabel: {
    type: String,
    trim: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  expiresAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'notifications'
});

// Indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
notificationSchema.index({ createdAt: -1 });

// Mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ userId, isRead: false });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = async function(userId) {
  return this.updateMany(
    { userId, isRead: false },
    { 
      $set: { 
        isRead: true, 
        readAt: new Date() 
      } 
    }
  );
};

// Static method to get recent notifications
notificationSchema.statics.getRecent = async function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to create achievement notification
notificationSchema.statics.createAchievementNotification = async function(userId, achievement) {
  return this.create({
    userId,
    type: 'achievement',
    title: '🎉 Achievement Unlocked!',
    message: `You've earned "${achievement.name}"!`,
    icon: achievement.icon || '🏆',
    color: '#FFD700',
    priority: 'high',
    actionUrl: '/achievements',
    actionLabel: 'View Achievements',
    metadata: {
      achievementId: achievement._id,
      badgeId: achievement.badgeId
    }
  });
};

// Static method to create level up notification
notificationSchema.statics.createLevelUpNotification = async function(userId, newLevel) {
  return this.create({
    userId,
    type: 'level_up',
    title: '⬆️ Level Up!',
    message: `Congratulations! You've reached Level ${newLevel}!`,
    icon: '⭐',
    color: '#667eea',
    priority: 'high',
    actionUrl: '/profile',
    actionLabel: 'View Profile',
    metadata: {
      level: newLevel
    }
  });
};

// Static method to create streak notification
notificationSchema.statics.createStreakNotification = async function(userId, streak) {
  const messages = {
    7: `🔥 One week streak! Keep it up!`,
    30: `🔥 30-day streak! You're on fire!`,
    100: `🔥 100-day streak! Incredible dedication!`,
    365: `🔥 One year streak! You're a legend!`
  };
  
  const message = messages[streak] || `🔥 ${streak}-day streak! Amazing!`;
  
  return this.create({
    userId,
    type: 'streak',
    title: 'Streak Milestone',
    message,
    icon: '🔥',
    color: '#FF6B6B',
    priority: 'high',
    actionUrl: '/profile',
    actionLabel: 'View Stats',
    metadata: {
      streak
    }
  });
};

// Static method to create reminder notification
notificationSchema.statics.createReminderNotification = async function(userId, reminderText) {
  return this.create({
    userId,
    type: 'reminder',
    title: '📚 Study Reminder',
    message: reminderText || 'Time to practice your Taiwanese!',
    icon: '⏰',
    color: '#4ECDC4',
    priority: 'medium',
    actionUrl: '/',
    actionLabel: 'Start Learning',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  });
};

module.exports = mongoose.model('Notification', notificationSchema);
