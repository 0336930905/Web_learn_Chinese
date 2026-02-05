/**
 * Script to check empty categories for admin@example.com
 * Usage: node scripts/check-empty-categories.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const User = require('../api/models/User');
const Category = require('../api/models/Category');
const Word = require('../api/models/Word');

async function checkEmptyCategories() {
    try {
        // Connect to MongoDB
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find admin user
        const adminEmail = 'admin@example.com';
        const admin = await User.findOne({ email: adminEmail });
        
        if (!admin) {
            console.log('❌ Admin user not found!');
            process.exit(1);
        }

        console.log(`👤 Found admin: ${admin.email} (ID: ${admin._id})\n`);

        // Get all categories of admin
        const categories = await Category.find({ userId: admin._id })
            .sort({ order: 1, createdAt: 1 })
            .lean();

        console.log(`📁 Total categories: ${categories.length}\n`);
        console.log('═══════════════════════════════════════════════════════════════');

        // Check each category for words
        const emptyCategories = [];
        const categoriesWithWords = [];

        for (const category of categories) {
            const wordCount = await Word.countDocuments({
                createdBy: admin._id,
                category: category.slug
            });

            const status = {
                ...category,
                wordCount
            };

            if (wordCount === 0) {
                emptyCategories.push(status);
            } else {
                categoriesWithWords.push(status);
            }
        }

        // Display empty categories
        console.log('\n🚫 DANH MỤC KHÔNG CÓ TỪ VỰNG:');
        console.log('═══════════════════════════════════════════════════════════════\n');

        if (emptyCategories.length === 0) {
            console.log('✅ Tất cả danh mục đều có từ vựng!\n');
        } else {
            emptyCategories.forEach((cat, index) => {
                console.log(`${index + 1}. ${cat.icon || '📁'} ${cat.name}`);
                console.log(`   Slug: ${cat.slug}`);
                console.log(`   ID: ${cat._id}`);
                console.log(`   System: ${cat.isSystem ? 'Yes' : 'No'}`);
                console.log(`   Description: ${cat.description || 'N/A'}`);
                console.log('');
            });
            console.log(`📊 Tổng: ${emptyCategories.length} danh mục trống\n`);
        }

        // Display categories with words
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('\n✅ DANH MỤC CÓ TỪ VỰNG:');
        console.log('═══════════════════════════════════════════════════════════════\n');

        if (categoriesWithWords.length === 0) {
            console.log('❌ Không có danh mục nào có từ vựng!\n');
        } else {
            categoriesWithWords.forEach((cat, index) => {
                console.log(`${index + 1}. ${cat.icon || '📁'} ${cat.name} - ${cat.wordCount} từ`);
                console.log(`   Slug: ${cat.slug}`);
                console.log(`   ID: ${cat._id}`);
                console.log('');
            });
            console.log(`📊 Tổng: ${categoriesWithWords.length} danh mục có từ\n`);
        }

        // Summary
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('\n📈 TỔNG KẾT:');
        console.log('═══════════════════════════════════════════════════════════════\n');
        console.log(`• Tổng danh mục: ${categories.length}`);
        console.log(`• Danh mục có từ: ${categoriesWithWords.length}`);
        console.log(`• Danh mục trống: ${emptyCategories.length}`);
        
        const totalWords = categoriesWithWords.reduce((sum, cat) => sum + cat.wordCount, 0);
        console.log(`• Tổng từ vựng: ${totalWords}`);
        console.log('');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the script
checkEmptyCategories();
