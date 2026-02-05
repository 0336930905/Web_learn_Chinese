require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../api/models/Category');
const User = require('../api/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://profine:phamthanh123@cluster0.9pt7w.mongodb.net/learn-taiwanese?retryWrites=true&w=majority';

async function checkDuplicateCategories() {
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

        // Group by name and slug to find duplicates
        const grouped = {};
        
        categories.forEach(cat => {
            const key = `${cat.name}|${cat.slug}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(cat);
        });

        // Find and display duplicates
        let hasDuplicates = false;
        
        console.log('🔍 KIỂM TRA DANH MỤC TRÙNG LẶP:\n');
        
        Object.entries(grouped).forEach(([key, items]) => {
            const [name, slug] = key.split('|');
            
            if (items.length > 1) {
                hasDuplicates = true;
                console.log(`⚠️  ${name} (${slug}) - ${items.length} bản trùng lặp:`);
                items.forEach((cat, index) => {
                    console.log(`   ${index + 1}. ID: ${cat._id}`);
                    console.log(`      - isSystem: ${cat.isSystem}`);
                    console.log(`      - Created: ${cat.createdAt.toISOString().split('T')[0]}`);
                    console.log(`      - Description: ${cat.description || 'N/A'}`);
                });
                console.log('');
            }
        });

        if (!hasDuplicates) {
            console.log('✅ Không có danh mục trùng lặp!\n');
        } else {
            console.log('\n📊 TỔNG KẾT:');
            const duplicateCount = Object.values(grouped).filter(items => items.length > 1).length;
            const totalDuplicates = Object.values(grouped).reduce((sum, items) => sum + (items.length > 1 ? items.length - 1 : 0), 0);
            console.log(`• Số nhóm trùng lặp: ${duplicateCount}`);
            console.log(`• Tổng số bản sao thừa: ${totalDuplicates}`);
        }

        // Display unique categories
        console.log('\n📋 DANH SÁCH DANH MỤC DUY NHẤT:');
        Object.entries(grouped).forEach(([key, items]) => {
            const [name, slug] = key.split('|');
            const firstItem = items[0];
            console.log(`• ${firstItem.icon || '📁'} ${name} (${slug}) - ${items.length} bản`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

checkDuplicateCategories();
