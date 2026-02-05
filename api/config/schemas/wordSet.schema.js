/**
 * WordSet Schema Definition
 * Collection: wordsets
 */

const wordSetSchema = {
  collection: 'wordsets',
  
  // Validation rules
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'name', 'createdAt'],
      properties: {
        userId: {
          bsonType: 'objectId',
          description: 'Reference to Users collection'
        },
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 200,
          description: 'Word set name'
        },
        description: {
          bsonType: 'string'
        },
        coverImage: {
          bsonType: 'string'
        },
        category: {
          enum: ['beginner', 'intermediate', 'advanced', 'custom'],
          description: 'Word set category'
        },
        subcategory: {
          bsonType: 'string'
        },
        tags: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          }
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
        allowContribute: {
          bsonType: 'bool'
        },
        wordCount: {
          bsonType: 'int',
          minimum: 0
        },
        language: {
          enum: ['zh-TW', 'zh-CN'],
          description: 'Traditional or Simplified Chinese'
        },
        difficulty: {
          bsonType: 'int',
          minimum: 1,
          maximum: 10
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
      key: { isPublic: 1, category: 1, 'stats.rating.average': -1 },
      options: { name: 'public_category_rating' }
    },
    {
      key: { isPublic: 1, 'stats.cloneCount': -1 },
      options: { name: 'popular_sets' }
    },
    {
      key: { tags: 1 },
      options: { name: 'tags_index' }
    },
    {
      key: { name: 'text', description: 'text', tags: 'text' },
      options: { name: 'text_search' }
    },
    {
      key: { 'source.originalSetId': 1 },
      options: { name: 'cloned_from' }
    }
  ],
  
  // Default document structure
  defaultDocument: {
    userId: null,
    name: '',
    description: '',
    coverImage: null,
    category: 'custom',
    subcategory: null,
    tags: [],
    isPublic: false,
    isOfficial: false,
    allowClone: true,
    allowContribute: false,
    wordCount: 0,
    language: 'zh-TW',
    difficulty: 1,
    stats: {
      totalWords: 0,
      cloneCount: 0,
      viewCount: 0,
      favoriteCount: 0,
      rating: {
        average: 0,
        count: 0
      },
      completionRate: 0
    },
    progress: {
      masteredWords: 0,
      learningWords: 0,
      newWords: 0,
      averageMastery: 0,
      lastStudied: null
    },
    source: null,
    author: {
      userId: null,
      username: '',
      displayName: ''
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: null
  }
};

module.exports = wordSetSchema;
