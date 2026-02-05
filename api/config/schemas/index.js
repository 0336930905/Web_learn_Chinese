/**
 * Export all schema definitions
 */

const userSchema = require('./user.schema');
const wordSetSchema = require('./wordSet.schema');
const wordSchema = require('./word.schema');
const progressSchema = require('./progress.schema');
const testSchema = require('./test.schema');
const testResultSchema = require('./testResult.schema');
const userStatsSchema = require('./userStats.schema');

module.exports = {
  userSchema,
  wordSetSchema,
  wordSchema,
  progressSchema,
  testSchema,
  testResultSchema,
  userStatsSchema,
  
  // Helper function to get all schemas
  getAllSchemas: () => [
    userSchema,
    wordSetSchema,
    wordSchema,
    progressSchema,
    testSchema,
    testResultSchema,
    userStatsSchema
  ],
  
  // Get schema by collection name
  getSchemaByCollection: (collectionName) => {
    const schemas = {
      'users': userSchema,
      'wordsets': wordSetSchema,
      'words': wordSchema,
      'progress': progressSchema,
      'tests': testSchema,
      'testresults': testResultSchema,
      'userstats': userStatsSchema
    };
    return schemas[collectionName] || null;
  }
};
