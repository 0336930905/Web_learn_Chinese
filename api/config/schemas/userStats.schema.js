/**
 * UserStats Schema Definition
 * Collection: userstats
 */

const userStatsSchema = {
  collection: 'userstats',
  
  // Validation rules
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'date', 'year', 'month', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'Reference to Users collection'
        },
        date: {
          bsonType: 'date',
          description: 'Start of day UTC'
        },
        year: {
          bsonType: 'int',
          minimum: 2020,
          maximum: 2100
        },
        month: {
          bsonType: 'int',
          minimum: 1,
          maximum: 12
        },
        week: {
          bsonType: 'int',
          minimum: 1,
          maximum: 53
        },
        dayOfWeek: {
          bsonType: 'int',
          minimum: 0,
          maximum: 6
        },
        createdAt: {
          bsonType: 'date'
        },
        updatedAt: {
          bsonType: 'date'
        }
      }
    }
  },
  
  // Indexes
  indexes: [
    {
      key: { userId: 1, date: -1 },
      options: { unique: true, name: 'user_date_unique' }
    },
    {
      key: { userId: 1, year: 1, month: 1 },
      options: { name: 'user_year_month' }
    },
    {
      key: { userId: 1, year: 1, week: 1 },
      options: { name: 'user_year_week' }
    },
    {
      key: { date: -1 },
      options: { name: 'date_index' }
    }
  ],
  
  // Default document structure
  defaultDocument: {
    userId: null,
    date: new Date(),
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    week: 1,
    dayOfWeek: new Date().getDay(),
    daily: {
      wordsLearned: 0,
      wordsReviewed: 0,
      wordsMastered: 0,
      flashcardsSeen: 0,
      flashcardsCorrect: 0,
      flashcardsIncorrect: 0,
      testsStarted: 0,
      testsCompleted: 0,
      testsPassed: 0,
      testsFailed: 0,
      averageTestScore: 0,
      studyTime: 0,
      sessionCount: 0,
      averageSessionTime: 0,
      studyStreak: 0,
      isStudyDay: false,
      pointsEarned: 0,
      badgesEarned: [],
      achievementsCompleted: []
    },
    cumulative: {
      totalWords: 0,
      totalWordSets: 0,
      totalTests: 0,
      totalStudyTime: 0,
      totalPoints: 0,
      currentLevel: 'beginner',
      masteredWords: 0,
      learningWords: 0,
      newWords: 0,
      overallAccuracy: 0,
      averageTestScore: 0
    },
    hourlyActivity: [],
    wordSetStats: [],
    categoryStats: {},
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

module.exports = userStatsSchema;
