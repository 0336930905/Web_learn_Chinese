const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    default: 'default-user' // For now, using a default user
  },
  learnedWords: [{
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Word'
    },
    masteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    lastReviewed: {
      type: Date,
      default: Date.now
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  }],
  totalWordsLearned: {
    type: Number,
    default: 0
  },
  studyStreak: {
    type: Number,
    default: 0
  },
  lastStudyDate: {
    type: Date
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  statistics: {
    totalStudyTime: {
      type: Number,
      default: 0 // in minutes
    },
    wordsPerCategory: {
      type: Map,
      of: Number,
      default: new Map()
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Progress', progressSchema);
