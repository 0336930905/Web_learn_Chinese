/**
 * Create Admin User nhhaoa20135
 * Run this before seed-admin-categories-words.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../api/models/User');

const ADMIN_USERNAME = 'nhhaoa20135';
const ADMIN_EMAIL = 'nhhaoa20135@admin.com';
const ADMIN_PASSWORD = 'admin123456'; // Change this!

async function createAdminUser() {
  try {
    console.log('🚀 Creating admin user...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taiwanese_learning';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username: ADMIN_USERNAME },
        { email: ADMIN_EMAIL }
      ]
    });

    if (existingUser) {
      console.log(`✅ User already exists: ${existingUser.username} (${existingUser.email})`);
      console.log(`   Role: ${existingUser.role}`);
      console.log(`   ID: ${existingUser._id}`);
      
      // Update to admin if not already
      if (existingUser.role !== 'admin') {
        existingUser.role = 'admin';
        existingUser.isAdmin = true;
        await existingUser.save();
        console.log('✅ Updated user to admin role');
      }
      
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const adminUser = await User.create({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      displayName: 'Admin User',
      role: 'admin',
      isAdmin: true,
      isActive: true,
      isVerified: true
    });

    console.log('\n════════════════════════════════════════');
    console.log('🎉 ADMIN USER CREATED SUCCESSFULLY!');
    console.log('════════════════════════════════════════');
    console.log(`Username: ${adminUser.username}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`ID: ${adminUser._id}`);
    console.log('════════════════════════════════════════');
    console.log('⚠️  Please change the password after first login!');
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run
createAdminUser();
