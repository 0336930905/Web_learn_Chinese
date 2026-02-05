/**
 * Controllers Index
 * Export all controllers
 */

const authController = require('./authController');
const userController = require('./userController');
const wordController = require('./wordController');
const wordSetController = require('./wordSetController');
const progressController = require('./progressController');

module.exports = {
  authController,
  userController,
  wordController,
  wordSetController,
  progressController
};
