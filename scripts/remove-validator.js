/**
 * Remove MongoDB Collection Validator
 * Run this script to remove the JSON Schema validator blocking Google OAuth
 */

const mongoose = require('mongoose');
require('dotenv').config();

async function removeValidator() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Check current validator
    console.log('\n📋 Checking current validator...');
    const collections = await db.listCollections({ name: 'users' }).toArray();
    
    if (collections.length > 0) {
      const userCollection = collections[0];
      console.log('Current validator:', JSON.stringify(userCollection.options.validator, null, 2));
    }

    // Remove validator
    console.log('\n🗑️ Removing validator...');
    await db.command({
      collMod: 'users',
      validator: {},
      validationLevel: 'off'
    });

    console.log('✅ Validator removed successfully!');
    console.log('\n🎉 You can now use Google OAuth without validation errors');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

removeValidator();
