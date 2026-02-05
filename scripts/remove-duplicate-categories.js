require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../api/models/Category');
const User = require('../api/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://profine:phamthanh123@cluster0.9pt7w.mongodb.net/learn-taiwanese?retryWrites=true&w=majority';

async function removeDuplicates() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find admin user
        const admin = await User.findOne({ email: 'admin@example.com' });
        
        if (!admin) {
            console.log('❌ Admin user not found');
            return;
        }

        console.log(`👤 Found admin: ${admin.email} (ID: ${admin._id})\n`);

        // Get all categories for this admin
        const categories = await Category.find({ userId: admin._id }).sort({ name: 1, createdAt: 1 });
        
        console.log(`📁 Total categories: ${categories.length}\n`);

        // Group by slug to find duplicates
        const grouped = {};
        
        categories.forEach(cat => {
            const key = cat.slug;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(cat);
        });

        // Remove duplicates - keep the oldest one
        let removed = 0;
        
        console.log('🗑️  REMOVING DUPLICATE CATEGORIES:\n');
        
        for (const [slug, items] of Object.entries(grouped)) {
            if (items.length > 1) {
                console.log(`⚠️  ${items[0].name} (${slug}) - ${items.length} duplicates found`);
                
                // Sort by creation date, keep the first (oldest)
                items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                const toKeep = items[0];
                const toRemove = items.slice(1);
                
                console.log(`   ✅ Keeping: ID ${toKeep._id} (Created: ${toKeep.createdAt.toISOString().split('T')[0]})`);
                
                for (const cat of toRemove) {
                    console.log(`   ❌ Removing: ID ${cat._id} (Created: ${cat.createdAt.toISOString().split('T')[0]})`);
                    await Category.deleteOne({ _id: cat._id });
                    removed++;
                }
                console.log('');
            }
        }

        console.log('\n📊 SUMMARY:');
        console.log(`• Total duplicates removed: ${removed}`);
        console.log(`• Categories remaining: ${categories.length - removed}`);
        
        // Display remaining categories
        const remaining = await Category.find({ userId: admin._id }).sort({ name: 1 });
        console.log('\n📋 REMAINING CATEGORIES:');
        remaining.forEach(cat => {
            console.log(`• ${cat.icon || '📁'} ${cat.name} (${cat.slug})`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

removeDuplicates();
