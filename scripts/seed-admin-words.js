/**
 * Seed Admin Words Script
 * Thêm 10 từ vựng cho mỗi danh mục của admin
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../api/models/User');
const Word = require('../api/models/Word');
const Category = require('../api/models/Category');

// Sample words data for each category
const sampleWords = {
    greetings: [
        { traditional: '你好', simplified: '你好', pinyin: 'nǐ hǎo', zhuyin: 'ㄋㄧˇ ㄏㄠˇ', vietnamese: 'Xin chào', english: 'Hello', difficulty: 1 },
        { traditional: '早安', simplified: '早安', pinyin: 'zǎo ān', zhuyin: 'ㄗㄠˇ ㄢ', vietnamese: 'Chào buổi sáng', english: 'Good morning', difficulty: 1 },
        { traditional: '晚安', simplified: '晚安', pinyin: 'wǎn ān', zhuyin: 'ㄨㄢˇ ㄢ', vietnamese: 'Chúc ngủ ngon', english: 'Good night', difficulty: 1 },
        { traditional: '再見', simplified: '再见', pinyin: 'zài jiàn', zhuyin: 'ㄗㄞˋ ㄐㄧㄢˋ', vietnamese: 'Tạm biệt', english: 'Goodbye', difficulty: 1 },
        { traditional: '謝謝', simplified: '谢谢', pinyin: 'xiè xie', zhuyin: 'ㄒㄧㄝˋ ㄒㄧㄝˋ', vietnamese: 'Cảm ơn', english: 'Thank you', difficulty: 1 },
        { traditional: '對不起', simplified: '对不起', pinyin: 'duì bu qǐ', zhuyin: 'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ', vietnamese: 'Xin lỗi', english: 'Sorry', difficulty: 2 },
        { traditional: '不客氣', simplified: '不客气', pinyin: 'bù kè qi', zhuyin: 'ㄅㄨˋ ㄎㄜˋ ㄑㄧˋ', vietnamese: 'Không có gì', english: 'You\'re welcome', difficulty: 2 },
        { traditional: '請', simplified: '请', pinyin: 'qǐng', zhuyin: 'ㄑㄧㄥˇ', vietnamese: 'Xin mời / Làm ơn', english: 'Please', difficulty: 1 },
        { traditional: '歡迎', simplified: '欢迎', pinyin: 'huān yíng', zhuyin: 'ㄏㄨㄢ ㄧㄥˊ', vietnamese: 'Chào mừng', english: 'Welcome', difficulty: 2 },
        { traditional: '你好嗎', simplified: '你好吗', pinyin: 'nǐ hǎo ma', zhuyin: 'ㄋㄧˇ ㄏㄠˇ ㄇㄚ˙', vietnamese: 'Bạn khỏe không?', english: 'How are you?', difficulty: 2 }
    ],
    numbers: [
        { traditional: '一', simplified: '一', pinyin: 'yī', zhuyin: 'ㄧ', vietnamese: 'Một', english: 'One', difficulty: 1 },
        { traditional: '二', simplified: '二', pinyin: 'èr', zhuyin: 'ㄦˋ', vietnamese: 'Hai', english: 'Two', difficulty: 1 },
        { traditional: '三', simplified: '三', pinyin: 'sān', zhuyin: 'ㄙㄢ', vietnamese: 'Ba', english: 'Three', difficulty: 1 },
        { traditional: '四', simplified: '四', pinyin: 'sì', zhuyin: 'ㄙˋ', vietnamese: 'Bốn', english: 'Four', difficulty: 1 },
        { traditional: '五', simplified: '五', pinyin: 'wǔ', zhuyin: 'ㄨˇ', vietnamese: 'Năm', english: 'Five', difficulty: 1 },
        { traditional: '六', simplified: '六', pinyin: 'liù', zhuyin: 'ㄌㄧㄡˋ', vietnamese: 'Sáu', english: 'Six', difficulty: 1 },
        { traditional: '七', simplified: '七', pinyin: 'qī', zhuyin: 'ㄑㄧ', vietnamese: 'Bảy', english: 'Seven', difficulty: 1 },
        { traditional: '八', simplified: '八', pinyin: 'bā', zhuyin: 'ㄅㄚ', vietnamese: 'Tám', english: 'Eight', difficulty: 1 },
        { traditional: '九', simplified: '九', pinyin: 'jiǔ', zhuyin: 'ㄐㄧㄡˇ', vietnamese: 'Chín', english: 'Nine', difficulty: 1 },
        { traditional: '十', simplified: '十', pinyin: 'shí', zhuyin: 'ㄕˊ', vietnamese: 'Mười', english: 'Ten', difficulty: 1 }
    ],
    food: [
        { traditional: '飯', simplified: '饭', pinyin: 'fàn', zhuyin: 'ㄈㄢˋ', vietnamese: 'Cơm', english: 'Rice', difficulty: 1 },
        { traditional: '麵', simplified: '面', pinyin: 'miàn', zhuyin: 'ㄇㄧㄢˋ', vietnamese: 'Mì', english: 'Noodles', difficulty: 1 },
        { traditional: '水', simplified: '水', pinyin: 'shuǐ', zhuyin: 'ㄕㄨㄟˇ', vietnamese: 'Nước', english: 'Water', difficulty: 1 },
        { traditional: '茶', simplified: '茶', pinyin: 'chá', zhuyin: 'ㄔㄚˊ', vietnamese: 'Trà', english: 'Tea', difficulty: 1 },
        { traditional: '咖啡', simplified: '咖啡', pinyin: 'kā fēi', zhuyin: 'ㄎㄚ ㄈㄟ', vietnamese: 'Cà phê', english: 'Coffee', difficulty: 1 },
        { traditional: '肉', simplified: '肉', pinyin: 'ròu', zhuyin: 'ㄖㄡˋ', vietnamese: 'Thịt', english: 'Meat', difficulty: 1 },
        { traditional: '魚', simplified: '鱼', pinyin: 'yú', zhuyin: 'ㄩˊ', vietnamese: 'Cá', english: 'Fish', difficulty: 1 },
        { traditional: '蛋', simplified: '蛋', pinyin: 'dàn', zhuyin: 'ㄉㄢˋ', vietnamese: 'Trứng', english: 'Egg', difficulty: 1 },
        { traditional: '水果', simplified: '水果', pinyin: 'shuǐ guǒ', zhuyin: 'ㄕㄨㄟˇ ㄍㄨㄛˇ', vietnamese: 'Trái cây', english: 'Fruit', difficulty: 2 },
        { traditional: '蔬菜', simplified: '蔬菜', pinyin: 'shū cài', zhuyin: 'ㄕㄨ ㄘㄞˋ', vietnamese: 'Rau', english: 'Vegetables', difficulty: 2 }
    ],
    family: [
        { traditional: '爸爸', simplified: '爸爸', pinyin: 'bà ba', zhuyin: 'ㄅㄚˋ ㄅㄚ˙', vietnamese: 'Bố', english: 'Father', difficulty: 1 },
        { traditional: '媽媽', simplified: '妈妈', pinyin: 'mā ma', zhuyin: 'ㄇㄚ ㄇㄚ˙', vietnamese: 'Mẹ', english: 'Mother', difficulty: 1 },
        { traditional: '哥哥', simplified: '哥哥', pinyin: 'gē ge', zhuyin: 'ㄍㄜ ㄍㄜ˙', vietnamese: 'Anh trai', english: 'Older brother', difficulty: 1 },
        { traditional: '姐姐', simplified: '姐姐', pinyin: 'jiě jie', zhuyin: 'ㄐㄧㄝˇ ㄐㄧㄝ˙', vietnamese: 'Chị gái', english: 'Older sister', difficulty: 1 },
        { traditional: '弟弟', simplified: '弟弟', pinyin: 'dì di', zhuyin: 'ㄉㄧˋ ㄉㄧ˙', vietnamese: 'Em trai', english: 'Younger brother', difficulty: 1 },
        { traditional: '妹妹', simplified: '妹妹', pinyin: 'mèi mei', zhuyin: 'ㄇㄟˋ ㄇㄟ˙', vietnamese: 'Em gái', english: 'Younger sister', difficulty: 1 },
        { traditional: '爺爺', simplified: '爷爷', pinyin: 'yé ye', zhuyin: 'ㄧㄝˊ ㄧㄝ˙', vietnamese: 'Ông nội', english: 'Grandfather (paternal)', difficulty: 2 },
        { traditional: '奶奶', simplified: '奶奶', pinyin: 'nǎi nai', zhuyin: 'ㄋㄞˇ ㄋㄞ˙', vietnamese: 'Bà nội', english: 'Grandmother (paternal)', difficulty: 2 },
        { traditional: '孩子', simplified: '孩子', pinyin: 'hái zi', zhuyin: 'ㄏㄞˊ ㄗ˙', vietnamese: 'Con', english: 'Child', difficulty: 2 },
        { traditional: '家人', simplified: '家人', pinyin: 'jiā rén', zhuyin: 'ㄐㄧㄚ ㄖㄣˊ', vietnamese: 'Gia đình', english: 'Family', difficulty: 2 }
    ],
    time: [
        { traditional: '今天', simplified: '今天', pinyin: 'jīn tiān', zhuyin: 'ㄐㄧㄣ ㄊㄧㄢ', vietnamese: 'Hôm nay', english: 'Today', difficulty: 1 },
        { traditional: '明天', simplified: '明天', pinyin: 'míng tiān', zhuyin: 'ㄇㄧㄥˊ ㄊㄧㄢ', vietnamese: 'Ngày mai', english: 'Tomorrow', difficulty: 1 },
        { traditional: '昨天', simplified: '昨天', pinyin: 'zuó tiān', zhuyin: 'ㄗㄨㄛˊ ㄊㄧㄢ', vietnamese: 'Hôm qua', english: 'Yesterday', difficulty: 1 },
        { traditional: '現在', simplified: '现在', pinyin: 'xiàn zài', zhuyin: 'ㄒㄧㄢˋ ㄗㄞˋ', vietnamese: 'Bây giờ', english: 'Now', difficulty: 2 },
        { traditional: '早上', simplified: '早上', pinyin: 'zǎo shang', zhuyin: 'ㄗㄠˇ ㄕㄤ˙', vietnamese: 'Buổi sáng', english: 'Morning', difficulty: 1 },
        { traditional: '中午', simplified: '中午', pinyin: 'zhōng wǔ', zhuyin: 'ㄓㄨㄥ ㄨˇ', vietnamese: 'Buổi trưa', english: 'Noon', difficulty: 1 },
        { traditional: '晚上', simplified: '晚上', pinyin: 'wǎn shang', zhuyin: 'ㄨㄢˇ ㄕㄤ˙', vietnamese: 'Buổi tối', english: 'Evening', difficulty: 1 },
        { traditional: '星期', simplified: '星期', pinyin: 'xīng qī', zhuyin: 'ㄒㄧㄥ ㄑㄧ', vietnamese: 'Tuần', english: 'Week', difficulty: 2 },
        { traditional: '月', simplified: '月', pinyin: 'yuè', zhuyin: 'ㄩㄝˋ', vietnamese: 'Tháng', english: 'Month', difficulty: 1 },
        { traditional: '年', simplified: '年', pinyin: 'nián', zhuyin: 'ㄋㄧㄢˊ', vietnamese: 'Năm', english: 'Year', difficulty: 1 }
    ],
    places: [
        { traditional: '家', simplified: '家', pinyin: 'jiā', zhuyin: 'ㄐㄧㄚ', vietnamese: 'Nhà', english: 'Home', difficulty: 1 },
        { traditional: '學校', simplified: '学校', pinyin: 'xué xiào', zhuyin: 'ㄒㄩㄝˊ ㄒㄧㄠˋ', vietnamese: 'Trường học', english: 'School', difficulty: 1 },
        { traditional: '公司', simplified: '公司', pinyin: 'gōng sī', zhuyin: 'ㄍㄨㄥ ㄙ', vietnamese: 'Công ty', english: 'Company', difficulty: 2 },
        { traditional: '餐廳', simplified: '餐厅', pinyin: 'cān tīng', zhuyin: 'ㄘㄢ ㄊㄧㄥ', vietnamese: 'Nhà hàng', english: 'Restaurant', difficulty: 2 },
        { traditional: '醫院', simplified: '医院', pinyin: 'yī yuàn', zhuyin: 'ㄧ ㄩㄢˋ', vietnamese: 'Bệnh viện', english: 'Hospital', difficulty: 2 },
        { traditional: '銀行', simplified: '银行', pinyin: 'yín háng', zhuyin: 'ㄧㄣˊ ㄏㄤˊ', vietnamese: 'Ngân hàng', english: 'Bank', difficulty: 2 },
        { traditional: '超市', simplified: '超市', pinyin: 'chāo shì', zhuyin: 'ㄔㄠ ㄕˋ', vietnamese: 'Siêu thị', english: 'Supermarket', difficulty: 2 },
        { traditional: '車站', simplified: '车站', pinyin: 'chē zhàn', zhuyin: 'ㄔㄜ ㄓㄢˋ', vietnamese: 'Bến xe', english: 'Station', difficulty: 2 },
        { traditional: '機場', simplified: '机场', pinyin: 'jī chǎng', zhuyin: 'ㄐㄧ ㄔㄤˇ', vietnamese: 'Sân bay', english: 'Airport', difficulty: 3 },
        { traditional: '公園', simplified: '公园', pinyin: 'gōng yuán', zhuyin: 'ㄍㄨㄥ ㄩㄢˊ', vietnamese: 'Công viên', english: 'Park', difficulty: 2 }
    ],
    animals: [
        { traditional: '狗', simplified: '狗', pinyin: 'gǒu', zhuyin: 'ㄍㄡˇ', vietnamese: 'Chó', english: 'Dog', difficulty: 1 },
        { traditional: '貓', simplified: '猫', pinyin: 'māo', zhuyin: 'ㄇㄠ', vietnamese: 'Mèo', english: 'Cat', difficulty: 1 },
        { traditional: '鳥', simplified: '鸟', pinyin: 'niǎo', zhuyin: 'ㄋㄧㄠˇ', vietnamese: 'Chim', english: 'Bird', difficulty: 1 },
        { traditional: '魚', simplified: '鱼', pinyin: 'yú', zhuyin: 'ㄩˊ', vietnamese: 'Cá', english: 'Fish', difficulty: 1 },
        { traditional: '豬', simplified: '猪', pinyin: 'zhū', zhuyin: 'ㄓㄨ', vietnamese: 'Lợn', english: 'Pig', difficulty: 1 },
        { traditional: '牛', simplified: '牛', pinyin: 'niú', zhuyin: 'ㄋㄧㄡˊ', vietnamese: 'Bò', english: 'Cow', difficulty: 1 },
        { traditional: '馬', simplified: '马', pinyin: 'mǎ', zhuyin: 'ㄇㄚˇ', vietnamese: 'Ngựa', english: 'Horse', difficulty: 1 },
        { traditional: '雞', simplified: '鸡', pinyin: 'jī', zhuyin: 'ㄐㄧ', vietnamese: 'Gà', english: 'Chicken', difficulty: 1 },
        { traditional: '兔子', simplified: '兔子', pinyin: 'tù zi', zhuyin: 'ㄊㄨˋ ㄗ˙', vietnamese: 'Thỏ', english: 'Rabbit', difficulty: 2 },
        { traditional: '老虎', simplified: '老虎', pinyin: 'lǎo hǔ', zhuyin: 'ㄌㄠˇ ㄏㄨˇ', vietnamese: 'Hổ', english: 'Tiger', difficulty: 2 }
    ],
    colors: [
        { traditional: '紅色', simplified: '红色', pinyin: 'hóng sè', zhuyin: 'ㄏㄨㄥˊ ㄙㄜˋ', vietnamese: 'Màu đỏ', english: 'Red', difficulty: 1 },
        { traditional: '藍色', simplified: '蓝色', pinyin: 'lán sè', zhuyin: 'ㄌㄢˊ ㄙㄜˋ', vietnamese: 'Màu xanh dương', english: 'Blue', difficulty: 1 },
        { traditional: '黃色', simplified: '黄色', pinyin: 'huáng sè', zhuyin: 'ㄏㄨㄤˊ ㄙㄜˋ', vietnamese: 'Màu vàng', english: 'Yellow', difficulty: 1 },
        { traditional: '綠色', simplified: '绿色', pinyin: 'lǜ sè', zhuyin: 'ㄌㄩˋ ㄙㄜˋ', vietnamese: 'Màu xanh lá', english: 'Green', difficulty: 1 },
        { traditional: '黑色', simplified: '黑色', pinyin: 'hēi sè', zhuyin: 'ㄏㄟ ㄙㄜˋ', vietnamese: 'Màu đen', english: 'Black', difficulty: 1 },
        { traditional: '白色', simplified: '白色', pinyin: 'bái sè', zhuyin: 'ㄅㄞˊ ㄙㄜˋ', vietnamese: 'Màu trắng', english: 'White', difficulty: 1 },
        { traditional: '灰色', simplified: '灰色', pinyin: 'huī sè', zhuyin: 'ㄏㄨㄟ ㄙㄜˋ', vietnamese: 'Màu xám', english: 'Gray', difficulty: 1 },
        { traditional: '粉紅色', simplified: '粉红色', pinyin: 'fěn hóng sè', zhuyin: 'ㄈㄣˇ ㄏㄨㄥˊ ㄙㄜˋ', vietnamese: 'Màu hồng', english: 'Pink', difficulty: 2 },
        { traditional: '紫色', simplified: '紫色', pinyin: 'zǐ sè', zhuyin: 'ㄗˇ ㄙㄜˋ', vietnamese: 'Màu tím', english: 'Purple', difficulty: 1 },
        { traditional: '橙色', simplified: '橙色', pinyin: 'chéng sè', zhuyin: 'ㄔㄥˊ ㄙㄜˋ', vietnamese: 'Màu cam', english: 'Orange', difficulty: 1 }
    ],
    weather: [
        { traditional: '天氣', simplified: '天气', pinyin: 'tiān qì', zhuyin: 'ㄊㄧㄢ ㄑㄧˋ', vietnamese: 'Thời tiết', english: 'Weather', difficulty: 2 },
        { traditional: '晴天', simplified: '晴天', pinyin: 'qíng tiān', zhuyin: 'ㄑㄧㄥˊ ㄊㄧㄢ', vietnamese: 'Trời nắng', english: 'Sunny', difficulty: 2 },
        { traditional: '下雨', simplified: '下雨', pinyin: 'xià yǔ', zhuyin: 'ㄒㄧㄚˋ ㄩˇ', vietnamese: 'Mưa', english: 'Rain', difficulty: 2 },
        { traditional: '雪', simplified: '雪', pinyin: 'xuě', zhuyin: 'ㄒㄩㄝˇ', vietnamese: 'Tuyết', english: 'Snow', difficulty: 2 },
        { traditional: '風', simplified: '风', pinyin: 'fēng', zhuyin: 'ㄈㄥ', vietnamese: 'Gió', english: 'Wind', difficulty: 1 },
        { traditional: '雲', simplified: '云', pinyin: 'yún', zhuyin: 'ㄩㄣˊ', vietnamese: 'Mây', english: 'Cloud', difficulty: 1 },
        { traditional: '冷', simplified: '冷', pinyin: 'lěng', zhuyin: 'ㄌㄥˇ', vietnamese: 'Lạnh', english: 'Cold', difficulty: 1 },
        { traditional: '熱', simplified: '热', pinyin: 'rè', zhuyin: 'ㄖㄜˋ', vietnamese: 'Nóng', english: 'Hot', difficulty: 1 },
        { traditional: '溫度', simplified: '温度', pinyin: 'wēn dù', zhuyin: 'ㄨㄣ ㄉㄨˋ', vietnamese: 'Nhiệt độ', english: 'Temperature', difficulty: 3 },
        { traditional: '颱風', simplified: '台风', pinyin: 'tái fēng', zhuyin: 'ㄊㄞˊ ㄈㄥ', vietnamese: 'Bão', english: 'Typhoon', difficulty: 3 }
    ],
    travel: [
        { traditional: '旅行', simplified: '旅行', pinyin: 'lǚ xíng', zhuyin: 'ㄌㄩˇ ㄒㄧㄥˊ', vietnamese: 'Du lịch', english: 'Travel', difficulty: 2 },
        { traditional: '飛機', simplified: '飞机', pinyin: 'fēi jī', zhuyin: 'ㄈㄟ ㄐㄧ', vietnamese: 'Máy bay', english: 'Airplane', difficulty: 2 },
        { traditional: '火車', simplified: '火车', pinyin: 'huǒ chē', zhuyin: 'ㄏㄨㄛˇ ㄔㄜ', vietnamese: 'Tàu hỏa', english: 'Train', difficulty: 2 },
        { traditional: '公車', simplified: '公车', pinyin: 'gōng chē', zhuyin: 'ㄍㄨㄥ ㄔㄜ', vietnamese: 'Xe buýt', english: 'Bus', difficulty: 2 },
        { traditional: '計程車', simplified: '计程车', pinyin: 'jì chéng chē', zhuyin: 'ㄐㄧˋ ㄔㄥˊ ㄔㄜ', vietnamese: 'Taxi', english: 'Taxi', difficulty: 3 },
        { traditional: '捷運', simplified: '捷运', pinyin: 'jié yùn', zhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ', vietnamese: 'Tàu điện ngầm', english: 'Metro/MRT', difficulty: 3 },
        { traditional: '船', simplified: '船', pinyin: 'chuán', zhuyin: 'ㄔㄨㄢˊ', vietnamese: 'Thuyền', english: 'Boat', difficulty: 2 },
        { traditional: '飯店', simplified: '饭店', pinyin: 'fàn diàn', zhuyin: 'ㄈㄢˋ ㄉㄧㄢˋ', vietnamese: 'Khách sạn', english: 'Hotel', difficulty: 2 },
        { traditional: '護照', simplified: '护照', pinyin: 'hù zhào', zhuyin: 'ㄏㄨˋ ㄓㄠˋ', vietnamese: 'Hộ chiếu', english: 'Passport', difficulty: 3 },
        { traditional: '地圖', simplified: '地图', pinyin: 'dì tú', zhuyin: 'ㄉㄧˋ ㄊㄨˊ', vietnamese: 'Bản đồ', english: 'Map', difficulty: 2 }
    ]
};

async function seedAdminWords() {
    try {
        // Connect to MongoDB
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

        // Initialize default categories if needed
        let categories = await Category.find({ 
            userId: admin._id,
            isSystem: true 
        }).lean();
        
        console.log('✅ Found categories:', categories.length);
        
        if (categories.length < 10) {
            console.log('📁 Creating missing system categories...');
            
            const defaultCategories = [
                { slug: 'greetings', name: 'Chào hỏi', icon: '👋', description: 'Các câu chào hỏi thường dùng' },
                { slug: 'numbers', name: 'Số đếm', icon: '🔢', description: 'Các số từ 0-10 và hơn' },
                { slug: 'food', name: 'Ẩm thực', icon: '🍜', description: 'Đồ ăn và thức uống' },
                { slug: 'family', name: 'Gia đình', icon: '👨‍👩‍👧‍👦', description: 'Các thành viên trong gia đình' },
                { slug: 'time', name: 'Thời gian', icon: '⏰', description: 'Ngày tháng và thời gian' },
                { slug: 'places', name: 'Địa điểm', icon: '📍', description: 'Các địa điểm thường gặp' },
                { slug: 'animals', name: 'Động vật', icon: '🐾', description: 'Các loài động vật' },
                { slug: 'colors', name: 'Màu sắc', icon: '🎨', description: 'Các màu sắc cơ bản' },
                { slug: 'weather', name: 'Thời tiết', icon: '⛅', description: 'Thời tiết và khí hậu' },
                { slug: 'travel', name: 'Du lịch', icon: '✈️', description: 'Phương tiện và du lịch' }
            ];

            for (const catData of defaultCategories) {
                const exists = await Category.findOne({
                    userId: admin._id,
                    slug: catData.slug
                });
                
                if (!exists) {
                    await Category.create({
                        ...catData,
                        userId: admin._id,
                        isSystem: true,
                        isPublic: true,
                        order: defaultCategories.indexOf(catData)
                    });
                    console.log(`   ✅ Created category: ${catData.name}`);
                }
            }
            
            categories = await Category.find({ 
                userId: admin._id,
                isSystem: true 
            }).lean();
        }
        
        console.log('✅ Total categories:', categories.length);

        let totalAdded = 0;

        // For each category, add words
        for (const category of categories) {
            const categorySlug = category.slug;
            const wordsForCategory = sampleWords[categorySlug];

            if (!wordsForCategory) {
                console.log(`⚠️  No sample words for category: ${categorySlug}`);
                continue;
            }

            console.log(`\n📝 Adding words for category: ${category.name} (${categorySlug})`);

            // Check existing words for this category by admin
            const existingCount = await Word.countDocuments({
                createdBy: admin._id,
                category: categorySlug
            });

            if (existingCount >= 10) {
                console.log(`✅ Category already has ${existingCount} words, skipping...`);
                continue;
            }

            // Add words
            for (const wordData of wordsForCategory) {
                // Check if word already exists
                const exists = await Word.findOne({
                    createdBy: admin._id,
                    traditional: wordData.traditional,
                    category: categorySlug
                });

                if (exists) {
                    console.log(`   ⏭️  Word already exists: ${wordData.traditional}`);
                    continue;
                }

                // Create word
                const newWord = await Word.create({
                    ...wordData,
                    category: categorySlug,
                    createdBy: admin._id,
                    isPublic: true,
                    examples: []
                });

                console.log(`   ✅ Added: ${newWord.traditional} - ${newWord.vietnamese}`);
                totalAdded++;
            }
        }

        console.log(`\n🎉 Successfully added ${totalAdded} words!`);
        
        // Show summary
        const summary = await Word.aggregate([
            {
                $match: { createdBy: admin._id }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        console.log('\n📊 Summary by category:');
        for (const item of summary) {
            console.log(`   ${item._id}: ${item.count} words`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the seed
seedAdminWords();
