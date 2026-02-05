/**
 * Test Model
 * Quiz/test sessions for word sets
 */

const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wordSetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WordSet',
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
  type: {
    type: String,
    enum: ['multiple-choice', 'flashcard', 'typing', 'listening', 'mixed'],
    default: 'multiple-choice'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questions: [{
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Word'
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'flashcard', 'typing', 'listening']
    },
    question: String,
    options: [String],
    correctAnswer: String,
    points: {
      type: Number,
      default: 10
    }
  }],
  totalQuestions: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number, // in seconds, 0 = no limit
    default: 0
  },
  passingScore: {
    type: Number,
    default: 70 // percentage
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    highestScore: {
      type: Number,
      default: 0
    },
    passRate: {
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
  collection: 'tests'
});

// Indexes
testSchema.index({ userId: 1 });
testSchema.index({ wordSetId: 1 });
testSchema.index({ type: 1 });
testSchema.index({ isActive: 1 });
testSchema.index({ isPublic: 1 });

// Update totals when questions change
testSchema.pre('save', function(next) {
  this.totalQuestions = this.questions.length;
  this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 10), 0);
  next();
});

module.exports = mongoose.model('Test', testSchema);
