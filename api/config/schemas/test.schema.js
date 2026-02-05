/**
 * Test Schema Definition
 * Collection: tests
 */

const testSchema = {
  collection: 'tests',
  
  // Validation rules
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'wordSetId', 'name', 'type', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'Reference to Users collection'
        },
        wordSetId: {
          bsonType: 'objectId',
          description: 'Reference to WordSets collection'
        },
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200,
          description: 'Test name'
        },
        description: {
          bsonType: 'string'
        },
        type: {
          enum: ['flashcard', 'multiple-choice', 'writing', 'listening', 'mixed'],
          description: 'Test type'
        },
        category: {
          bsonType: 'string'
        },
        isPublic: {
          bsonType: 'bool'
        },
        isOfficial: {
          bsonType: 'bool'
        },
        allowClone: {
          bsonType: 'bool'
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
      key: { userId: 1, createdAt: -1 },
      options: { name: 'user_created' }
    },
    {
      key: { wordSetId: 1 },
      options: { name: 'wordset_index' }
    },
    {
      key: { isPublic: 1, 'stats.rating.average': -1 },
      options: { name: 'public_rating' }
    },
    {
      key: { type: 1, category: 1 },
      options: { name: 'type_category' }
    },
    {
      key: { name: 'text', description: 'text' },
      options: { name: 'text_search' }
    }
  ],
  
  // Default document structure
  defaultDocument: {
    userId: null,
    wordSetId: null,
    name: '',
    description: '',
    coverImage: null,
    type: 'multiple-choice',
    category: 'vocabulary-test',
    settings: {
      questionCount: 20,
      includeAllWords: false,
      wordSelection: 'random',
      customWordIds: [],
      questionTypes: {
        multipleChoice: 10,
        fillInBlank: 5,
        matching: 5
      },
      timeLimit: 600,
      hasTimeLimit: true,
      passingScore: 70,
      pointsPerQuestion: 5,
      randomizeQuestions: true,
      randomizeOptions: true,
      showCorrectAnswers: true,
      showExplanations: true,
      allowReview: true,
      maxAttempts: 0,
      retakeCooldown: 0
    },
    questions: [],
    isPublic: false,
    isOfficial: false,
    allowClone: true,
    stats: {
      totalAttempts: 0,
      averageScore: 0,
      passRate: 0,
      cloneCount: 0,
      rating: {
        average: 0,
        count: 0
      }
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: null
  }
};

module.exports = testSchema;
