/**
 * Migration Script: v1.0 → v2.0
 * Migrates from single-user to multi-user architecture
 * 
 * Usage:
 *   node api/scripts/migrate.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}`),
  highlight: (msg) => console.log(`${colors.magenta}${msg}${colors.reset}`)
};

/**
 * Ask user for confirmation
 */
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

/**
 * Create default admin user
 */
async function createDefaultUser(db) {
  log.section('👤 Creating default admin user...');
  
  const bcrypt = require('bcryptjs');
  const defaultUserId = new mongoose.Types.ObjectId();
  
  const defaultUser = {
    _id: defaultUserId,
    email: 'admin@learnchinese.com',
    password: await bcrypt.hash('Admin@123', 10), // Change this in production!
    username: 'admin',
    displayName: 'Administrator',
    avatar: null,
    bio: 'Default admin account - migrated from v1.0',
    isActive: true,
    isVerified: true,
    isPremium: false,
    role: 'admin',
    preferences: {
      theme: 'light',
      language: 'vi',
      dailyGoal: 20,
      notifications: {
        email: true,
        push: true,
        reviewReminder: true,
        achievementAlert: true,
        weeklyReport: true
      },
      studySettings: {
        autoPlayAudio: true,
        showPinyin: true,
        showZhuyin: false,
        reviewMode: 'srs',
        cardSide: 'traditional'
      }
    },
    stats: {
      totalWords: 0,
      totalWordSets: 0,
      totalTests: 0,
      studyStreak: 0,
      longestStreak: 0,
      level: 'beginner',
      totalStudyTime: 0,
      lastStudyDate: null
    },
    points: 0,
    badges: [],
    achievements: [],
    following: [],
    followers: [],
    followersCount: 0,
    followingCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date()
  };
  
  try {
    await db.collection('users').insertOne(defaultUser);
    log.success('Default user created');
    log.highlight(`  Email: ${defaultUser.email}`);
    log.highlight(`  Password: Admin@123`);
    log.warning('  ⚠️  Please change the password after first login!');
    
    return defaultUserId;
  } catch (error) {
    log.error('Failed to create default user: ' + error.message);
    throw error;
  }
}

/**
 * Create default word set
 */
async function createDefaultWordSet(db, userId) {
  log.section('📚 Creating default word set...');
  
  const defaultWordSetId = new mongoose.Types.ObjectId();
  
  const defaultWordSet = {
    _id: defaultWordSetId,
    userId: userId,
    name: 'My Vocabulary',
    description: 'Migrated vocabulary from v1.0',
    coverImage: null,
    category: 'custom',
    subcategory: null,
    tags: ['migrated', 'v1'],
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
      rating: { average: 0, count: 0 },
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
      userId: userId,
      username: 'admin',
      displayName: 'Administrator'
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: null
  };
  
  try {
    await db.collection('wordsets').insertOne(defaultWordSet);
    log.success('Default word set created');
    
    return defaultWordSetId;
  } catch (error) {
    log.error('Failed to create default word set: ' + error.message);
    throw error;
  }
}

/**
 * Migrate existing words
 */
async function migrateWords(db, userId, wordSetId) {
  log.section('📝 Migrating existing words...');
  
  try {
    const wordsCollection = db.collection('words');
    const wordCount = await wordsCollection.countDocuments();
    
    if (wordCount === 0) {
      log.info('No words to migrate');
      return 0;
    }
    
    log.info(`Found ${wordCount} words to migrate`);
    
    // Update all words with userId and wordSetId
    const result = await wordsCollection.updateMany(
      {},
      {
        $set: {
          userId: userId,
          wordSetId: wordSetId,
          updatedAt: new Date()
        }
      }
    );
    
    log.success(`Migrated ${result.modifiedCount} words`);
    
    // Update word count in word set
    await db.collection('wordsets').updateOne(
      { _id: wordSetId },
      {
        $set: {
          wordCount: wordCount,
          'stats.totalWords': wordCount
        }
      }
    );
    
    return wordCount;
  } catch (error) {
    log.error('Failed to migrate words: ' + error.message);
    throw error;
  }
}

