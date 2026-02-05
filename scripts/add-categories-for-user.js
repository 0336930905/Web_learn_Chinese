require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../api/models/User');
const Category = require('../api/models/Category');
const Word = require('../api/models/Word');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://profine:phamthanh123@cluster0.9pt7w.mongodb.net/learn-taiwanese?retryWrites=true&w=majority';

async function addCategoriesAndWords() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Tìm user với username nhhaoa20135
        const user = await User.findOne({ username: 'nhhaoa20135' });
        
        if (!user) {
            console.log('❌ Không tìm thấy user với username: nhhaoa20135');
            console.log('💡 Vui lòng tạo user này trước!');
            return;
        }

        console.log(`👤 Tìm thấy user: ${user.username} (${user.email})`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user._id}\n`);

        // Danh sách categories với 10 từ vựng cho mỗi category
        const categoriesData = [
            {
                category: { slug: 'numbers', name: 'Số đếm', description: 'Các số từ 0-10 và hơn', icon: '🔢', order: 1 },
                words: [
                    { chinese: '零', pinyin: 'líng', vietnamese: 'Không, số 0', example: '零度 (líng dù) - Không độ' },
                    { chinese: '一', pinyin: 'yī', vietnamese: 'Một, số 1', example: '一個 (yī gè) - Một cái' },
                    { chinese: '二', pinyin: 'èr', vietnamese: 'Hai, số 2', example: '二十 (èr shí) - Hai mươi' },
                    { chinese: '三', pinyin: 'sān', vietnamese: 'Ba, số 3', example: '三天 (sān tiān) - Ba ngày' },
                    { chinese: '四', pinyin: 'sì', vietnamese: 'Bốn, số 4', example: '四點 (sì diǎn) - Bốn giờ' },
                    { chinese: '五', pinyin: 'wǔ', vietnamese: 'Năm, số 5', example: '五分鐘 (wǔ fēn zhōng) - Năm phút' },
                    { chinese: '六', pinyin: 'liù', vietnamese: 'Sáu, số 6', example: '六月 (liù yuè) - Tháng sáu' },
                    { chinese: '七', pinyin: 'qī', vietnamese: 'Bảy, số 7', example: '七天 (qī tiān) - Bảy ngày' },
                    { chinese: '八', pinyin: 'bā', vietnamese: 'Tám, số 8', example: '八點 (bā diǎn) - Tám giờ' },
                    { chinese: '九', pinyin: 'jiǔ', vietnamese: 'Chín, số 9', example: '九個 (jiǔ gè) - Chín cái' }
                ]
            },
            {
                category: { slug: 'food', name: 'Ẩm thực', description: 'Đồ ăn và thức uống', icon: '🍜', order: 2 },
                words: [
                    { chinese: '飯', pinyin: 'fàn', vietnamese: 'Cơm, bữa ăn', example: '吃飯 (chī fàn) - Ăn cơm' },
                    { chinese: '麵', pinyin: 'miàn', vietnamese: 'Mì, mỳ', example: '麵條 (miàn tiáo) - Sợi mì' },
                    { chinese: '水', pinyin: 'shuǐ', vietnamese: 'Nước', example: '喝水 (hē shuǐ) - Uống nước' },
                    { chinese: '茶', pinyin: 'chá', vietnamese: 'Trà', example: '喝茶 (hē chá) - Uống trà' },
                    { chinese: '咖啡', pinyin: 'kāfēi', vietnamese: 'Cà phê', example: '一杯咖啡 (yī bēi kāfēi) - Một ly cà phê' },
                    { chinese: '肉', pinyin: 'ròu', vietnamese: 'Thịt', example: '豬肉 (zhū ròu) - Thịt lợn' },
                    { chinese: '菜', pinyin: 'cài', vietnamese: 'Rau, món ăn', example: '青菜 (qīng cài) - Rau xanh' },
                    { chinese: '蛋', pinyin: 'dàn', vietnamese: 'Trứng', example: '雞蛋 (jī dàn) - Trứng gà' },
                    { chinese: '魚', pinyin: 'yú', vietnamese: 'Cá', example: '吃魚 (chī yú) - Ăn cá' },
                    { chinese: '湯', pinyin: 'tāng', vietnamese: 'Súp, canh', example: '喝湯 (hē tāng) - Uống súp' }
                ]
            },
            {
                category: { slug: 'family', name: 'Gia đình', description: 'Các thành viên trong gia đình', icon: '👨‍👩‍👧‍👦', order: 3 },
                words: [
                    { chinese: '爸爸', pinyin: 'bàba', vietnamese: 'Bố, cha', example: '我爸爸 (wǒ bàba) - Bố tôi' },
                    { chinese: '媽媽', pinyin: 'māma', vietnamese: 'Mẹ', example: '我媽媽 (wǒ māma) - Mẹ tôi' },
                    { chinese: '哥哥', pinyin: 'gēge', vietnamese: 'Anh trai', example: '我哥哥 (wǒ gēge) - Anh trai tôi' },
                    { chinese: '姐姐', pinyin: 'jiějie', vietnamese: 'Chị gái', example: '我姐姐 (wǒ jiějie) - Chị gái tôi' },
                    { chinese: '弟弟', pinyin: 'dìdi', vietnamese: 'Em trai', example: '我弟弟 (wǒ dìdi) - Em trai tôi' },
                    { chinese: '妹妹', pinyin: 'mèimei', vietnamese: 'Em gái', example: '我妹妹 (wǒ mèimei) - Em gái tôi' },
                    { chinese: '爺爺', pinyin: 'yéye', vietnamese: 'Ông nội', example: '我爺爺 (wǒ yéye) - Ông nội tôi' },
                    { chinese: '奶奶', pinyin: 'nǎinai', vietnamese: 'Bà nội', example: '我奶奶 (wǒ nǎinai) - Bà nội tôi' },
                    { chinese: '兒子', pinyin: 'érzi', vietnamese: 'Con trai', example: '我的兒子 (wǒ de érzi) - Con trai tôi' },
                    { chinese: '女兒', pinyin: 'nǚ\'ér', vietnamese: 'Con gái', example: '我的女兒 (wǒ de nǚ\'ér) - Con gái tôi' }
                ]
            },
            {
                category: { slug: 'colors', name: 'Màu sắc', description: 'Các màu sắc cơ bản', icon: '🎨', order: 4 },
                words: [
                    { chinese: '紅色', pinyin: 'hóngsè', vietnamese: 'Màu đỏ', example: '紅色的花 (hóngsè de huā) - Hoa màu đỏ' },
                    { chinese: '黃色', pinyin: 'huángsè', vietnamese: 'Màu vàng', example: '黃色的太陽 (huángsè de tàiyáng) - Mặt trời màu vàng' },
                    { chinese: '藍色', pinyin: 'lánsè', vietnamese: 'Màu xanh dương', example: '藍色的天空 (lánsè de tiānkōng) - Bầu trời xanh' },
                    { chinese: '綠色', pinyin: 'lǜsè', vietnamese: 'Màu xanh lá', example: '綠色的草 (lǜsè de cǎo) - Cỏ xanh' },
                    { chinese: '白色', pinyin: 'báisè', vietnamese: 'Màu trắng', example: '白色的雲 (báisè de yún) - Đám mây trắng' },
                    { chinese: '黑色', pinyin: 'hēisè', vietnamese: 'Màu đen', example: '黑色的貓 (hēisè de māo) - Con mèo đen' },
                    { chinese: '粉紅色', pinyin: 'fěnhóngsè', vietnamese: 'Màu hồng', example: '粉紅色的花 (fěnhóngsè de huā) - Hoa màu hồng' },
                    { chinese: '橙色', pinyin: 'chéngsè', vietnamese: 'Màu cam', example: '橙色的橘子 (chéngsè de júzi) - Quả cam màu cam' },
                    { chinese: '紫色', pinyin: 'zǐsè', vietnamese: 'Màu tím', example: '紫色的葡萄 (zǐsè de pútáo) - Nho tím' },
                    { chinese: '灰色', pinyin: 'huīsè', vietnamese: 'Màu xám', example: '灰色的天氣 (huīsè de tiānqì) - Thời tiết u ám' }
                ]
            },
            {
                category: { slug: 'greetings', name: 'Chào hỏi', description: 'Các câu chào hỏi thường dùng', icon: '👋', order: 5 },
                words: [
                    { chinese: '你好', pinyin: 'nǐ hǎo', vietnamese: 'Xin chào', example: '你好嗎？(nǐ hǎo ma?) - Bạn khỏe không?' },
                    { chinese: '早安', pinyin: 'zǎo\'ān', vietnamese: 'Chào buổi sáng', example: '早安！(zǎo\'ān!) - Chào buổi sáng!' },
                    { chinese: '晚安', pinyin: 'wǎn\'ān', vietnamese: 'Chúc ngủ ngon', example: '晚安！(wǎn\'ān!) - Chúc ngủ ngon!' },
                    { chinese: '謝謝', pinyin: 'xièxie', vietnamese: 'Cảm ơn', example: '謝謝你 (xièxie nǐ) - Cảm ơn bạn' },
                    { chinese: '不客氣', pinyin: 'bù kèqi', vietnamese: 'Không có gì', example: '不客氣！(bù kèqi!) - Không có chi!' },
                    { chinese: '對不起', pinyin: 'duìbuqǐ', vietnamese: 'Xin lỗi', example: '對不起！(duìbuqǐ!) - Xin lỗi!' },
                    { chinese: '沒關係', pinyin: 'méi guānxi', vietnamese: 'Không sao', example: '沒關係 (méi guānxi) - Không sao đâu' },
                    { chinese: '再見', pinyin: 'zàijiàn', vietnamese: 'Tạm biệt', example: '再見！(zàijiàn!) - Tạm biệt!' },
                    { chinese: '請', pinyin: 'qǐng', vietnamese: 'Xin mời, làm ơn', example: '請坐 (qǐng zuò) - Mời ngồi' },
                    { chinese: '歡迎', pinyin: 'huānyíng', vietnamese: 'Chào mừng', example: '歡迎你 (huānyíng nǐ) - Chào mừng bạn' }
                ]
            }
        ];

        console.log('📁 ĐANG TẠO CATEGORIES VÀ TỪ VỰNG...\n');

        let totalCategories = 0;
        let totalWords = 0;

        for (const data of categoriesData) {
            // Kiểm tra category đã tồn tại chưa
            const existingCat = await Category.findOne({
                userId: user._id,
                slug: data.category.slug
            });

            let category;
            if (existingCat) {
                console.log(`  ⏭️  Category đã tồn tại: ${data.category.name} (${data.category.slug})`);
                category = existingCat;
            } else {
                // Tạo category mới
                category = await Category.create({
                    ...data.category,
                    userId: user._id,
                    isSystem: false,
                    isPublic: true
                });
                totalCategories++;
                console.log(`  ✅ Created category: ${category.icon} ${category.name} (${category.slug})`);
            }

            // Thêm 10 từ vựng cho category này
            console.log(`     📝 Adding 10 words to ${category.name}...`);
            
            for (const wordData of data.words) {
                // Kiểm tra từ đã tồn tại chưa
                const existingWord = await Word.findOne({
                    createdBy: user._id,
                    category: category.slug,
                    chinese: wordData.chinese
                });

                if (!existingWord) {
                    await Word.create({
                        ...wordData,
                        category: category.slug,
                        createdBy: user._id,
                        isPublic: true,
                        difficulty: 'beginner',
                        tags: [category.slug]
                    });
                    totalWords++;
                }
            }
            
            console.log(`     ✅ Added 10 words to ${category.name}\n`);
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log('📊 TỔNG KẾT:');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`👤 User: ${user.username} (${user.email})`);
        console.log(`✅ Categories tạo mới: ${totalCategories}`);
        console.log(`✅ Từ vựng tạo mới: ${totalWords}`);
        console.log('');
        console.log('🎉 HOÀN THÀNH!');
        console.log('═══════════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Chạy script
addCategoriesAndWords();
