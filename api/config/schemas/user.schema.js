/**
 * User Schema Definition
 * Collection: users
 */

const userSchema = {
  collection: 'users',
  
  // Validation rules
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'createdAt'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'Valid email address required'
        },
        password: {
          bsonType: 'string',
          description: 'Bcrypt hashed password (optional for Google OAuth)'
        },
        username: {
          bsonType: 'string',
          description: 'Optional username (auto-generated from email)'
        },
        displayName: {
          bsonType: 'string'
        },
        avatar: {
          bsonType: 'string'
        },
        bio: {
          bsonType: 'string'
        },
        isActive: {
          bsonType: 'bool'
        },
        isVerified: {
          bsonType: 'bool'
        },
        isPremium: {
          bsonType: 'bool'
        },
        role: {
          enum: ['user', 'premium', 'admin'],
          description: 'User role'
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        },
        lastLogin: {
          bsonType: 'date'
        }
      }
    }
  },
  
  // Indexes
  indexes: [
    {
      key: { email: 1 },
      options: { unique: true, name: 'email_unique' }
    },
    {
      key: { username: 1 },
      options: { unique: true, sparse: true, name: 'username_unique' }
    },
    {
      key: { createdAt: -1 },
      options: { name: 'created_at_desc' }
    },
    {
      key: { 'stats.level': 1, points: -1 },
      options: { name: 'leaderboard_index' }
    },
    {
      key: { isActive: 1, isVerified: 1 },
      options: { name: 'active_verified' }
    }
  ],
  
  // Default document structure
  defaultDocument: {
    email: '',
    password: '',
    username: '',
    displayName: '',
    avatar: null,
    bio: '',
    isActive: true,
    isVerified: false,
    isPremium: false,
    role: 'user',
    preferences: {
      theme: 'light',
      language: 'vi',
      dailyGoal: 20,
      notifications: {
        email: true,
        push: true,
        reviewReminder: true,
        achievementAlert: true,
        weeklyReport: true
      },
      studySettings: {
        autoPlayAudio: true,
        showPinyin: true,
        showZhuyin: false,
        reviewMode: 'srs',
        cardSide: 'traditional'
      }
    },
    stats: {
      totalWords: 0,
      totalWordSets: 0,
      totalTests: 0,
      studyStreak: 0,
      longestStreak: 0,
      level: 'beginner',
      totalStudyTime: 0,
      lastStudyDate: null
    },
    points: 0,
    badges: [],
    achievements: [],
    following: [],
    followers: [],
    followersCount: 0,
    followingCount: 0,
    passwordResetToken: null,
    passwordResetExpires: null,
    emailVerificationToken: null,
    lastPasswordChange: null,
    premiumExpiry: null,
    subscriptionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: null
  }
};

module.exports = userSchema;
