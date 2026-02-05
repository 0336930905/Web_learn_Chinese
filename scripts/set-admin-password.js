/**
 * Script to set/update admin password
 * Run: node scripts/set-admin-password.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../api/models/User');

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123456'; // Mật khẩu mới cho admin

async function setAdminPassword() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taiwanese-learning', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');

        // Hash password
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Find or create admin user
        let admin = await User.findOne({ email: ADMIN_EMAIL });

        if (admin) {
            console.log('👤 Admin user found, updating...');
            admin.password = hashedPassword;
            admin.isAdmin = true;
            admin.role = 'admin';
            admin.isActive = true;
            admin.isVerified = true;
            await admin.save();
            console.log('✅ Admin password updated successfully!');
        } else {
            console.log('👤 Admin user not found, creating new one...');
            admin = await User.create({
                email: ADMIN_EMAIL,
                password: hashedPassword,
                username: 'admin',
                displayName: 'Administrator',
                isAdmin: true,
                role: 'admin',
                isActive: true,
                isVerified: true
            });
            console.log('✅ Admin user created successfully!');
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', ADMIN_EMAIL);
        console.log('🔑 Password:', ADMIN_PASSWORD);
        console.log('👑 Role:', admin.role);
        console.log('✨ isAdmin:', admin.isAdmin);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('Bạn có thể đăng nhập với:');
        console.log(`  Email: ${ADMIN_EMAIL}`);
        console.log(`  Password: ${ADMIN_PASSWORD}`);
        console.log('');
        console.log('Sau đó truy cập admin dashboard tại:');
        console.log('  http://localhost:3000/pages/dashboard/admin-dashboard.html');
        console.log('');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the script
setAdminPassword();
