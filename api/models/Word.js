const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  // User who created this word
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // Word is public or private
  isPublic: {
    type: Boolean,
    default: false
  },
  traditional: {
    type: String,
    required: true,
    trim: true
  },
  simplified: {
    type: String,
    trim: true
  },
  pinyin: {
    type: String,
    required: true,
    trim: true
  },
  zhuyin: {
    type: String,
    trim: true,
    description: 'Bopomofo/注音符號 - Taiwanese phonetic system'
  },
  vietnamese: {
    type: String,
    required: true,
    trim: true
  },
  english: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'other',
    index: true,
    description: 'Category slug from Category model'
  },
  examples: [{
    traditional: String,
    pinyin: String,
    vietnamese: String,
    english: String
  }],
  audioUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true,
    description: 'Image URL for visual learning'
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 1
  },
  tags: [String]
}, {
  timestamps: true
});

// Index for search
wordSchema.index({ traditional: 1, pinyin: 1, vietnamese: 1 });
wordSchema.index({ createdBy: 1, category: 1 });
wordSchema.index({ createdBy: 1, difficulty: 1 });

module.exports = mongoose.model('Word', wordSchema);
