require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../api/models/User');
const Category = require('../api/models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://profine:phamthanh123@cluster0.9pt7w.mongodb.net/learn-taiwanese?retryWrites=true&w=majority';

async function checkPublicCategories() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Kiểm tra tất cả categories
        const allCategories = await Category.find({}).populate('userId', 'username email');
        
        console.log('📊 TỔNG SỐ CATEGORIES:', allCategories.length);
        console.log('');
        
        // Phân loại
        const publicCategories = allCategories.filter(c => c.isPublic === true);
        const nonPublicCategories = allCategories.filter(c => c.isPublic !== true);
        
        console.log('✅ CATEGORIES CÔNG KHAI (isPublic: true):', publicCategories.length);
        publicCategories.forEach(cat => {
            console.log(`  • ${cat.icon || '📁'} ${cat.name} (${cat.slug}) - User: ${cat.userId?.username || 'N/A'}`);
        });
        
        console.log('');
        console.log('❌ CATEGORIES KHÔNG CÔNG KHAI:', nonPublicCategories.length);
        nonPublicCategories.forEach(cat => {
            console.log(`  • ${cat.icon || '📁'} ${cat.name} (${cat.slug}) - isPublic: ${cat.isPublic} - User: ${cat.userId?.username || 'N/A'}`);
        });
        
        console.log('');
        console.log('═══════════════════════════════════════════════════════');
        
        if (nonPublicCategories.length > 0) {
            console.log('⚠️  CÓ CATEGORIES CHƯA CÔNG KHAI!');
            console.log('');
            console.log('Để sửa, chạy lệnh:');
            console.log('  node scripts/fix-public-categories.js');
        } else {
            console.log('✅ TẤT CẢ CATEGORIES ĐÃ CÔNG KHAI!');
        }
        console.log('═══════════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

checkPublicCategories();
