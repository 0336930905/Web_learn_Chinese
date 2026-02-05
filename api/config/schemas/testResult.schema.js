/**
 * TestResult Schema Definition
 * Collection: testresults
 */

const testResultSchema = {
  collection: 'testresults',
  
  // Validation rules
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'testId', 'wordSetId', 'sessionId', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'Reference to Users collection'
        },
        testId: {
          bsonType: 'objectId',
          description: 'Reference to Tests collection'
        },
        wordSetId: {
          bsonType: 'objectId',
          description: 'Reference to WordSets collection'
        },
        sessionId: {
          bsonType: 'string',
          description: 'Unique session identifier'
        },
        attemptNumber: {
          bsonType: 'int',
          minimum: 1
        },
        score: {
          bsonType: 'int',
          minimum: 0,
          maximum: 100,
          description: 'Score percentage'
        },
        pointsEarned: {
          bsonType: 'int',
          minimum: 0
        },
        totalPoints: {
          bsonType: 'int',
          minimum: 0
        },
        totalQuestions: {
          bsonType: 'int',
          minimum: 0
        },
        correctAnswers: {
          bsonType: 'int',
          minimum: 0
        },
        incorrectAnswers: {
          bsonType: 'int',
          minimum: 0
        },
        skippedAnswers: {
          bsonType: 'int',
          minimum: 0
        },
        timeLimit: {
          bsonType: 'int',
          minimum: 0
        },
        timeSpent: {
          bsonType: 'int',
          minimum: 0
        },
        passed: {
          bsonType: 'bool'
        },
        passingScore: {
          bsonType: 'int',
          minimum: 0,
          maximum: 100
        },
        startedAt: {
          bsonType: 'date'
        },
        completedAt: {
          bsonType: 'date'
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  },
  
  // Indexes
  indexes: [
    {
      key: { userId: 1, completedAt: -1 },
      options: { name: 'user_completed' }
    },
    {
      key: { testId: 1, score: -1 },
      options: { name: 'test_score' }
    },
    {
      key: { userId: 1, testId: 1, attemptNumber: 1 },
      options: { name: 'user_test_attempt' }
    },
    {
      key: { wordSetId: 1 },
      options: { name: 'wordset_index' }
    },
    {
      key: { passed: 1, score: -1 },
      options: { name: 'passed_score' }
    }
  ],
  
  // Default document structure
  defaultDocument: {
    userId: null,
    testId: null,
    wordSetId: null,
    sessionId: '',
    attemptNumber: 1,
    score: 0,
    pointsEarned: 0,
    totalPoints: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    skippedAnswers: 0,
    timeLimit: 0,
    timeSpent: 0,
    timeRemaining: 0,
    passed: false,
    passingScore: 70,
    answers: [],
    analysis: {
      strengths: [],
      weaknesses: [],
      weakWordIds: [],
      averageTimePerQuestion: 0,
      accuracyByDifficulty: {}
    },
    rewards: {
      pointsEarned: 0,
      badgesEarned: [],
      achievementsProgress: []
    },
    startedAt: new Date(),
    completedAt: new Date(),
    createdAt: new Date()
  }
};

module.exports = testResultSchema;
