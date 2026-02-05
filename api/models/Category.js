/**
 * Category Model
 * Simple categories for organizing words
 */

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  icon: {
    type: String,
    default: '📁'
  },
  color: {
    type: String,
    default: '#667eea'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isSystem: {
    type: Boolean,
    default: false,
    description: 'System categories cannot be deleted'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  collection: 'categories'
});

// Compound index for user + slug uniqueness
categorySchema.index({ userId: 1, slug: 1 }, { unique: true });

// Virtual for word count
categorySchema.virtual('wordCount', {
  ref: 'Word',
  localField: 'slug',
  foreignField: 'category',
  count: true
});

// Include virtuals in JSON
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);
