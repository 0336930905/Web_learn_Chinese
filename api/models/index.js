/**
 * Models Index
 * Export all Mongoose models
 */

const User = require('./User');
const Word = require('./Word');
const WordSet = require('./WordSet');
const Progress = require('./Progress');
const Test = require('./Test');
const TestResult = require('./TestResult');
const UserStats = require('./UserStats');
const Badge = require('./Badge');
const Achievement = require('./Achievement');
const Notification = require('./Notification');

module.exports = {
  User,
  Word,
  WordSet,
  Progress,
  Test,
  TestResult,
  UserStats,
  Badge,
  Achievement,
  Notification
};
