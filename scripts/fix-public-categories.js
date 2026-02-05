require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../api/models/User');
const Category = require('../api/models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://profine:phamthanh123@cluster0.9pt7w.mongodb.net/learn-taiwanese?retryWrites=true&w=majority';

async function fixPublicCategories() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        console.log('🔧 ĐANG CẬP NHẬT TẤT CẢ CATEGORIES THÀNH CÔNG KHAI...\n');
        
        // Cập nhật tất cả categories thành isPublic: true
        const result = await Category.updateMany(
            {},
            { $set: { isPublic: true } }
        );
        
        console.log(`✅ Đã cập nhật ${result.modifiedCount} categories`);
        console.log(`📊 Tổng số categories: ${result.matchedCount}`);
        
        // Hiển thị danh sách sau khi update
        const allCategories = await Category.find({}).populate('userId', 'username email');
        
        console.log('\n📋 DANH SÁCH CATEGORIES SAU KHI CẬP NHẬT:\n');
        allCategories.forEach(cat => {
            console.log(`  ✅ ${cat.icon || '📁'} ${cat.name} (${cat.slug})`);
            console.log(`     User: ${cat.userId?.username || 'N/A'}`);
            console.log(`     isPublic: ${cat.isPublic}`);
            console.log('');
        });
        
        console.log('═══════════════════════════════════════════════════════');
        console.log('✅ HOÀN THÀNH! TẤT CẢ CATEGORIES ĐÃ CÔNG KHAI');
        console.log('═══════════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

fixPublicCategories();
