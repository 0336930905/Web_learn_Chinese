/**
 * Create Test User
 * Tạo user test cho việc kiểm tra hệ thống
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
const User = require('../api/models/User');
const { createStarterWords } = require('../api/utils/starterWords');

// MongoDB connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
}

// Create test user
async function createTestUser() {
    try {
        const testEmail = 'nhao47111@gmail.com';
        const testPassword = '123456';
        
        console.log('\n📝 Creating test user...');
        console.log('Email:', testEmail);
        console.log('Password:', testPassword);
        
        // Check if user exists
        const existingUser = await User.findOne({ email: testEmail });
        
        if (existingUser) {
            console.log('\n⚠️  User already exists!');
            console.log('User ID:', existingUser._id);
            console.log('Username:', existingUser.username);
            console.log('Display Name:', existingUser.displayName);
            console.log('Created At:', existingUser.createdAt);
            
            // Update password to ensure it's correct
            const hashedPassword = await bcrypt.hash(testPassword, 10);
            existingUser.password = hashedPassword;
            await existingUser.save();
            
            console.log('\n✅ Password updated to:', testPassword);
            return existingUser;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(testPassword, 10);
        
        // Generate username
        const username = testEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Create user
        const newUser = await User.create({
            email: testEmail,
            username: username,
            password: hashedPassword,
            displayName: 'Test User',
            lastLoginAt: new Date()
        });
        
        console.log('\n✅ User created successfully!');
        console.log('User ID:', newUser._id);
        console.log('Username:', newUser.username);
        console.log('Email:', newUser.email);
        console.log('Display Name:', newUser.displayName);
        
        // Create starter words
        console.log('\n📚 Creating starter words...');
        try {
            await createStarterWords(newUser._id);
            console.log('✅ Starter words created');
        } catch (error) {
            console.log('⚠️  Could not create starter words:', error.message);
        }
        
        return newUser;
        
    } catch (error) {
        console.error('\n❌ Error creating test user:', error);
        throw error;
    }
}

// List all users
async function listUsers() {
    try {
        const users = await User.find({}).select('email username displayName createdAt').limit(10);
        
        console.log('\n👥 All Users in Database:');
        console.log('='.repeat(60));
        
        if (users.length === 0) {
            console.log('No users found');
        } else {
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. ${user.email}`);
                console.log(`   Username: ${user.username}`);
                console.log(`   Display Name: ${user.displayName}`);
                console.log(`   Created: ${user.createdAt.toLocaleString()}`);
            });
        }
        
        console.log('\n' + '='.repeat(60));
        console.log(`Total: ${users.length} users`);
        
    } catch (error) {
        console.error('❌ Error listing users:', error);
    }
}

// Main function
async function main() {
    console.log('🚀 Test User Creation Script\n');
    
    await connectDB();
    
    // List existing users
    await listUsers();
    
    // Create or update test user
    await createTestUser();
    
    console.log('\n✅ Script completed successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('   Email: nhao47111@gmail.com');
    console.log('   Password: 123456');
    console.log('\nYou can now use these credentials to test login.');
    
    process.exit(0);
}

// Run script
main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});
