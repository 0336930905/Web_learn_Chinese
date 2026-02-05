/**
 * Database Setup Script
 * Creates collections with validators and indexes
 * 
 * Usage:
 *   node api/scripts/setupDatabase.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const schemas = require('../config/schemas');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}`)
};

/**
 * Create collection with validator
 */
async function createCollection(db, schema) {
  const collectionName = schema.collection;
  
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: collectionName }).toArray();
    
    if (collections.length > 0) {
      log.warning(`Collection '${collectionName}' already exists`);
      
      // Try to update validator (may fail on MongoDB Atlas free tier)
      try {
        await db.command({
          collMod: collectionName,
          validator: schema.validator,
          validationLevel: 'moderate'
        });
        log.success(`Updated validator for '${collectionName}'`);
      } catch (validatorError) {
        if (validatorError.code === 8000 || validatorError.codeName === 'AtlasError') {
          log.warning(`Cannot update validator for '${collectionName}' (Atlas limitation)`);
          log.info(`Skipping validator update - collection will work without schema validation`);
        } else {
          throw validatorError;
        }
      }
    } else {
      // Create new collection with validator
      try {
        await db.createCollection(collectionName, {
          validator: schema.validator,
          validationLevel: 'moderate'
        });
        log.success(`Created collection '${collectionName}' with validator`);
      } catch (createError) {
        if (createError.code === 8000 || createError.codeName === 'AtlasError') {
          // If validator creation fails, create without validator
          log.warning(`Cannot create validator for '${collectionName}' (Atlas limitation)`);
          await db.createCollection(collectionName);
          log.success(`Created collection '${collectionName}' without validator`);
        } else {
          throw createError;
        }
      }
    }
  } catch (error) {
    log.error(`Failed to create/update collection '${collectionName}': ${error.message}`);
    throw error;
  }
}

/**
 * Create indexes for collection
 */
async function createIndexes(db, schema) {
  const collectionName = schema.collection;
  const collection = db.collection(collectionName);
  
  try {
    // Get existing indexes
    const existingIndexes = await collection.indexes();
    const existingIndexNames = existingIndexes.map(idx => idx.name);
    
    // Create new indexes (skip if already exists)
    for (const indexDef of schema.indexes) {
      const indexName = indexDef.options.name;
      
      if (existingIndexNames.includes(indexName)) {
        log.info(`Index '${indexName}' already exists on '${collectionName}'`);
        continue;
      }
      
      try {
        await collection.createIndex(indexDef.key, indexDef.options);
        log.success(`Created index '${indexName}' on '${collectionName}'`);
      } catch (indexError) {
        if (indexError.code === 85 || indexError.codeName === 'IndexOptionsConflict') {
          log.warning(`Index '${indexName}' already exists with different options`);
        } else {
          log.error(`Failed to create index '${indexName}': ${indexError.message}`);
        }
      }
    }
  } catch (error) {
    log.error(`Failed to create indexes for '${collectionName}': ${error.message}`);
    throw error;
  }
}

/**
 * Setup additional collections (badges, achievements, notifications)
 */
async function setupAdditionalCollections(db) {
  log.section('📦 Setting up additional collections...');
  
  // Badges collection
  try {
    await db.createCollection('badges', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['badgeId', 'name', 'category', 'points'],
          properties: {
            badgeId: { bsonType: 'string' },
            name: { bsonType: 'string' },
            nameVi: { bsonType: 'string' },
            description: { bsonType: 'string' },
            descriptionVi: { bsonType: 'string' },
            icon: { bsonType: 'string' },
            category: { bsonType: 'string' },
            rarity: { enum: ['common', 'rare', 'epic', 'legendary'] },
            points: { bsonType: 'int', minimum: 0 }
          }
        }
      }
    });
    await db.collection('badges').createIndex({ badgeId: 1 }, { unique: true });
    log.success('Created badges collection');
  } catch (error) {
    log.warning('Badges collection already exists or error: ' + error.message);
  }
  
  // Achievements collection
  try {
    await db.createCollection('achievements', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['achievementId', 'name', 'category'],
          properties: {
            achievementId: { bsonType: 'string' },
            name: { bsonType: 'string' },
            nameVi: { bsonType: 'string' },
            description: { bsonType: 'string' },
            descriptionVi: { bsonType: 'string' },
            icon: { bsonType: 'string' },
            category: { bsonType: 'string' }
          }
        }
      }
    });
    await db.collection('achievements').createIndex({ achievementId: 1 }, { unique: true });
    log.success('Created achievements collection');
  } catch (error) {
    log.warning('Achievements collection already exists or error: ' + error.message);
  }
  
  // Notifications collection
  try {
    await db.createCollection('notifications');
    await db.collection('notifications').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('notifications').createIndex({ userId: 1, isRead: 1 });
    log.success('Created notifications collection');
  } catch (error) {
    log.warning('Notifications collection already exists or error: ' + error.message);
  }
}

/**
 * Main setup function
 */
async function setupDatabase() {
  log.section('🚀 Starting Database Setup...');
  
  if (!process.env.MONGODB_URI) {
    log.error('MONGODB_URI not found in environment variables');
    process.exit(1);
  }
  
  let connection;
  
  try {
    // Connect to MongoDB
    log.info('Connecting to MongoDB...');
    connection = await mongoose.connect(process.env.MONGODB_URI);
    const db = connection.connection.db;
    log.success('Connected to MongoDB');
    
    // Get all schemas
    const allSchemas = schemas.getAllSchemas();
    
    // Create collections with validators
    log.section('📋 Creating collections with validators...');
    for (const schema of allSchemas) {
      await createCollection(db, schema);
    }
    
    // Create indexes
    log.section('🔍 Creating indexes...');
    for (const schema of allSchemas) {
      await createIndexes(db, schema);
    }
    
    // Setup additional collections
    await setupAdditionalCollections(db);
    
    log.section('✨ Database setup completed successfully!');
    
    log.section('✨ Database setup completed successfully!');
    
    // Display summary
    log.section('📊 Summary:');
    const collections = await db.listCollections().toArray();
    log.info(`Total collections: ${collections.length}`);
    collections.forEach(col => {
      log.info(`  - ${col.name}`);
    });
    
    // Important notes
    log.section('📝 Notes:');
    log.warning('Schema validators may not be active on MongoDB Atlas free tier');
    log.info('Application-level validation will be used instead');
    log.info('Indexes have been created for optimal performance');
    
  } catch (error) {
    log.error('Database setup failed: ' + error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      log.info('Disconnected from MongoDB');
    }
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      log.success('Setup script completed');
      process.exit(0);
    })
    .catch(error => {
      log.error('Setup script failed: ' + error.message);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
