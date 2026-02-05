/**
 * Seed Admin Categories and Words
 * Tạo 20 categories với 10 words mỗi category cho admin user nhhaoa20135
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../api/models/User');
const Category = require('../api/models/Category');
const Word = require('../api/models/Word');

// Admin username
const ADMIN_USERNAME = 'nhhaoa20135';

// Categories data
const categoriesData = [
  {
    slug: 'chao-hoi-xa-giao',
    name: 'Chào hỏi – xã giao',
    description: 'Từ vựng chào hỏi và giao tiếp xã hội',
    icon: '👋',
    color: '#667eea',
    order: 1
  },
  {
    slug: 'dai-tu-nhan-xung',
    name: 'Đại từ nhân xưng',
    description: 'Các đại từ nhân xưng cơ bản',
    icon: '👤',
    color: '#f093fb',
    order: 2
  },
  {
    slug: 'so-dem',
    name: 'Số đếm',
    description: 'Số đếm từ 0 đến 100 và hơn',
    icon: '🔢',
    color: '#4facfe',
    order: 3
  },
  {
    slug: 'thoi-gian-ngay-thang',
    name: 'Thời gian – ngày tháng',
    description: 'Từ vựng về thời gian, ngày tháng năm',
    icon: '📅',
    color: '#43e97b',
    order: 4
  },
  {
    slug: 'gia-dinh',
    name: 'Gia đình',
    description: 'Các thành viên trong gia đình',
    icon: '👨‍👩‍👧‍👦',
    color: '#fa709a',
    order: 5
  },
  {
    slug: 'dia-diem-phuong-huong',
    name: 'Địa điểm – phương hướng',
    description: 'Từ vựng về địa điểm và phương hướng',
    icon: '🧭',
    color: '#30cfd0',
    order: 6
  },
  {
    slug: 'dong-tu-thong-dung',
    name: 'Động từ thông dụng',
    description: 'Các động từ thường dùng hàng ngày',
    icon: '⚡',
    color: '#a8edea',
    order: 7
  },
  {
    slug: 'tinh-tu-mo-ta',
    name: 'Tính từ mô tả',
    description: 'Tính từ mô tả người, vật, sự việc',
    icon: '✨',
    color: '#f5af19',
    order: 8
  },
  {
    slug: 'thuc-an-do-uong',
    name: 'Thức ăn – đồ uống',
    description: 'Từ vựng về đồ ăn và đồ uống',
    icon: '🍜',
    color: '#fbc2eb',
    order: 9
  },
  {
    slug: 'mua-sam',
    name: 'Mua sắm',
    description: 'Từ vựng dùng khi mua sắm',
    icon: '🛒',
    color: '#a1c4fd',
    order: 10
  },
  {
    slug: 'giao-thong-di-lai',
    name: 'Giao thông – đi lại',
    description: 'Phương tiện và giao thông',
    icon: '🚗',
    color: '#d299c2',
    order: 11
  },
  {
    slug: 'truong-hoc-hoc-tap',
    name: 'Trường học – học tập',
    description: 'Từ vựng về trường học và học tập',
    icon: '🏫',
    color: '#ffecd2',
    order: 12
  },
  {
    slug: 'cong-viec-nghe-nghiep',
    name: 'Công việc – nghề nghiệp',
    description: 'Từ vựng về công việc và nghề nghiệp',
    icon: '💼',
    color: '#ff9a9e',
    order: 13
  },
  {
    slug: 'cam-xuc-trang-thai',
    name: 'Cảm xúc – trạng thái',
    description: 'Từ vựng về cảm xúc và trạng thái',
    icon: '😊',
    color: '#fad0c4',
    order: 14
  },
  {
    slug: 'thoi-tiet',
    name: 'Thời tiết',
    description: 'Từ vựng mô tả thời tiết',
    icon: '🌤️',
    color: '#ffeaa7',
    order: 15
  },
  {
    slug: 'suc-khoe-co-the',
    name: 'Sức khỏe – cơ thể',
    description: 'Từ vựng về sức khỏe và các bộ phận cơ thể',
    icon: '💪',
    color: '#74b9ff',
    order: 16
  },
  {
    slug: 'hoi-duong',
    name: 'Hỏi đường',
    description: 'Từ vựng dùng khi hỏi đường',
    icon: '🗺️',
    color: '#fdcb6e',
    order: 17
  },
  {
    slug: 'goi-dien-lien-lac',
    name: 'Gọi điện – liên lạc',
    description: 'Từ vựng về gọi điện và liên lạc',
    icon: '📞',
    color: '#e17055',
    order: 18
  },
  {
    slug: 'du-lich',
    name: 'Du lịch',
    description: 'Từ vựng du lịch',
    icon: '✈️',
    color: '#00b894',
    order: 19
  },
  {
    slug: 'van-hoa-doi-song',
    name: 'Văn hóa – đời sống hằng ngày',
    description: 'Văn hóa và sinh hoạt hàng ngày',
    icon: '🎭',
    color: '#6c5ce7',
    order: 20
  }
];

// Words data for each category
const wordsData = {
  'chao-hoi-xa-giao': [
    { traditional: '你好', simplified: '你好', pinyin: 'nǐ hǎo', zhuyin: 'ㄋㄧˇ ㄏㄠˇ', vietnamese: 'Xin chào', english: 'Hello', difficulty: 1 },
    { traditional: '謝謝', simplified: '谢谢', pinyin: 'xiè xie', zhuyin: 'ㄒㄧㄝˋ ㄒㄧㄝˋ', vietnamese: 'Cảm ơn', english: 'Thank you', difficulty: 1 },
    { traditional: '不客氣', simplified: '不客气', pinyin: 'bù kè qì', zhuyin: 'ㄅㄨˋ ㄎㄜˋ ㄑㄧˋ', vietnamese: 'Không có gì', english: 'You\'re welcome', difficulty: 1 },
    { traditional: '再見', simplified: '再见', pinyin: 'zài jiàn', zhuyin: 'ㄗㄞˋ ㄐㄧㄢˋ', vietnamese: 'Tạm biệt', english: 'Goodbye', difficulty: 1 },
    { traditional: '對不起', simplified: '对不起', pinyin: 'duì bu qǐ', zhuyin: 'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ', vietnamese: 'Xin lỗi', english: 'Sorry', difficulty: 1 },
    { traditional: '早安', simplified: '早安', pinyin: 'zǎo ān', zhuyin: 'ㄗㄠˇ ㄢ', vietnamese: 'Chào buổi sáng', english: 'Good morning', difficulty: 1 },
    { traditional: '晚安', simplified: '晚安', pinyin: 'wǎn ān', zhuyin: 'ㄨㄢˇ ㄢ', vietnamese: 'Chúc ngủ ngon', english: 'Good night', difficulty: 1 },
    { traditional: '請問', simplified: '请问', pinyin: 'qǐng wèn', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ', vietnamese: 'Cho hỏi', english: 'Excuse me (to ask)', difficulty: 1 },
    { traditional: '沒關係', simplified: '没关系', pinyin: 'méi guān xi', zhuyin: 'ㄇㄟˊ ㄍㄨㄢ ㄒㄧˋ', vietnamese: 'Không sao', english: 'It\'s okay', difficulty: 1 },
    { traditional: '歡迎', simplified: '欢迎', pinyin: 'huān yíng', zhuyin: 'ㄏㄨㄢ ㄧㄥˊ', vietnamese: 'Chào mừng', english: 'Welcome', difficulty: 1 }
  ],
  'dai-tu-nhan-xung': [
    { traditional: '我', simplified: '我', pinyin: 'wǒ', zhuyin: 'ㄨㄛˇ', vietnamese: 'Tôi', english: 'I, me', difficulty: 1 },
    { traditional: '你', simplified: '你', pinyin: 'nǐ', zhuyin: 'ㄋㄧˇ', vietnamese: 'Bạn', english: 'You', difficulty: 1 },
    { traditional: '他', simplified: '他', pinyin: 'tā', zhuyin: 'ㄊㄚ', vietnamese: 'Anh ấy', english: 'He, him', difficulty: 1 },
    { traditional: '她', simplified: '她', pinyin: 'tā', zhuyin: 'ㄊㄚ', vietnamese: 'Cô ấy', english: 'She, her', difficulty: 1 },
    { traditional: '我們', simplified: '我们', pinyin: 'wǒ men', zhuyin: 'ㄨㄛˇ ㄇㄣˊ', vietnamese: 'Chúng tôi', english: 'We, us', difficulty: 1 },
    { traditional: '你們', simplified: '你们', pinyin: 'nǐ men', zhuyin: 'ㄋㄧˇ ㄇㄣˊ', vietnamese: 'Các bạn', english: 'You (plural)', difficulty: 1 },
    { traditional: '他們', simplified: '他们', pinyin: 'tā men', zhuyin: 'ㄊㄚ ㄇㄣˊ', vietnamese: 'Họ (nam)', english: 'They (male)', difficulty: 1 },
    { traditional: '她們', simplified: '她们', pinyin: 'tā men', zhuyin: 'ㄊㄚ ㄇㄣˊ', vietnamese: 'Họ (nữ)', english: 'They (female)', difficulty: 1 },
    { traditional: '這個', simplified: '这个', pinyin: 'zhè ge', zhuyin: 'ㄓㄜˋ ㄍㄜˋ', vietnamese: 'Cái này', english: 'This', difficulty: 1 },
    { traditional: '那個', simplified: '那个', pinyin: 'nà ge', zhuyin: 'ㄋㄚˋ ㄍㄜˋ', vietnamese: 'Cái kia', english: 'That', difficulty: 1 }
  ],
  'so-dem': [
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
  'thoi-gian-ngay-thang': [
    { traditional: '今天', simplified: '今天', pinyin: 'jīn tiān', zhuyin: 'ㄐㄧㄣ ㄊㄧㄢ', vietnamese: 'Hôm nay', english: 'Today', difficulty: 1 },
    { traditional: '明天', simplified: '明天', pinyin: 'míng tiān', zhuyin: 'ㄇㄧㄥˊ ㄊㄧㄢ', vietnamese: 'Ngày mai', english: 'Tomorrow', difficulty: 1 },
    { traditional: '昨天', simplified: '昨天', pinyin: 'zuó tiān', zhuyin: 'ㄗㄨㄛˊ ㄊㄧㄢ', vietnamese: 'Hôm qua', english: 'Yesterday', difficulty: 1 },
    { traditional: '現在', simplified: '现在', pinyin: 'xiàn zài', zhuyin: 'ㄒㄧㄢˋ ㄗㄞˋ', vietnamese: 'Bây giờ', english: 'Now', difficulty: 1 },
    { traditional: '星期', simplified: '星期', pinyin: 'xīng qī', zhuyin: 'ㄒㄧㄥ ㄑㄧ', vietnamese: 'Tuần', english: 'Week', difficulty: 1 },
    { traditional: '月', simplified: '月', pinyin: 'yuè', zhuyin: 'ㄩㄝˋ', vietnamese: 'Tháng', english: 'Month', difficulty: 1 },
    { traditional: '年', simplified: '年', pinyin: 'nián', zhuyin: 'ㄋㄧㄢˊ', vietnamese: 'Năm', english: 'Year', difficulty: 1 },
    { traditional: '小時', simplified: '小时', pinyin: 'xiǎo shí', zhuyin: 'ㄒㄧㄠˇ ㄕˊ', vietnamese: 'Giờ', english: 'Hour', difficulty: 1 },
    { traditional: '分鐘', simplified: '分钟', pinyin: 'fēn zhōng', zhuyin: 'ㄈㄣ ㄓㄨㄥ', vietnamese: 'Phút', english: 'Minute', difficulty: 1 },
    { traditional: '秒', simplified: '秒', pinyin: 'miǎo', zhuyin: 'ㄇㄧㄠˇ', vietnamese: 'Giây', english: 'Second', difficulty: 1 }
  ],
  'gia-dinh': [
    { traditional: '家人', simplified: '家人', pinyin: 'jiā rén', zhuyin: 'ㄐㄧㄚ ㄖㄣˊ', vietnamese: 'Gia đình', english: 'Family', difficulty: 1 },
    { traditional: '爸爸', simplified: '爸爸', pinyin: 'bà ba', zhuyin: 'ㄅㄚˋ ㄅㄚˋ', vietnamese: 'Bố', english: 'Father, dad', difficulty: 1 },
    { traditional: '媽媽', simplified: '妈妈', pinyin: 'mā ma', zhuyin: 'ㄇㄚ ㄇㄚˋ', vietnamese: 'Mẹ', english: 'Mother, mom', difficulty: 1 },
    { traditional: '哥哥', simplified: '哥哥', pinyin: 'gē ge', zhuyin: 'ㄍㄜ ㄍㄜˋ', vietnamese: 'Anh trai', english: 'Older brother', difficulty: 1 },
    { traditional: '姐姐', simplified: '姐姐', pinyin: 'jiě jie', zhuyin: 'ㄐㄧㄝˇ ㄐㄧㄝˋ', vietnamese: 'Chị gái', english: 'Older sister', difficulty: 1 },
    { traditional: '弟弟', simplified: '弟弟', pinyin: 'dì di', zhuyin: 'ㄉㄧˋ ㄉㄧˋ', vietnamese: 'Em trai', english: 'Younger brother', difficulty: 1 },
    { traditional: '妹妹', simplified: '妹妹', pinyin: 'mèi mei', zhuyin: 'ㄇㄟˋ ㄇㄟˋ', vietnamese: 'Em gái', english: 'Younger sister', difficulty: 1 },
    { traditional: '爺爺', simplified: '爷爷', pinyin: 'yé ye', zhuyin: 'ㄧㄝˊ ㄧㄝˋ', vietnamese: 'Ông (nội)', english: 'Grandfather (paternal)', difficulty: 1 },
    { traditional: '奶奶', simplified: '奶奶', pinyin: 'nǎi nai', zhuyin: 'ㄋㄞˇ ㄋㄞˋ', vietnamese: 'Bà (nội)', english: 'Grandmother (paternal)', difficulty: 1 },
    { traditional: '孩子', simplified: '孩子', pinyin: 'hái zi', zhuyin: 'ㄏㄞˊ ㄗˇ', vietnamese: 'Con cái', english: 'Child, children', difficulty: 1 }
  ],
  'dia-diem-phuong-huong': [
    { traditional: '這裡', simplified: '这里', pinyin: 'zhè lǐ', zhuyin: 'ㄓㄜˋ ㄌㄧˇ', vietnamese: 'Đây', english: 'Here', difficulty: 1 },
    { traditional: '那裡', simplified: '那里', pinyin: 'nà lǐ', zhuyin: 'ㄋㄚˋ ㄌㄧˇ', vietnamese: 'Đó', english: 'There', difficulty: 1 },
    { traditional: '前面', simplified: '前面', pinyin: 'qián miàn', zhuyin: 'ㄑㄧㄢˊ ㄇㄧㄢˋ', vietnamese: 'Phía trước', english: 'Front', difficulty: 1 },
    { traditional: '後面', simplified: '后面', pinyin: 'hòu miàn', zhuyin: 'ㄏㄡˋ ㄇㄧㄢˋ', vietnamese: 'Phía sau', english: 'Back, behind', difficulty: 1 },
    { traditional: '左邊', simplified: '左边', pinyin: 'zuǒ biān', zhuyin: 'ㄗㄨㄛˇ ㄅㄧㄢ', vietnamese: 'Bên trái', english: 'Left side', difficulty: 1 },
    { traditional: '右邊', simplified: '右边', pinyin: 'yòu biān', zhuyin: 'ㄧㄡˋ ㄅㄧㄢ', vietnamese: 'Bên phải', english: 'Right side', difficulty: 1 },
    { traditional: '上面', simplified: '上面', pinyin: 'shàng miàn', zhuyin: 'ㄕㄤˋ ㄇㄧㄢˋ', vietnamese: 'Phía trên', english: 'Above, on top', difficulty: 1 },
    { traditional: '下面', simplified: '下面', pinyin: 'xià miàn', zhuyin: 'ㄒㄧㄚˋ ㄇㄧㄢˋ', vietnamese: 'Phía dưới', english: 'Below, under', difficulty: 1 },
    { traditional: '裡面', simplified: '里面', pinyin: 'lǐ miàn', zhuyin: 'ㄌㄧˇ ㄇㄧㄢˋ', vietnamese: 'Bên trong', english: 'Inside', difficulty: 1 },
    { traditional: '外面', simplified: '外面', pinyin: 'wài miàn', zhuyin: 'ㄨㄞˋ ㄇㄧㄢˋ', vietnamese: 'Bên ngoài', english: 'Outside', difficulty: 1 }
  ],
  'dong-tu-thong-dung': [
    { traditional: '是', simplified: '是', pinyin: 'shì', zhuyin: 'ㄕˋ', vietnamese: 'Là', english: 'To be', difficulty: 1 },
    { traditional: '有', simplified: '有', pinyin: 'yǒu', zhuyin: 'ㄧㄡˇ', vietnamese: 'Có', english: 'To have', difficulty: 1 },
    { traditional: '去', simplified: '去', pinyin: 'qù', zhuyin: 'ㄑㄩˋ', vietnamese: 'Đi', english: 'To go', difficulty: 1 },
    { traditional: '來', simplified: '来', pinyin: 'lái', zhuyin: 'ㄌㄞˊ', vietnamese: 'Đến', english: 'To come', difficulty: 1 },
    { traditional: '吃', simplified: '吃', pinyin: 'chī', zhuyin: 'ㄔ', vietnamese: 'Ăn', english: 'To eat', difficulty: 1 },
    { traditional: '喝', simplified: '喝', pinyin: 'hē', zhuyin: 'ㄏㄜ', vietnamese: 'Uống', english: 'To drink', difficulty: 1 },
    { traditional: '看', simplified: '看', pinyin: 'kàn', zhuyin: 'ㄎㄢˋ', vietnamese: 'Xem, nhìn', english: 'To see, to look', difficulty: 1 },
    { traditional: '聽', simplified: '听', pinyin: 'tīng', zhuyin: 'ㄊㄧㄥ', vietnamese: 'Nghe', english: 'To listen', difficulty: 1 },
    { traditional: '說', simplified: '说', pinyin: 'shuō', zhuyin: 'ㄕㄨㄛ', vietnamese: 'Nói', english: 'To speak, to say', difficulty: 1 },
    { traditional: '做', simplified: '做', pinyin: 'zuò', zhuyin: 'ㄗㄨㄛˋ', vietnamese: 'Làm', english: 'To do, to make', difficulty: 1 }
  ],
  'tinh-tu-mo-ta': [
    { traditional: '大', simplified: '大', pinyin: 'dà', zhuyin: 'ㄉㄚˋ', vietnamese: 'To, lớn', english: 'Big, large', difficulty: 1 },
    { traditional: '小', simplified: '小', pinyin: 'xiǎo', zhuyin: 'ㄒㄧㄠˇ', vietnamese: 'Nhỏ', english: 'Small, little', difficulty: 1 },
    { traditional: '好', simplified: '好', pinyin: 'hǎo', zhuyin: 'ㄏㄠˇ', vietnamese: 'Tốt', english: 'Good', difficulty: 1 },
    { traditional: '壞', simplified: '坏', pinyin: 'huài', zhuyin: 'ㄏㄨㄞˋ', vietnamese: 'Xấu, hỏng', english: 'Bad', difficulty: 1 },
    { traditional: '新', simplified: '新', pinyin: 'xīn', zhuyin: 'ㄒㄧㄣ', vietnamese: 'Mới', english: 'New', difficulty: 1 },
    { traditional: '舊', simplified: '旧', pinyin: 'jiù', zhuyin: 'ㄐㄧㄡˋ', vietnamese: 'Cũ', english: 'Old', difficulty: 1 },
    { traditional: '高', simplified: '高', pinyin: 'gāo', zhuyin: 'ㄍㄠ', vietnamese: 'Cao', english: 'High, tall', difficulty: 1 },
    { traditional: '矮', simplified: '矮', pinyin: 'ǎi', zhuyin: 'ㄞˇ', vietnamese: 'Thấp', english: 'Short (height)', difficulty: 1 },
    { traditional: '長', simplified: '长', pinyin: 'cháng', zhuyin: 'ㄔㄤˊ', vietnamese: 'Dài', english: 'Long', difficulty: 1 },
    { traditional: '短', simplified: '短', pinyin: 'duǎn', zhuyin: 'ㄉㄨㄢˇ', vietnamese: 'Ngắn', english: 'Short (length)', difficulty: 1 }
  ],
  'thuc-an-do-uong': [
    { traditional: '飯', simplified: '饭', pinyin: 'fàn', zhuyin: 'ㄈㄢˋ', vietnamese: 'Cơm', english: 'Rice, meal', difficulty: 1 },
    { traditional: '麵', simplified: '面', pinyin: 'miàn', zhuyin: 'ㄇㄧㄢˋ', vietnamese: 'Mì', english: 'Noodles', difficulty: 1 },
    { traditional: '水', simplified: '水', pinyin: 'shuǐ', zhuyin: 'ㄕㄨㄟˇ', vietnamese: 'Nước', english: 'Water', difficulty: 1 },
    { traditional: '茶', simplified: '茶', pinyin: 'chá', zhuyin: 'ㄔㄚˊ', vietnamese: 'Trà', english: 'Tea', difficulty: 1 },
    { traditional: '咖啡', simplified: '咖啡', pinyin: 'kā fēi', zhuyin: 'ㄎㄚ ㄈㄟ', vietnamese: 'Cà phê', english: 'Coffee', difficulty: 1 },
    { traditional: '牛奶', simplified: '牛奶', pinyin: 'niú nǎi', zhuyin: 'ㄋㄧㄡˊ ㄋㄞˇ', vietnamese: 'Sữa', english: 'Milk', difficulty: 1 },
    { traditional: '肉', simplified: '肉', pinyin: 'ròu', zhuyin: 'ㄖㄡˋ', vietnamese: 'Thịt', english: 'Meat', difficulty: 1 },
    { traditional: '蔬菜', simplified: '蔬菜', pinyin: 'shū cài', zhuyin: 'ㄕㄨ ㄘㄞˋ', vietnamese: 'Rau', english: 'Vegetables', difficulty: 1 },
    { traditional: '水果', simplified: '水果', pinyin: 'shuǐ guǒ', zhuyin: 'ㄕㄨㄟˇ ㄍㄨㄛˇ', vietnamese: 'Hoa quả', english: 'Fruit', difficulty: 1 },
    { traditional: '甜點', simplified: '甜点', pinyin: 'tián diǎn', zhuyin: 'ㄊㄧㄢˊ ㄉㄧㄢˇ', vietnamese: 'Tráng miệng', english: 'Dessert', difficulty: 1 }
  ],
  'mua-sam': [
    { traditional: '買', simplified: '买', pinyin: 'mǎi', zhuyin: 'ㄇㄞˇ', vietnamese: 'Mua', english: 'To buy', difficulty: 1 },
    { traditional: '賣', simplified: '卖', pinyin: 'mài', zhuyin: 'ㄇㄞˋ', vietnamese: 'Bán', english: 'To sell', difficulty: 1 },
    { traditional: '錢', simplified: '钱', pinyin: 'qián', zhuyin: 'ㄑㄧㄢˊ', vietnamese: 'Tiền', english: 'Money', difficulty: 1 },
    { traditional: '多少', simplified: '多少', pinyin: 'duō shǎo', zhuyin: 'ㄉㄨㄛ ㄕㄠˇ', vietnamese: 'Bao nhiêu', english: 'How much, how many', difficulty: 1 },
    { traditional: '便宜', simplified: '便宜', pinyin: 'pián yi', zhuyin: 'ㄆㄧㄢˊ ㄧˊ', vietnamese: 'Rẻ', english: 'Cheap', difficulty: 1 },
    { traditional: '貴', simplified: '贵', pinyin: 'guì', zhuyin: 'ㄍㄨㄟˋ', vietnamese: 'Đắt', english: 'Expensive', difficulty: 1 },
    { traditional: '商店', simplified: '商店', pinyin: 'shāng diàn', zhuyin: 'ㄕㄤ ㄉㄧㄢˋ', vietnamese: 'Cửa hàng', english: 'Store, shop', difficulty: 1 },
    { traditional: '市場', simplified: '市场', pinyin: 'shì chǎng', zhuyin: 'ㄕˋ ㄔㄤˇ', vietnamese: 'Chợ', english: 'Market', difficulty: 1 },
    { traditional: '發票', simplified: '发票', pinyin: 'fā piào', zhuyin: 'ㄈㄚ ㄆㄧㄠˋ', vietnamese: 'Hóa đơn', english: 'Receipt, invoice', difficulty: 1 },
    { traditional: '找錢', simplified: '找钱', pinyin: 'zhǎo qián', zhuyin: 'ㄓㄠˇ ㄑㄧㄢˊ', vietnamese: 'Tiền thối', english: 'Change (money)', difficulty: 1 }
  ],
  'giao-thong-di-lai': [
    { traditional: '車', simplified: '车', pinyin: 'chē', zhuyin: 'ㄔㄜ', vietnamese: 'Xe', english: 'Car, vehicle', difficulty: 1 },
    { traditional: '公車', simplified: '公车', pinyin: 'gōng chē', zhuyin: 'ㄍㄨㄥ ㄔㄜ', vietnamese: 'Xe buýt', english: 'Bus', difficulty: 1 },
    { traditional: '捷運', simplified: '捷运', pinyin: 'jié yùn', zhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ', vietnamese: 'Tàu điện ngầm', english: 'Metro, MRT', difficulty: 1 },
    { traditional: '計程車', simplified: '计程车', pinyin: 'jì chéng chē', zhuyin: 'ㄐㄧˋ ㄔㄥˊ ㄔㄜ', vietnamese: 'Taxi', english: 'Taxi', difficulty: 1 },
    { traditional: '機車', simplified: '机车', pinyin: 'jī chē', zhuyin: 'ㄐㄧ ㄔㄜ', vietnamese: 'Xe máy', english: 'Motorcycle, scooter', difficulty: 1 },
    { traditional: '腳踏車', simplified: '脚踏车', pinyin: 'jiǎo tà chē', zhuyin: 'ㄐㄧㄠˇ ㄊㄚˋ ㄔㄜ', vietnamese: 'Xe đạp', english: 'Bicycle', difficulty: 1 },
    { traditional: '飛機', simplified: '飞机', pinyin: 'fēi jī', zhuyin: 'ㄈㄟ ㄐㄧ', vietnamese: 'Máy bay', english: 'Airplane', difficulty: 1 },
    { traditional: '火車', simplified: '火车', pinyin: 'huǒ chē', zhuyin: 'ㄏㄨㄛˇ ㄔㄜ', vietnamese: 'Tàu hỏa', english: 'Train', difficulty: 1 },
    { traditional: '站', simplified: '站', pinyin: 'zhàn', zhuyin: 'ㄓㄢˋ', vietnamese: 'Trạm, ga', english: 'Station, stop', difficulty: 1 },
    { traditional: '票', simplified: '票', pinyin: 'piào', zhuyin: 'ㄆㄧㄠˋ', vietnamese: 'Vé', english: 'Ticket', difficulty: 1 }
  ],
  'truong-hoc-hoc-tap': [
    { traditional: '學校', simplified: '学校', pinyin: 'xué xiào', zhuyin: 'ㄒㄩㄝˊ ㄒㄧㄠˋ', vietnamese: 'Trường học', english: 'School', difficulty: 1 },
    { traditional: '學生', simplified: '学生', pinyin: 'xué shēng', zhuyin: 'ㄒㄩㄝˊ ㄕㄥ', vietnamese: 'Học sinh', english: 'Student', difficulty: 1 },
    { traditional: '老師', simplified: '老师', pinyin: 'lǎo shī', zhuyin: 'ㄌㄠˇ ㄕ', vietnamese: 'Giáo viên', english: 'Teacher', difficulty: 1 },
    { traditional: '書', simplified: '书', pinyin: 'shū', zhuyin: 'ㄕㄨ', vietnamese: 'Sách', english: 'Book', difficulty: 1 },
    { traditional: '課', simplified: '课', pinyin: 'kè', zhuyin: 'ㄎㄜˋ', vietnamese: 'Bài học', english: 'Class, lesson', difficulty: 1 },
    { traditional: '作業', simplified: '作业', pinyin: 'zuò yè', zhuyin: 'ㄗㄨㄛˋ ㄧㄝˋ', vietnamese: 'Bài tập về nhà', english: 'Homework', difficulty: 1 },
    { traditional: '考試', simplified: '考试', pinyin: 'kǎo shì', zhuyin: 'ㄎㄠˇ ㄕˋ', vietnamese: 'Thi', english: 'Exam, test', difficulty: 1 },
    { traditional: '教室', simplified: '教室', pinyin: 'jiào shì', zhuyin: 'ㄐㄧㄠˋ ㄕˋ', vietnamese: 'Phòng học', english: 'Classroom', difficulty: 1 },
    { traditional: '圖書館', simplified: '图书馆', pinyin: 'tú shū guǎn', zhuyin: 'ㄊㄨˊ ㄕㄨ ㄍㄨㄢˇ', vietnamese: 'Thư viện', english: 'Library', difficulty: 1 },
    { traditional: '筆', simplified: '笔', pinyin: 'bǐ', zhuyin: 'ㄅㄧˇ', vietnamese: 'Bút', english: 'Pen', difficulty: 1 }
  ],
  'cong-viec-nghe-nghiep': [
    { traditional: '工作', simplified: '工作', pinyin: 'gōng zuò', zhuyin: 'ㄍㄨㄥ ㄗㄨㄛˋ', vietnamese: 'Công việc', english: 'Work, job', difficulty: 1 },
    { traditional: '公司', simplified: '公司', pinyin: 'gōng sī', zhuyin: 'ㄍㄨㄥ ㄙ', vietnamese: 'Công ty', english: 'Company', difficulty: 1 },
    { traditional: '醫生', simplified: '医生', pinyin: 'yī shēng', zhuyin: 'ㄧ ㄕㄥ', vietnamese: 'Bác sĩ', english: 'Doctor', difficulty: 1 },
    { traditional: '護士', simplified: '护士', pinyin: 'hù shi', zhuyin: 'ㄏㄨˋ ㄕˋ', vietnamese: 'Y tá', english: 'Nurse', difficulty: 1 },
    { traditional: '警察', simplified: '警察', pinyin: 'jǐng chá', zhuyin: 'ㄐㄧㄥˇ ㄔㄚˊ', vietnamese: 'Cảnh sát', english: 'Police', difficulty: 1 },
    { traditional: '律師', simplified: '律师', pinyin: 'lǜ shī', zhuyin: 'ㄌㄩˋ ㄕ', vietnamese: 'Luật sư', english: 'Lawyer', difficulty: 1 },
    { traditional: '工程師', simplified: '工程师', pinyin: 'gōng chéng shī', zhuyin: 'ㄍㄨㄥ ㄔㄥˊ ㄕ', vietnamese: 'Kỹ sư', english: 'Engineer', difficulty: 1 },
    { traditional: '廚師', simplified: '厨师', pinyin: 'chú shī', zhuyin: 'ㄔㄨˊ ㄕ', vietnamese: 'Đầu bếp', english: 'Chef', difficulty: 1 },
    { traditional: '服務員', simplified: '服务员', pinyin: 'fú wù yuán', zhuyin: 'ㄈㄨˊ ㄨˋ ㄩㄢˊ', vietnamese: 'Nhân viên phục vụ', english: 'Waiter, service staff', difficulty: 1 },
    { traditional: '經理', simplified: '经理', pinyin: 'jīng lǐ', zhuyin: 'ㄐㄧㄥ ㄌㄧˇ', vietnamese: 'Quản lý', english: 'Manager', difficulty: 1 }
  ],
  'cam-xuc-trang-thai': [
    { traditional: '高興', simplified: '高兴', pinyin: 'gāo xìng', zhuyin: 'ㄍㄠ ㄒㄧㄥˋ', vietnamese: 'Vui', english: 'Happy', difficulty: 1 },
    { traditional: '快樂', simplified: '快乐', pinyin: 'kuài lè', zhuyin: 'ㄎㄨㄞˋ ㄌㄜˋ', vietnamese: 'Hạnh phúc', english: 'Happy, joyful', difficulty: 1 },
    { traditional: '難過', simplified: '难过', pinyin: 'nán guò', zhuyin: 'ㄋㄢˊ ㄍㄨㄛˋ', vietnamese: 'Buồn', english: 'Sad', difficulty: 1 },
    { traditional: '生氣', simplified: '生气', pinyin: 'shēng qì', zhuyin: 'ㄕㄥ ㄑㄧˋ', vietnamese: 'Giận', english: 'Angry', difficulty: 1 },
    { traditional: '害怕', simplified: '害怕', pinyin: 'hài pà', zhuyin: 'ㄏㄞˋ ㄆㄚˋ', vietnamese: 'Sợ', english: 'Afraid', difficulty: 1 },
    { traditional: '累', simplified: '累', pinyin: 'lèi', zhuyin: 'ㄌㄟˋ', vietnamese: 'Mệt', english: 'Tired', difficulty: 1 },
    { traditional: '餓', simplified: '饿', pinyin: 'è', zhuyin: 'ㄜˋ', vietnamese: 'Đói', english: 'Hungry', difficulty: 1 },
    { traditional: '渴', simplified: '渴', pinyin: 'kě', zhuyin: 'ㄎㄜˇ', vietnamese: 'Khát', english: 'Thirsty', difficulty: 1 },
    { traditional: '冷', simplified: '冷', pinyin: 'lěng', zhuyin: 'ㄌㄥˇ', vietnamese: 'Lạnh', english: 'Cold', difficulty: 1 },
    { traditional: '熱', simplified: '热', pinyin: 'rè', zhuyin: 'ㄖㄜˋ', vietnamese: 'Nóng', english: 'Hot', difficulty: 1 }
  ],
  'thoi-tiet': [
    { traditional: '天氣', simplified: '天气', pinyin: 'tiān qì', zhuyin: 'ㄊㄧㄢ ㄑㄧˋ', vietnamese: 'Thời tiết', english: 'Weather', difficulty: 1 },
    { traditional: '晴天', simplified: '晴天', pinyin: 'qíng tiān', zhuyin: 'ㄑㄧㄥˊ ㄊㄧㄢ', vietnamese: 'Trời nắng', english: 'Sunny day', difficulty: 1 },
    { traditional: '陰天', simplified: '阴天', pinyin: 'yīn tiān', zhuyin: 'ㄧㄣ ㄊㄧㄢ', vietnamese: 'Trời u ám', english: 'Cloudy day', difficulty: 1 },
    { traditional: '下雨', simplified: '下雨', pinyin: 'xià yǔ', zhuyin: 'ㄒㄧㄚˋ ㄩˇ', vietnamese: 'Mưa', english: 'To rain', difficulty: 1 },
    { traditional: '颱風', simplified: '台风', pinyin: 'tái fēng', zhuyin: 'ㄊㄞˊ ㄈㄥ', vietnamese: 'Bão', english: 'Typhoon', difficulty: 1 },
    { traditional: '風', simplified: '风', pinyin: 'fēng', zhuyin: 'ㄈㄥ', vietnamese: 'Gió', english: 'Wind', difficulty: 1 },
    { traditional: '雪', simplified: '雪', pinyin: 'xuě', zhuyin: 'ㄒㄩㄝˇ', vietnamese: 'Tuyết', english: 'Snow', difficulty: 1 },
    { traditional: '溫度', simplified: '温度', pinyin: 'wēn dù', zhuyin: 'ㄨㄣ ㄉㄨˋ', vietnamese: 'Nhiệt độ', english: 'Temperature', difficulty: 1 },
    { traditional: '濕', simplified: '湿', pinyin: 'shī', zhuyin: 'ㄕ', vietnamese: 'Ẩm', english: 'Humid, wet', difficulty: 1 },
    { traditional: '乾', simplified: '干', pinyin: 'gān', zhuyin: 'ㄍㄢ', vietnamese: 'Khô', english: 'Dry', difficulty: 1 }
  ],
  'suc-khoe-co-the': [
    { traditional: '身體', simplified: '身体', pinyin: 'shēn tǐ', zhuyin: 'ㄕㄣ ㄊㄧˇ', vietnamese: 'Cơ thể', english: 'Body', difficulty: 1 },
    { traditional: '頭', simplified: '头', pinyin: 'tóu', zhuyin: 'ㄊㄡˊ', vietnamese: 'Đầu', english: 'Head', difficulty: 1 },
    { traditional: '眼睛', simplified: '眼睛', pinyin: 'yǎn jing', zhuyin: 'ㄧㄢˇ ㄐㄧㄥˋ', vietnamese: 'Mắt', english: 'Eyes', difficulty: 1 },
    { traditional: '耳朵', simplified: '耳朵', pinyin: 'ěr duo', zhuyin: 'ㄦˇ ㄉㄨㄛˋ', vietnamese: 'Tai', english: 'Ears', difficulty: 1 },
    { traditional: '鼻子', simplified: '鼻子', pinyin: 'bí zi', zhuyin: 'ㄅㄧˊ ㄗˇ', vietnamese: 'Mũi', english: 'Nose', difficulty: 1 },
    { traditional: '嘴巴', simplified: '嘴巴', pinyin: 'zuǐ ba', zhuyin: 'ㄗㄨㄟˇ ㄅㄚˋ', vietnamese: 'Miệng', english: 'Mouth', difficulty: 1 },
    { traditional: '手', simplified: '手', pinyin: 'shǒu', zhuyin: 'ㄕㄡˇ', vietnamese: 'Tay', english: 'Hand', difficulty: 1 },
    { traditional: '腳', simplified: '脚', pinyin: 'jiǎo', zhuyin: 'ㄐㄧㄠˇ', vietnamese: 'Chân', english: 'Foot, leg', difficulty: 1 },
    { traditional: '病', simplified: '病', pinyin: 'bìng', zhuyin: 'ㄅㄧㄥˋ', vietnamese: 'Bệnh', english: 'Sick, illness', difficulty: 1 },
    { traditional: '醫院', simplified: '医院', pinyin: 'yī yuàn', zhuyin: 'ㄧ ㄩㄢˋ', vietnamese: 'Bệnh viện', english: 'Hospital', difficulty: 1 }
  ],
  'hoi-duong': [
    { traditional: '在哪裡', simplified: '在哪里', pinyin: 'zài nǎ lǐ', zhuyin: 'ㄗㄞˋ ㄋㄚˇ ㄌㄧˇ', vietnamese: 'Ở đâu', english: 'Where (at)', difficulty: 1 },
    { traditional: '怎麼走', simplified: '怎么走', pinyin: 'zěn me zǒu', zhuyin: 'ㄗㄣˇ ㄇㄜˊ ㄗㄡˇ', vietnamese: 'Đi thế nào', english: 'How to go', difficulty: 1 },
    { traditional: '直走', simplified: '直走', pinyin: 'zhí zǒu', zhuyin: 'ㄓˊ ㄗㄡˇ', vietnamese: 'Đi thẳng', english: 'Go straight', difficulty: 1 },
    { traditional: '轉彎', simplified: '转弯', pinyin: 'zhuǎn wān', zhuyin: 'ㄓㄨㄢˇ ㄨㄢ', vietnamese: 'Rẽ', english: 'Turn', difficulty: 1 },
    { traditional: '左轉', simplified: '左转', pinyin: 'zuǒ zhuǎn', zhuyin: 'ㄗㄨㄛˇ ㄓㄨㄢˇ', vietnamese: 'Rẽ trái', english: 'Turn left', difficulty: 1 },
    { traditional: '右轉', simplified: '右转', pinyin: 'yòu zhuǎn', zhuyin: 'ㄧㄡˋ ㄓㄨㄢˇ', vietnamese: 'Rẽ phải', english: 'Turn right', difficulty: 1 },
    { traditional: '路', simplified: '路', pinyin: 'lù', zhuyin: 'ㄌㄨˋ', vietnamese: 'Đường', english: 'Road', difficulty: 1 },
    { traditional: '街', simplified: '街', pinyin: 'jiē', zhuyin: 'ㄐㄧㄝ', vietnamese: 'Phố', english: 'Street', difficulty: 1 },
    { traditional: '遠', simplified: '远', pinyin: 'yuǎn', zhuyin: 'ㄩㄢˇ', vietnamese: 'Xa', english: 'Far', difficulty: 1 },
    { traditional: '近', simplified: '近', pinyin: 'jìn', zhuyin: 'ㄐㄧㄣˋ', vietnamese: 'Gần', english: 'Near', difficulty: 1 }
  ],
  'goi-dien-lien-lac': [
    { traditional: '電話', simplified: '电话', pinyin: 'diàn huà', zhuyin: 'ㄉㄧㄢˋ ㄏㄨㄚˋ', vietnamese: 'Điện thoại', english: 'Telephone', difficulty: 1 },
    { traditional: '打電話', simplified: '打电话', pinyin: 'dǎ diàn huà', zhuyin: 'ㄉㄚˇ ㄉㄧㄢˋ ㄏㄨㄚˋ', vietnamese: 'Gọi điện', english: 'To make a call', difficulty: 1 },
    { traditional: '手機', simplified: '手机', pinyin: 'shǒu jī', zhuyin: 'ㄕㄡˇ ㄐㄧ', vietnamese: 'Điện thoại di động', english: 'Mobile phone', difficulty: 1 },
    { traditional: '號碼', simplified: '号码', pinyin: 'hào mǎ', zhuyin: 'ㄏㄠˋ ㄇㄚˇ', vietnamese: 'Số', english: 'Number', difficulty: 1 },
    { traditional: '簡訊', simplified: '简讯', pinyin: 'jiǎn xùn', zhuyin: 'ㄐㄧㄢˇ ㄒㄩㄣˋ', vietnamese: 'Tin nhắn', english: 'Text message', difficulty: 1 },
    { traditional: '電子郵件', simplified: '电子邮件', pinyin: 'diàn zǐ yóu jiàn', zhuyin: 'ㄉㄧㄢˋ ㄗˇ ㄧㄡˊ ㄐㄧㄢˋ', vietnamese: 'Email', english: 'Email', difficulty: 1 },
    { traditional: '網路', simplified: '网路', pinyin: 'wǎng lù', zhuyin: 'ㄨㄤˇ ㄌㄨˋ', vietnamese: 'Mạng internet', english: 'Internet', difficulty: 1 },
    { traditional: '地址', simplified: '地址', pinyin: 'dì zhǐ', zhuyin: 'ㄉㄧˋ ㄓˇ', vietnamese: 'Địa chỉ', english: 'Address', difficulty: 1 },
    { traditional: '聯絡', simplified: '联络', pinyin: 'lián luò', zhuyin: 'ㄌㄧㄢˊ ㄌㄨㄛˋ', vietnamese: 'Liên lạc', english: 'Contact', difficulty: 1 },
    { traditional: '等一下', simplified: '等一下', pinyin: 'děng yī xià', zhuyin: 'ㄉㄥˇ ㄧ ㄒㄧㄚˋ', vietnamese: 'Đợi một chút', english: 'Wait a moment', difficulty: 1 }
  ],
  'du-lich': [
    { traditional: '旅遊', simplified: '旅游', pinyin: 'lǚ yóu', zhuyin: 'ㄌㄩˇ ㄧㄡˊ', vietnamese: 'Du lịch', english: 'Travel, tourism', difficulty: 1 },
    { traditional: '飯店', simplified: '饭店', pinyin: 'fàn diàn', zhuyin: 'ㄈㄢˋ ㄉㄧㄢˋ', vietnamese: 'Khách sạn', english: 'Hotel', difficulty: 1 },
    { traditional: '旅館', simplified: '旅馆', pinyin: 'lǚ guǎn', zhuyin: 'ㄌㄩˇ ㄍㄨㄢˇ', vietnamese: 'Nhà nghỉ', english: 'Inn, guesthouse', difficulty: 1 },
    { traditional: '房間', simplified: '房间', pinyin: 'fáng jiān', zhuyin: 'ㄈㄤˊ ㄐㄧㄢ', vietnamese: 'Phòng', english: 'Room', difficulty: 1 },
    { traditional: '預訂', simplified: '预订', pinyin: 'yù dìng', zhuyin: 'ㄩˋ ㄉㄧㄥˋ', vietnamese: 'Đặt trước', english: 'To book, to reserve', difficulty: 1 },
    { traditional: '護照', simplified: '护照', pinyin: 'hù zhào', zhuyin: 'ㄏㄨˋ ㄓㄠˋ', vietnamese: 'Hộ chiếu', english: 'Passport', difficulty: 1 },
    { traditional: '簽證', simplified: '签证', pinyin: 'qiān zhèng', zhuyin: 'ㄑㄧㄢ ㄓㄥˋ', vietnamese: 'Visa', english: 'Visa', difficulty: 1 },
    { traditional: '行李', simplified: '行李', pinyin: 'xíng li', zhuyin: 'ㄒㄧㄥˊ ㄌㄧˋ', vietnamese: 'Hành lý', english: 'Luggage', difficulty: 1 },
    { traditional: '景點', simplified: '景点', pinyin: 'jǐng diǎn', zhuyin: 'ㄐㄧㄥˇ ㄉㄧㄢˇ', vietnamese: 'Điểm du lịch', english: 'Tourist spot', difficulty: 1 },
    { traditional: '導遊', simplified: '导游', pinyin: 'dǎo yóu', zhuyin: 'ㄉㄠˇ ㄧㄡˊ', vietnamese: 'Hướng dẫn viên', english: 'Tour guide', difficulty: 1 }
  ],
  'van-hoa-doi-song': [
    { traditional: '文化', simplified: '文化', pinyin: 'wén huà', zhuyin: 'ㄨㄣˊ ㄏㄨㄚˋ', vietnamese: 'Văn hóa', english: 'Culture', difficulty: 1 },
    { traditional: '習俗', simplified: '习俗', pinyin: 'xí sú', zhuyin: 'ㄒㄧˊ ㄙㄨˊ', vietnamese: 'Phong tục', english: 'Custom', difficulty: 1 },
    { traditional: '節日', simplified: '节日', pinyin: 'jié rì', zhuyin: 'ㄐㄧㄝˊ ㄖˋ', vietnamese: 'Ngày lễ', english: 'Festival, holiday', difficulty: 1 },
    { traditional: '春節', simplified: '春节', pinyin: 'chūn jié', zhuyin: 'ㄔㄨㄣ ㄐㄧㄝˊ', vietnamese: 'Tết Nguyên Đán', english: 'Chinese New Year', difficulty: 1 },
    { traditional: '中秋節', simplified: '中秋节', pinyin: 'zhōng qiū jié', zhuyin: 'ㄓㄨㄥ ㄑㄧㄡ ㄐㄧㄝˊ', vietnamese: 'Tết Trung Thu', english: 'Mid-Autumn Festival', difficulty: 1 },
    { traditional: '端午節', simplified: '端午节', pinyin: 'duān wǔ jié', zhuyin: 'ㄉㄨㄢ ㄨˇ ㄐㄧㄝˊ', vietnamese: 'Tết Đoan Ngọ', english: 'Dragon Boat Festival', difficulty: 1 },
    { traditional: '夜市', simplified: '夜市', pinyin: 'yè shì', zhuyin: 'ㄧㄝˋ ㄕˋ', vietnamese: 'Chợ đêm', english: 'Night market', difficulty: 1 },
    { traditional: '寺廟', simplified: '寺庙', pinyin: 'sì miào', zhuyin: 'ㄙˋ ㄇㄧㄠˋ', vietnamese: 'Chùa', english: 'Temple', difficulty: 1 },
    { traditional: '拜拜', simplified: '拜拜', pinyin: 'bài bài', zhuyin: 'ㄅㄞˋ ㄅㄞˋ', vietnamese: 'Lạy/cúng', english: 'To worship', difficulty: 1 },
    { traditional: '茶道', simplified: '茶道', pinyin: 'chá dào', zhuyin: 'ㄔㄚˊ ㄉㄠˋ', vietnamese: 'Trà đạo', english: 'Tea ceremony', difficulty: 1 }
  ]
};

// Main function
async function seedData() {
  try {
    console.log('🚀 Starting seed process...');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taiwanese_learning';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ username: ADMIN_USERNAME });
    if (!adminUser) {
      console.error(`❌ Admin user "${ADMIN_USERNAME}" not found!`);
      console.log('Please create the admin user first.');
      process.exit(1);
    }
    console.log(`✅ Found admin user: ${adminUser.username} (${adminUser._id})`);

    let categoriesCreated = 0;
    let wordsCreated = 0;

    // Create categories and words
    for (const catData of categoriesData) {
      // Check if category already exists
      const existingCategory = await Category.findOne({
        userId: adminUser._id,
        slug: catData.slug
      });

      let category;
      if (existingCategory) {
        console.log(`⚠️  Category "${catData.name}" already exists, skipping...`);
        category = existingCategory;
      } else {
        // Create category
        category = await Category.create({
          ...catData,
          userId: adminUser._id,
          isPublic: true,
          isSystem: false
        });
        categoriesCreated++;
        console.log(`✅ Created category: ${category.name} (${category.slug})`);
      }

      // Create words for this category
      const words = wordsData[catData.slug] || [];
      for (const wordData of words) {
        // Check if word already exists
        const existingWord = await Word.findOne({
          createdBy: adminUser._id,
          traditional: wordData.traditional,
          category: category.slug
        });

        if (existingWord) {
          console.log(`  ⚠️  Word "${wordData.traditional}" already exists in category, skipping...`);
        } else {
          await Word.create({
            ...wordData,
            category: category.slug,
            createdBy: adminUser._id,
            isPublic: true
          });
          wordsCreated++;
          console.log(`  ✅ Created word: ${wordData.traditional} - ${wordData.vietnamese}`);
        }
      }
    }

    console.log('\n════════════════════════════════════════');
    console.log('🎉 SEED COMPLETED SUCCESSFULLY!');
    console.log('════════════════════════════════════════');
    console.log(`📁 Categories created: ${categoriesCreated}`);
    console.log(`📖 Words created: ${wordsCreated}`);
    console.log(`👤 Admin user: ${adminUser.username}`);
    console.log('════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run seed
seedData();
