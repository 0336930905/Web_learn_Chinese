require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../api/models/Category');
const User = require('../api/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://profine:phamthanh123@cluster0.9pt7w.mongodb.net/learn-taiwanese?retryWrites=true&w=majority';

async function checkSystemCategories() {
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

        console.log(`👤 Admin: ${admin.email} (ID: ${admin._id})\n`);

        // Get all categories for this admin
        const categories = await Category.find({ userId: admin._id }).sort({ name: 1 });
        
        console.log(`📁 Total categories: ${categories.length}\n`);

        console.log('🔍 CATEGORY DETAILS:\n');
        categories.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat.icon || '📁'} ${cat.name} (${cat.slug})`);
            console.log(`   - ID: ${cat._id}`);
            console.log(`   - isSystem: ${cat.isSystem}`);
            console.log(`   - isPublic: ${cat.isPublic}`);
            console.log(`   - Created: ${cat.createdAt.toISOString().split('T')[0]}`);
            console.log('');
        });

        // Check if any isSystem = true
        const systemCategories = categories.filter(c => c.isSystem === true);
        console.log(`\n⚙️  System categories (isSystem=true): ${systemCategories.length}`);
        
        if (systemCategories.length > 0) {
            console.log('⚠️  WARNING: These categories have isSystem=true:');
            systemCategories.forEach(c => {
                console.log(`   - ${c.name} (${c.slug})`);
            });
        }

        // Simulate what /api/categories returns
        console.log('\n🔍 SIMULATING /api/categories endpoint:');
        console.log('Query: { $or: [{ userId: admin._id }, { isSystem: true }] }');
        
        const apiResult = await Category.find({
            $or: [
                { userId: admin._id },
                { isSystem: true }
            ]
        }).sort({ order: 1, createdAt: 1 });
        
        console.log(`\n📊 Result: ${apiResult.length} categories`);
        
        // Group by slug to find duplicates
        const grouped = {};
        apiResult.forEach(cat => {
            if (!grouped[cat.slug]) {
                grouped[cat.slug] = [];
            }
            grouped[cat.slug].push(cat);
        });
        
        console.log('\n🔍 Checking for duplicates in API result:');
        let hasDuplicates = false;
        Object.entries(grouped).forEach(([slug, items]) => {
            if (items.length > 1) {
                hasDuplicates = true;
                console.log(`⚠️  ${items[0].name} (${slug}) - ${items.length} copies`);
                items.forEach((item, idx) => {
                    console.log(`   ${idx + 1}. ID: ${item._id}, userId: ${item.userId}, isSystem: ${item.isSystem}`);
                });
            }
        });
        
        if (!hasDuplicates) {
            console.log('✅ No duplicates in API result');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

checkSystemCategories();
