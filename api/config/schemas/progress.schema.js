/**
 * Progress Schema Definition
 * Collection: progress
 */

const progressSchema = {
  collection: 'progress',
  
  // Validation rules
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'wordId', 'wordSetId', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'Reference to Users collection'
        },
        wordId: {
          bsonType: 'objectId',
          description: 'Reference to Words collection'
        },
        wordSetId: {
          bsonType: 'objectId',
          description: 'Reference to WordSets collection'
        },
        masteryLevel: {
          bsonType: 'int',
          minimum: 0,
          maximum: 100,
          description: 'Mastery percentage'
        },
        status: {
          enum: ['new', 'learning', 'reviewing', 'mastered', 'forgotten'],
          description: 'Learning status'
        },
        reviewCount: {
          bsonType: 'int',
          minimum: 0
        },
        correctCount: {
          bsonType: 'int',
          minimum: 0
        },
        incorrectCount: {
          bsonType: 'int',
          minimum: 0
        },
        consecutiveCorrect: {
          bsonType: 'int',
          minimum: 0
        },
        consecutiveIncorrect: {
          bsonType: 'int',
          minimum: 0
        },
        totalTimeSpent: {
          bsonType: 'int',
          minimum: 0,
          description: 'Time in seconds'
        },
        averageResponseTime: {
          bsonType: 'int',
          minimum: 0
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
      key: { userId: 1, wordSetId: 1 },
      options: { name: 'user_wordset' }
    },
    {
      key: { userId: 1, wordId: 1 },
      options: { unique: true, name: 'user_word_unique' }
    },
    {
      key: { userId: 1, 'srs.nextReview': 1 },
      options: { name: 'due_words' }
    },
    {
      key: { userId: 1, status: 1 },
      options: { name: 'user_status' }
    },
    {
      key: { userId: 1, masteryLevel: -1 },
      options: { name: 'weak_words' }
    }
  ],
  
  // Default document structure
  defaultDocument: {
    userId: null,
    wordId: null,
    wordSetId: null,
    masteryLevel: 0,
    status: 'new',
    reviewCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,
    srs: {
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      lastInterval: 0,
      lastReviewed: null,
      nextReview: new Date(),
      box: 1,
      boxHistory: []
    },
    totalTimeSpent: 0,
    averageResponseTime: 0,
    reviewHistory: [],
    stages: {
      firstSeen: new Date(),
      firstCorrect: null,
      masteredAt: null
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

module.exports = progressSchema;
