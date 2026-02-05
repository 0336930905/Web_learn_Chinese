require('dotenv').config();
const mongoose = require('mongoose');

// Import ALL 11 models
const User = require('../api/models/User');
const Category = require('../api/models/Category');
const Word = require('../api/models/Word');
const WordSet = require('../api/models/WordSet');
const Progress = require('../api/models/Progress');
const Test = require('../api/models/Test');
const TestResult = require('../api/models/TestResult');
const UserStats = require('../api/models/UserStats');
const Achievement = require('../api/models/Achievement');
const Badge = require('../api/models/Badge');
const Notification = require('../api/models/Notification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://profine:phamthanh123@cluster0.9pt7w.mongodb.net/learn-taiwanese?retryWrites=true&w=majority';

async function clearAllData() {
    try {
        console.log('⚠️  ═══════════════════════════════════════════════════════');
        console.log('⚠️  CẢNH BÁO - XÓA TOÀN BỘ DỮ LIỆU TRONG DATABASE');
        console.log('⚠️  ═══════════════════════════════════════════════════════');
        console.log('');
        console.log('Script này sẽ XÓA DỮ LIỆU trong 11 BẢNG:');
        console.log('  1. Users (người dùng)');
        console.log('  2. Categories (danh mục)');
        console.log('  3. Words (từ vựng)');
        console.log('  4. WordSets (bộ từ vựng)');
        console.log('  5. Progress (tiến độ)');
        console.log('  6. Tests (bài test)');
        console.log('  7. TestResults (kết quả test)');
        console.log('  8. UserStats (thống kê người dùng)');
        console.log('  9. Achievements (thành tựu)');
        console.log('  10. Badges (huy hiệu)');
        console.log('  11. Notifications (thông báo)');
        console.log('');
        console.log('⚠️  Các bảng vẫn tồn tại, chỉ xóa dữ liệu bên trong.');
        console.log('⚠️  KHÔNG tạo lại admin hay categories.');
        console.log('⚠️  Database sẽ TRỐNG HOÀN TOÀN sau khi chạy!');
        console.log('');
        
        // Đợi 3 giây để user có thể đọc
        console.log('Bắt đầu sau 3 giây...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        console.log('\n🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Đếm trước khi xóa
        const counts = {
            users: await User.countDocuments(),
            categories: await Category.countDocuments(),
            words: await Word.countDocuments(),
            wordSets: await WordSet.countDocuments(),
            progress: await Progress.countDocuments(),
            tests: await Test.countDocuments(),
            testResults: await TestResult.countDocuments(),
            userStats: await UserStats.countDocuments(),
            achievements: await Achievement.countDocuments(),
            badges: await Badge.countDocuments(),
            notifications: await Notification.countDocuments()
        };
        
        console.log('📊 DỮ LIỆU HIỆN TẠI (11 BẢNG):');
        console.log(`  1. Users: ${counts.users}`);
        console.log(`  2. Categories: ${counts.categories}`);
        console.log(`  3. Words: ${counts.words}`);
        console.log(`  4. WordSets: ${counts.wordSets}`);
        console.log(`  5. Progress: ${counts.progress}`);
        console.log(`  6. Tests: ${counts.tests}`);
        console.log(`  7. TestResults: ${counts.testResults}`);
        console.log(`  8. UserStats: ${counts.userStats}`);
        console.log(`  9. Achievements: ${counts.achievements}`);
        console.log(`  10. Badges: ${counts.badges}`);
        console.log(`  11. Notifications: ${counts.notifications}`);
        console.log('');

        // XÓA TẤT CẢ DỮ LIỆU TRONG 11 BẢNG
        console.log('🗑️  ĐANG XÓA DỮ LIỆU...\n');
        
        console.log('  ❌ Deleting all notifications...');
        await Notification.deleteMany({});
        
        console.log('  ❌ Deleting all badges...');
        await Badge.deleteMany({});
        
        console.log('  ❌ Deleting all achievements...');
        await Achievement.deleteMany({});
        
        console.log('  ❌ Deleting all user stats...');
        await UserStats.deleteMany({});
        
        console.log('  ❌ Deleting all test results...');
        await TestResult.deleteMany({});
        
        console.log('  ❌ Deleting all tests...');
        await Test.deleteMany({});
        
        console.log('  ❌ Deleting all progress...');
        await Progress.deleteMany({});
        
        console.log('  ❌ Deleting all word sets...');
        await WordSet.deleteMany({});
        
        console.log('  ❌ Deleting all words...');
        await Word.deleteMany({});
        
        console.log('  ❌ Deleting all categories...');
        await Category.deleteMany({});
        
        console.log('  ❌ Deleting all users...');
        await User.deleteMany({});
        
        console.log('\n✅ ĐÃ XÓA TOÀN BỘ DỮ LIỆU!\n');

        // THỐNG KÊ SAU KHI XÓA
        console.log('═══════════════════════════════════════════════════════');
        console.log('📊 TỔNG KẾT:');
        console.log('═══════════════════════════════════════════════════════');
        console.log('');
        console.log('❌ ĐÃ XÓA DỮ LIỆU TRONG 11 BẢNG:');
        console.log(`  1. Users: ${counts.users} records`);
        console.log(`  2. Categories: ${counts.categories} records`);
        console.log(`  3. Words: ${counts.words} records`);
        console.log(`  4. WordSets: ${counts.wordSets} records`);
        console.log(`  5. Progress: ${counts.progress} records`);
        console.log(`  6. Tests: ${counts.tests} records`);
        console.log(`  7. TestResults: ${counts.testResults} records`);
        console.log(`  8. UserStats: ${counts.userStats} records`);
        console.log(`  9. Achievements: ${counts.achievements} records`);
        console.log(`  10. Badges: ${counts.badges} records`);
        console.log(`  11. Notifications: ${counts.notifications} records`);
        console.log('');
        const totalDeleted = Object.values(counts).reduce((sum, val) => sum + val, 0);
        console.log(`  📊 TỔNG: ${totalDeleted} records đã xóa`);
        console.log('');
        console.log('✅ DATABASE HIỆN TẠI: TRỐNG HOÀN TOÀN');
        console.log('📝 Bạn có thể tự thêm dữ liệu thủ công.');
        console.log('═══════════════════════════════════════════════════════');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Chạy script
clearAllData();
