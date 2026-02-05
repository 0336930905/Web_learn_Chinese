/**
 * TestResult Model
 * Results from completed tests
 */

const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  wordSetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WordSet',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  answers: [{
    questionIndex: Number,
    wordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Word'
    },
    userAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    timeSpent: Number, // seconds
    points: Number
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  earnedPoints: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  },
  skippedAnswers: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  isPassed: {
    type: Boolean,
    default: false
  },
  xpEarned: {
    type: Number,
    default: 0
  },
  badges: [{
    type: String
  }],
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'testresults'
});

// Indexes
testResultSchema.index({ userId: 1 });
testResultSchema.index({ testId: 1 });
testResultSchema.index({ wordSetId: 1 });
testResultSchema.index({ sessionId: 1 }, { unique: true });
testResultSchema.index({ score: -1 });
testResultSchema.index({ completedAt: -1 });

// Calculate statistics before saving
testResultSchema.pre('save', function(next) {
  // Calculate totals from answers
  this.totalQuestions = this.answers.length;
  this.correctAnswers = this.answers.filter(a => a.isCorrect).length;
  this.wrongAnswers = this.answers.filter(a => !a.isCorrect && a.userAnswer).length;
  this.skippedAnswers = this.answers.filter(a => !a.userAnswer).length;
  
  // Calculate points
  this.earnedPoints = this.answers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
  this.totalPoints = this.answers.reduce((sum, a) => sum + a.points, 0);
  
  // Calculate time
  this.timeSpent = this.answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
  
  // Calculate XP (bonus for high scores and speed)
  let xp = this.earnedPoints;
  if (this.score >= 90) xp += 50; // Perfect score bonus
  else if (this.score >= 80) xp += 30; // Excellent bonus
  else if (this.score >= 70) xp += 10; // Good bonus
  
  this.xpEarned = Math.floor(xp);
  
  next();
});

module.exports = mongoose.model('TestResult', testResultSchema);
