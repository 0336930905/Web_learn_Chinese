/**
 * Word Schema Definition
 * Collection: words
 */

const wordSchema = {
  collection: 'words',
  
  // Validation rules
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['wordSetId', 'userId', 'traditional', 'pinyin', 'vietnamese', 'createdAt'],
      properties: {
        wordSetId: {
          bsonType: 'objectId',
          description: 'Reference to WordSets collection'
        },
        userId: {
          bsonType: 'objectId',
          description: 'Reference to Users collection'
        },
        traditional: {
          bsonType: 'string',
          minLength: 1,
          description: 'Traditional Chinese characters'
        },
        simplified: {
          bsonType: 'string'
        },
        pinyin: {
          bsonType: 'string',
          minLength: 1,
          description: 'Pinyin pronunciation'
        },
        pinyinNumbered: {
          bsonType: 'string'
        },
        zhuyin: {
          bsonType: 'string'
        },
        vietnamese: {
          bsonType: 'string',
          minLength: 1,
          description: 'Vietnamese translation'
        },
        english: {
          bsonType: 'string'
        },
        partOfSpeech: {
          bsonType: 'string'
        },
        category: {
          bsonType: 'string'
        },
        imageUrl: {
          bsonType: 'string',
          description: 'Image URL for visual learning'
        },
        difficulty: {
          bsonType: 'int',
          minimum: 1,
          maximum: 10
        },
        hskLevel: {
          bsonType: 'int',
          minimum: 1,
          maximum: 6
        },
        frequency: {
          bsonType: 'int'
        },
        order: {
          bsonType: 'int',
          minimum: 0
        },
        isArchived: {
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
      key: { wordSetId: 1, order: 1 },
      options: { name: 'wordset_order' }
    },
    {
      key: { userId: 1, wordSetId: 1 },
      options: { name: 'user_wordset' }
    },
    {
      key: { traditional: 1 },
      options: { name: 'traditional_index' }
    },
    {
      key: { simplified: 1 },
      options: { name: 'simplified_index' }
    },
    {
      key: { traditional: 'text', pinyin: 'text', vietnamese: 'text', english: 'text' },
      options: { name: 'text_search' }
    },
    {
      key: { hskLevel: 1 },
      options: { name: 'hsk_level' }
    },
    {
      key: { category: 1, difficulty: 1 },
      options: { name: 'category_difficulty' }
    }
  ],
  
  // Default document structure
  defaultDocument: {
    wordSetId: null,
    userId: null,
    traditional: '',
    simplified: '',
    pinyin: '',
    pinyinNumbered: '',
    zhuyin: '',
    vietnamese: '',
    english: '',
    partOfSpeech: '',
    category: '',
    difficulty: 1,
    hskLevel: null,
    frequency: null,
    examples: [],
    audio: null,
    audioSource: null,
    image: null,
    imageUrl: '',
    notes: '',
    mnemonicHint: '',
    personalExamples: [],
    synonyms: [],
    antonyms: [],
    characters: [],
    tags: [],
    order: 0,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
};

module.exports = wordSchema;
