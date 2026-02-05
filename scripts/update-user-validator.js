/**
 * Update User Collection Validator
 * Remove username and password requirements
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function updateValidator() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('   URI:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in .env file');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected successfully\n');

    const db = mongoose.connection.db;
    
    console.log('📝 Updating users collection validator...');
    
    // Drop existing validator and update
    await db.command({
      collMod: 'users',
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'createdAt'],
          properties: {
            email: {
              bsonType: 'string',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
              description: 'Valid email address required'
            },
            password: {
              bsonType: 'string',
              description: 'Bcrypt hashed password (optional for Google OAuth)'
            },
            username: {
              bsonType: 'string',
              description: 'Optional username (auto-generated from email)'
            },
            displayName: {
              bsonType: 'string'
            },
            googleId: {
              bsonType: 'string'
            },
            avatar: {
              bsonType: 'string'
            },
            bio: {
              bsonType: 'string'
            },
            isActive: {
              bsonType: 'bool'
            },
            isVerified: {
              bsonType: 'bool'
            },
            isPremium: {
              bsonType: 'bool'
            },
            role: {
              enum: ['user', 'admin', 'moderator'],
              description: 'User role'
            },
            level: {
              bsonType: 'number'
            },
            totalXP: {
              bsonType: 'number'
            },
            streak: {
              bsonType: 'number'
            },
            longestStreak: {
              bsonType: 'number'
            },
            lastStudyDate: {
              bsonType: 'date'
            },
            lastLoginAt: {
              bsonType: 'date'
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
      validationLevel: 'moderate'
    });

    console.log('✅ Validator updated successfully!');
    console.log('\n📊 New validation rules:');
    console.log('   - Required fields: email, createdAt');
    console.log('   - Optional: username, password, displayName');
    console.log('   - Username auto-generated from email');
    console.log('   - Password optional for Google OAuth\n');

    // Update indexes
    console.log('📝 Updating username index to sparse...');
    const collection = db.collection('users');
    
    try {
      await collection.dropIndex('username_unique');
      console.log('   Dropped old username_unique index');
    } catch (err) {
      console.log('   No existing username_unique index to drop');
    }

    await collection.createIndex(
      { username: 1 }, 
      { unique: true, sparse: true, name: 'username_unique' }
    );
    console.log('✅ Username index updated (unique + sparse)\n');

    console.log('🎉 All updates completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating validator:', error.message);
    if (error.code === 121) {
      console.error('\n💡 Tip: There might be existing documents that don\'t match the new schema.');
      console.error('   You may need to update or remove invalid documents first.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
}

updateValidator();
