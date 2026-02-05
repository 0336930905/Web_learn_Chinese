/**
 * Initialize System Categories
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../api/models/User');
const Category = require('../api/models/Category');

async function initCategories() {
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

        const defaultCategories = [
            { slug: 'greetings', name: 'Chào hỏi', icon: '👋', description: 'Các câu chào hỏi thường dùng', order: 0 },
            { slug: 'numbers', name: 'Số đếm', icon: '🔢', description: 'Các số từ 0-10 và hơn', order: 1 },
            { slug: 'food', name: 'Ẩm thực', icon: '🍜', description: 'Đồ ăn và thức uống', order: 2 },
            { slug: 'family', name: 'Gia đình', icon: '👨‍👩‍👧‍👦', description: 'Các thành viên trong gia đình', order: 3 },
            { slug: 'time', name: 'Thời gian', icon: '⏰', description: 'Ngày tháng và thời gian', order: 4 },
            { slug: 'places', name: 'Địa điểm', icon: '📍', description: 'Các địa điểm thường gặp', order: 5 },
            { slug: 'animals', name: 'Động vật', icon: '🐾', description: 'Các loài động vật', order: 6 },
            { slug: 'colors', name: 'Màu sắc', icon: '🎨', description: 'Các màu sắc cơ bản', order: 7 },
            { slug: 'weather', name: 'Thời tiết', icon: '⛅', description: 'Thời tiết và khí hậu', order: 8 },
            { slug: 'travel', name: 'Du lịch', icon: '✈️', description: 'Phương tiện và du lịch', order: 9 }
        ];

        console.log('\n📁 Creating system categories...');
        let created = 0;

        for (const catData of defaultCategories) {
            const exists = await Category.findOne({
                userId: admin._id,
                slug: catData.slug
            });

            if (exists) {
                console.log(`   ⏭️  Category already exists: ${catData.name}`);
                continue;
            }

            await Category.create({
                ...catData,
                userId: admin._id,
                isSystem: true,
                isPublic: true
            });
            
            console.log(`   ✅ Created: ${catData.name} (${catData.slug})`);
            created++;
        }

        console.log(`\n🎉 Created ${created} new categories!`);
        
        const total = await Category.countDocuments({ userId: admin._id, isSystem: true });
        console.log(`📊 Total system categories: ${total}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

initCategories();
