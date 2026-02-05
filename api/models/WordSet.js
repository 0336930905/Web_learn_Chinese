/**
 * WordSet Model
 * Collections of words grouped by topic/level
 */

const mongoose = require('mongoose');

const wordSetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  category: {
    type: String,
    enum: ['HSK', 'TOCFL', 'Daily', 'Business', 'Travel', 'Academic', 'Custom'],
    default: 'Custom'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  level: {
    type: String,
    trim: true // e.g., 'HSK 1', 'TOCFL A1'
  },
  wordIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word'
  }],
  totalWords: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    default: '#667eea'
  },
  statistics: {
    totalStudies: {
      type: Number,
      default: 0
    },
    totalCompletions: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    }
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
  collection: 'wordsets'
});

// Indexes
wordSetSchema.index({ userId: 1 });
wordSetSchema.index({ category: 1 });
wordSetSchema.index({ difficulty: 1 });
wordSetSchema.index({ isPublic: 1 });
wordSetSchema.index({ 'statistics.totalStudies': -1 });

// Update totalWords when wordIds change
wordSetSchema.pre('save', function(next) {
  this.totalWords = this.wordIds.length;
  next();
});

module.exports = mongoose.model('WordSet', wordSetSchema);