/**
 * Migrate existing progress data
 */
async function migrateProgress(db, userId) {
  log.section('📊 Migrating progress data...');
  
  try {
    const progressCollection = db.collection('progress');
    const progressCount = await progressCollection.countDocuments();
    
    if (progressCount === 0) {
      log.info('No progress data to migrate');
      return 0;
    }
    
    log.info(`Found ${progressCount} progress records to migrate`);
    
    // Update all progress records with userId
    const result = await progressCollection.updateMany(
      {},
      {
        $set: {
          userId: userId,
          updatedAt: new Date()
        }
      }
    );
    
    log.success(`Migrated ${result.modifiedCount} progress records`);
    
    return progressCount;
  } catch (error) {
    log.error('Failed to migrate progress: ' + error.message);
    throw error;
  }
}

/**
 * Update user stats
 */
async function updateUserStats(db, userId, wordCount) {
  log.section('📈 Updating user statistics...');
  
  try {
    await db.collection('users').updateOne(
      { _id: userId },
      {
        $set: {
          'stats.totalWords': wordCount,
          'stats.totalWordSets': 1,
          updatedAt: new Date()
        }
      }
    );
    
    log.success('User statistics updated');
  } catch (error) {
    log.error('Failed to update user stats: ' + error.message);
    throw error;
  }
}

/**
 * Create backup
 */
async function createBackup(db) {
  log.section('💾 Creating backup...');
  
  const backupName = `backup_v1_${new Date().toISOString().replace(/:/g, '-')}`;
  
  try {
    // Backup words
    const words = await db.collection('words').find({}).toArray();
    if (words.length > 0) {
      await db.collection(backupName + '_words').insertMany(words);
      log.success(`Backed up ${words.length} words to '${backupName}_words'`);
    }
    
    // Backup progress
    const progress = await db.collection('progress').find({}).toArray();
    if (progress.length > 0) {
      await db.collection(backupName + '_progress').insertMany(progress);
      log.success(`Backed up ${progress.length} progress records to '${backupName}_progress'`);
    }
    
    log.success('Backup completed');
    return backupName;
  } catch (error) {
    log.error('Failed to create backup: ' + error.message);
    throw error;
  }
}

/**
 * Main migration function
 */
async function runMigration() {
  log.section('🔄 Database Migration v1.0 → v2.0');
  log.section('════════════════════════════════════════');
  
  log.warning('This script will migrate your database to support multi-user architecture.');
  log.warning('A backup will be created before migration.');
  log.warning('');
  
  const answer = await askQuestion('Do you want to continue? (yes/no): ');
  
  if (answer.toLowerCase() !== 'yes') {
    log.info('Migration cancelled');
    process.exit(0);
  }
  
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
    
    // Create backup
    const backupName = await createBackup(db);
    
    // Create default user
    const userId = await createDefaultUser(db);
    
    // Create default word set
    const wordSetId = await createDefaultWordSet(db, userId);
    
    // Migrate words
    const wordCount = await migrateWords(db, userId, wordSetId);
    
    // Migrate progress
    await migrateProgress(db, userId);
    
    // Update user stats
    await updateUserStats(db, userId, wordCount);
    
    log.section('✨ Migration completed successfully!');
    log.section('📊 Summary:');
    log.info(`  - Backup name: ${backupName}`);
    log.info(`  - User created: admin@learnchinese.com`);
    log.info(`  - Words migrated: ${wordCount}`);
    log.info(`  - Default word set: My Vocabulary`);
    log.section('');
    log.highlight('🎉 Your database is now ready for multi-user support!');
    log.warning('⚠️  Don\'t forget to change the default admin password!');
    
  } catch (error) {
    log.error('Migration failed: ' + error.message);
    console.error(error);
    process.exit(1);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      log.info('Disconnected from MongoDB');
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration()
    .then(() => {
      log.success('Migration script completed');
      process.exit(0);
    })
    .catch(error => {
      log.error('Migration script failed: ' + error.message);
      process.exit(1);
    });
}

module.exports = { runMigration };
