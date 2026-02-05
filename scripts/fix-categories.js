/**
 * Fix Categories - Set isSystem = true for all admin categories
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../api/models/User');
const Category = require('../api/models/Category');

async function fixCategories() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Find admin user
        const admin = await User.findOne({ email: 'admin@example.com' });
        if (!admin) {
            console.log('❌ Admin user not found!');
            process.exit(1);
        }
        console.log('✅ Admin user found:', admin.email);

        // Update all admin categories to isSystem: true
        const result = await Category.updateMany(
            { userId: admin._id },
            { $set: { isSystem: true, isPublic: true } }
        );

        console.log(`✅ Updated ${result.modifiedCount} categories`);

        const allCategories = await Category.find({ userId: admin._id }).lean();
        console.log(`\n📊 All admin categories (${allCategories.length}):`);
        allCategories.forEach(cat => {
            console.log(`   - ${cat.name} (${cat.slug}) - isSystem: ${cat.isSystem}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixCategories();
