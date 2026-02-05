/**
 * Seed Intermediate Level Categories and Words
 * Tạo 20 categories trung cấp với 10 words mỗi category cho admin user nhhaoa20135
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../api/models/User');
const Category = require('../api/models/Category');
const Word = require('../api/models/Word');

// Admin username
const ADMIN_USERNAME = 'nhhaoa20135';

// Categories data - Intermediate Level
const categoriesData = [
  {
    slug: 'thanh-ngu-quan-ngu',
    name: 'Thành ngữ – quán ngữ thông dụng',
    description: 'Các thành ngữ và quán ngữ thường dùng trong tiếng Trung',
    icon: '📜',
    color: '#667eea',
    order: 21
  },
  {
    slug: 'ngu-dieu-bien-dieu',
    name: 'Ngữ điệu – biến điệu thanh điệu',
    description: 'Học về ngữ điệu và biến đổi thanh điệu',
    icon: '🎵',
    color: '#f093fb',
    order: 22
  },
  {
    slug: 'cau-truc-nang-cao',
    name: 'Cấu trúc câu nâng cao',
    description: 'Các cấu trúc câu phức tạp trong tiếng Trung',
    icon: '🏗️',
    color: '#4facfe',
    order: 23
  },
  {
    slug: 'hoi-thoai-cong-viec',
    name: 'Hội thoại trong công việc',
    description: 'Giao tiếp trong môi trường làm việc',
    icon: '💼',
    color: '#43e97b',
    order: 24
  },
  {
    slug: 'giao-tiep-cong-so',
    name: 'Giao tiếp nơi công sở',
    description: 'Từ vựng giao tiếp văn phòng',
    icon: '🏢',
    color: '#fa709a',
    order: 25
  },
  {
    slug: 'dam-phan-thuong-luong',
    name: 'Đàm phán – thương lượng',
    description: 'Kỹ năng đàm phán và thương lượng',
    icon: '🤝',
    color: '#30cfd0',
    order: 26
  },
  {
    slug: 'cam-xuc-phuc-tap',
    name: 'Cảm xúc phức tạp',
    description: 'Diễn đạt các cảm xúc phức tạp',
    icon: '❤️',
    color: '#a8edea',
    order: 27
  },
  {
    slug: 'y-kien-quan-diem',
    name: 'Ý kiến – quan điểm cá nhân',
    description: 'Bày tỏ ý kiến và quan điểm',
    icon: '💭',
    color: '#f5af19',
    order: 28
  },
  {
    slug: 'ke-chuyen-tuong-thuat',
    name: 'Kể chuyện – tường thuật',
    description: 'Kỹ năng kể chuyện và tường thuật sự kiện',
    icon: '📖',
    color: '#fbc2eb',
    order: 29
  },
  {
    slug: 'so-sanh-nhan-manh',
    name: 'So sánh – nhấn mạnh',
    description: 'Cách so sánh và nhấn mạnh trong tiếng Trung',
    icon: '⚖️',
    color: '#a1c4fd',
    order: 30
  },
  {
    slug: 'lich-su-kinh-ngu',
    name: 'Lịch sự – kính ngữ',
    description: 'Ngôn ngữ lịch sự và kính ngữ',
    icon: '🙏',
    color: '#d299c2',
    order: 31
  },
  {
    slug: 'tranh-luan-phan-bien',
    name: 'Tranh luận – phản biện',
    description: 'Kỹ năng tranh luận và phản biện',
    icon: '⚔️',
    color: '#ffecd2',
    order: 32
  },
  {
    slug: 'van-hoa-dai-loan',
    name: 'Văn hóa giao tiếp Đài Loan',
    description: 'Đặc điểm văn hóa giao tiếp Đài Loan',
    icon: '🇹🇼',
    color: '#ff9a9e',
    order: 33
  },
  {
    slug: 'le-nghi-phong-tuc',
    name: 'Lễ nghi – phong tục',
    description: 'Lễ nghi và phong tục truyền thống',
    icon: '🎎',
    color: '#fad0c4',
    order: 34
  },
  {
    slug: 'tin-tuc-thoi-su',
    name: 'Tin tức – thời sự đơn giản',
    description: 'Đọc hiểu tin tức và thời sự',
    icon: '📰',
    color: '#a18cd1',
    order: 35
  },
  {
    slug: 'giao-tiep-dien-thoai',
    name: 'Giao tiếp qua điện thoại',
    description: 'Kỹ năng giao tiếp qua điện thoại',
    icon: '☎️',
    color: '#fbc2eb',
    order: 36
  },
  {
    slug: 'xu-ly-tinh-huong',
    name: 'Xử lý tình huống hằng ngày',
    description: 'Giải quyết các tình huống thường gặp',
    icon: '🔧',
    color: '#fdcb6e',
    order: 37
  },
  {
    slug: 'phan-nan-gop-y',
    name: 'Phàn nàn – góp ý',
    description: 'Cách phàn nàn và đóng góp ý kiến',
    icon: '📢',
    color: '#e17055',
    order: 38
  },
  {
    slug: 'hai-huoc-noi-dua',
    name: 'Hài hước – nói đùa',
    description: 'Ngôn ngữ hài hước và nói đùa',
    icon: '😄',
    color: '#00b894',
    order: 39
  },
  {
    slug: 'ngon-ngu-doi-song-tieng-long',
    name: 'Ngôn ngữ đời sống – tiếng lóng',
    description: 'Tiếng lóng và ngôn ngữ đời sống',
    icon: '🗣️',
    color: '#6c5ce7',
    order: 40
  }
];

// Words data for each category
const wordsData = {
  'thanh-ngu-quan-ngu': [
    { traditional: '一舉兩得', simplified: '一举两得', pinyin: 'yì jǔ liǎng dé', zhuyin: 'ㄧˋ ㄐㄩˇ ㄌㄧㄤˇ ㄉㄜˊ', vietnamese: 'Một công đôi việc', english: 'Kill two birds with one stone', difficulty: 3 },
    { traditional: '三思而行', simplified: '三思而行', pinyin: 'sān sī ér xíng', zhuyin: 'ㄙㄢ ㄙ ㄦˊ ㄒㄧㄥˊ', vietnamese: 'Suy nghĩ ba lần rồi mới làm', english: 'Think thrice before acting', difficulty: 3 },
    { traditional: '半途而廢', simplified: '半途而废', pinyin: 'bàn tú ér fèi', zhuyin: 'ㄅㄢˋ ㄊㄨˊ ㄦˊ ㄈㄟˋ', vietnamese: 'Nửa chừng bỏ cuộc', english: 'Give up halfway', difficulty: 3 },
    { traditional: '畫蛇添足', simplified: '画蛇添足', pinyin: 'huà shé tiān zú', zhuyin: 'ㄏㄨㄚˋ ㄕㄜˊ ㄊㄧㄢ ㄗㄨˊ', vietnamese: 'Vẽ rắn thêm chân', english: 'Gild the lily', difficulty: 3 },
    { traditional: '亡羊補牢', simplified: '亡羊补牢', pinyin: 'wáng yáng bǔ láo', zhuyin: 'ㄨㄤˊ ㄧㄤˊ ㄅㄨˇ ㄌㄠˊ', vietnamese: 'Mất bò mới lo làm chuồng', english: 'Better late than never', difficulty: 3 },
    { traditional: '虎頭蛇尾', simplified: '虎头蛇尾', pinyin: 'hǔ tóu shé wěi', zhuyin: 'ㄏㄨˇ ㄊㄡˊ ㄕㄜˊ ㄨㄟˇ', vietnamese: 'Đầu cọp đuôi rắn', english: 'Start strong, finish weak', difficulty: 3 },
    { traditional: '守株待兔', simplified: '守株待兔', pinyin: 'shǒu zhū dài tù', zhuyin: 'ㄕㄡˇ ㄓㄨ ㄉㄞˋ ㄊㄨˋ', vietnamese: 'Ngồi đợi việc may', english: 'Wait idly for opportunities', difficulty: 3 },
    { traditional: '井底之蛙', simplified: '井底之蛙', pinyin: 'jǐng dǐ zhī wā', zhuyin: 'ㄐㄧㄥˇ ㄉㄧˇ ㄓ ㄨㄚ', vietnamese: 'Ếch ngồi đáy giếng', english: 'A narrow-minded person', difficulty: 3 },
    { traditional: '對牛彈琴', simplified: '对牛弹琴', pinyin: 'duì niú tán qín', zhuyin: 'ㄉㄨㄟˋ ㄋㄧㄡˊ ㄊㄢˊ ㄑㄧㄣˊ', vietnamese: 'Đàn gảy cho trâu nghe', english: 'Cast pearls before swine', difficulty: 3 },
    { traditional: '水到渠成', simplified: '水到渠成', pinyin: 'shuǐ dào qú chéng', zhuyin: 'ㄕㄨㄟˇ ㄉㄠˋ ㄑㄩˊ ㄔㄥˊ', vietnamese: 'Nước đến chỗ sẽ thành cống', english: 'Things will work out naturally', difficulty: 3 }
  ],
  'ngu-dieu-bien-dieu': [
    { traditional: '語調', simplified: '语调', pinyin: 'yǔ diào', zhuyin: 'ㄩˇ ㄉㄧㄠˋ', vietnamese: 'Ngữ điệu', english: 'Intonation', difficulty: 3 },
    { traditional: '聲調', simplified: '声调', pinyin: 'shēng diào', zhuyin: 'ㄕㄥ ㄉㄧㄠˋ', vietnamese: 'Thanh điệu', english: 'Tone', difficulty: 3 },
    { traditional: '升調', simplified: '升调', pinyin: 'shēng diào', zhuyin: 'ㄕㄥ ㄉㄧㄠˋ', vietnamese: 'Thanh lên', english: 'Rising tone', difficulty: 3 },
    { traditional: '降調', simplified: '降调', pinyin: 'jiàng diào', zhuyin: 'ㄐㄧㄤˋ ㄉㄧㄠˋ', vietnamese: 'Thanh xuống', english: 'Falling tone', difficulty: 3 },
    { traditional: '輕聲', simplified: '轻声', pinyin: 'qīng shēng', zhuyin: 'ㄑㄧㄥ ㄕㄥ', vietnamese: 'Thanh nhẹ', english: 'Neutral tone', difficulty: 3 },
    { traditional: '重音', simplified: '重音', pinyin: 'zhòng yīn', zhuyin: 'ㄓㄨㄥˋ ㄧㄣ', vietnamese: 'Trọng âm', english: 'Stress, accent', difficulty: 3 },
    { traditional: '抑揚頓挫', simplified: '抑扬顿挫', pinyin: 'yì yáng dùn cuò', zhuyin: 'ㄧˋ ㄧㄤˊ ㄉㄨㄣˋ ㄘㄨㄛˋ', vietnamese: 'Nhấn nhá điệu bộ', english: 'Cadence', difficulty: 3 },
    { traditional: '停頓', simplified: '停顿', pinyin: 'tíng dùn', zhuyin: 'ㄊㄧㄥˊ ㄉㄨㄣˋ', vietnamese: 'Dừng lại, tạm nghỉ', english: 'Pause', difficulty: 3 },
    { traditional: '節奏', simplified: '节奏', pinyin: 'jié zòu', zhuyin: 'ㄐㄧㄝˊ ㄗㄡˋ', vietnamese: 'Nhịp điệu', english: 'Rhythm', difficulty: 3 },
    { traditional: '尾音', simplified: '尾音', pinyin: 'wěi yīn', zhuyin: 'ㄨㄟˇ ㄧㄣ', vietnamese: 'Âm cuối', english: 'Final sound', difficulty: 3 }
  ],
  'cau-truc-nang-cao': [
    { traditional: '不但...而且...', simplified: '不但...而且...', pinyin: 'bù dàn... ér qiě...', zhuyin: 'ㄅㄨˋ ㄉㄢˋ... ㄦˊ ㄑㄧㄝˇ...', vietnamese: 'Không những... mà còn...', english: 'Not only... but also...', difficulty: 3 },
    { traditional: '雖然...但是...', simplified: '虽然...但是...', pinyin: 'suī rán... dàn shì...', zhuyin: 'ㄙㄨㄟ ㄖㄢˊ... ㄉㄢˋ ㄕˋ...', vietnamese: 'Tuy rằng... nhưng...', english: 'Although... but...', difficulty: 3 },
    { traditional: '既然...就...', simplified: '既然...就...', pinyin: 'jì rán... jiù...', zhuyin: 'ㄐㄧˋ ㄖㄢˊ... ㄐㄧㄡˋ...', vietnamese: 'Đã... thì...', english: 'Since... then...', difficulty: 3 },
    { traditional: '與其...不如...', simplified: '与其...不如...', pinyin: 'yǔ qí... bù rú...', zhuyin: 'ㄩˇ ㄑㄧˊ... ㄅㄨˋ ㄖㄨˊ...', vietnamese: 'Thà... còn hơn...', english: 'Rather than... it\'s better to...', difficulty: 3 },
    { traditional: '無論...都...', simplified: '无论...都...', pinyin: 'wú lùn... dōu...', zhuyin: 'ㄨˊ ㄌㄨㄣˋ... ㄉㄡ...', vietnamese: 'Dù... đều...', english: 'No matter... all...', difficulty: 3 },
    { traditional: '只要...就...', simplified: '只要...就...', pinyin: 'zhǐ yào... jiù...', zhuyin: 'ㄓˇ ㄧㄠˋ... ㄐㄧㄡˋ...', vietnamese: 'Chỉ cần... thì...', english: 'As long as... then...', difficulty: 3 },
    { traditional: '一方面...另一方面...', simplified: '一方面...另一方面...', pinyin: 'yī fāng miàn... lìng yī fāng miàn...', zhuyin: 'ㄧ ㄈㄤ ㄇㄧㄢˋ... ㄌㄧㄥˋ ㄧ ㄈㄤ ㄇㄧㄢˋ...', vietnamese: 'Một mặt... mặt khác...', english: 'On one hand... on the other hand...', difficulty: 3 },
    { traditional: '即使...也...', simplified: '即使...也...', pinyin: 'jí shǐ... yě...', zhuyin: 'ㄐㄧˊ ㄕˇ... ㄧㄝˇ...', vietnamese: 'Dù cho... cũng...', english: 'Even if... also...', difficulty: 3 },
    { traditional: '除非...否則...', simplified: '除非...否则...', pinyin: 'chú fēi... fǒu zé...', zhuyin: 'ㄔㄨˊ ㄈㄟ... ㄈㄡˇ ㄗㄜˊ...', vietnamese: 'Trừ phi... nếu không...', english: 'Unless... otherwise...', difficulty: 3 },
    { traditional: '無論如何', simplified: '无论如何', pinyin: 'wú lùn rú hé', zhuyin: 'ㄨˊ ㄌㄨㄣˋ ㄖㄨˊ ㄏㄜˊ', vietnamese: 'Dù thế nào đi nữa', english: 'No matter what', difficulty: 3 }
  ],
  'hoi-thoai-cong-viec': [
    { traditional: '開會', simplified: '开会', pinyin: 'kāi huì', zhuyin: 'ㄎㄞ ㄏㄨㄟˋ', vietnamese: 'Họp', english: 'Have a meeting', difficulty: 3 },
    { traditional: '討論', simplified: '讨论', pinyin: 'tǎo lùn', zhuyin: 'ㄊㄠˇ ㄌㄨㄣˋ', vietnamese: 'Thảo luận', english: 'Discuss', difficulty: 3 },
    { traditional: '報告', simplified: '报告', pinyin: 'bào gào', zhuyin: 'ㄅㄠˋ ㄍㄠˋ', vietnamese: 'Báo cáo', english: 'Report', difficulty: 3 },
    { traditional: '提案', simplified: '提案', pinyin: 'tí àn', zhuyin: 'ㄊㄧˊ ㄢˋ', vietnamese: 'Đề xuất', english: 'Proposal', difficulty: 3 },
    { traditional: '合作', simplified: '合作', pinyin: 'hé zuò', zhuyin: 'ㄏㄜˊ ㄗㄨㄛˋ', vietnamese: 'Hợp tác', english: 'Cooperate', difficulty: 3 },
    { traditional: '分工', simplified: '分工', pinyin: 'fēn gōng', zhuyin: 'ㄈㄣ ㄍㄨㄥ', vietnamese: 'Phân công', english: 'Division of labor', difficulty: 3 },
    { traditional: '截止日期', simplified: '截止日期', pinyin: 'jié zhǐ rì qī', zhuyin: 'ㄐㄧㄝˊ ㄓˇ ㄖˋ ㄑㄧ', vietnamese: 'Hạn chót', english: 'Deadline', difficulty: 3 },
    { traditional: '加班', simplified: '加班', pinyin: 'jiā bān', zhuyin: 'ㄐㄧㄚ ㄅㄢ', vietnamese: 'Làm thêm giờ', english: 'Work overtime', difficulty: 3 },
    { traditional: '請假', simplified: '请假', pinyin: 'qǐng jià', zhuyin: 'ㄑㄧㄥˇ ㄐㄧㄚˋ', vietnamese: 'Xin nghỉ phép', english: 'Ask for leave', difficulty: 3 },
    { traditional: '出差', simplified: '出差', pinyin: 'chū chāi', zhuyin: 'ㄔㄨ ㄔㄞ', vietnamese: 'Đi công tác', english: 'Business trip', difficulty: 3 }
  ],
  'giao-tiep-cong-so': [
    { traditional: '同事', simplified: '同事', pinyin: 'tóng shì', zhuyin: 'ㄊㄨㄥˊ ㄕˋ', vietnamese: 'Đồng nghiệp', english: 'Colleague', difficulty: 3 },
    { traditional: '上司', simplified: '上司', pinyin: 'shàng sī', zhuyin: 'ㄕㄤˋ ㄙ', vietnamese: 'Cấp trên', english: 'Superior, boss', difficulty: 3 },
    { traditional: '下屬', simplified: '下属', pinyin: 'xià shǔ', zhuyin: 'ㄒㄧㄚˋ ㄕㄨˇ', vietnamese: 'Cấp dưới', english: 'Subordinate', difficulty: 3 },
    { traditional: '部門', simplified: '部门', pinyin: 'bù mén', zhuyin: 'ㄅㄨˋ ㄇㄣˊ', vietnamese: 'Phòng ban', english: 'Department', difficulty: 3 },
    { traditional: '專案', simplified: '专案', pinyin: 'zhuān àn', zhuyin: 'ㄓㄨㄢ ㄢˋ', vietnamese: 'Dự án', english: 'Project', difficulty: 3 },
    { traditional: '文件', simplified: '文件', pinyin: 'wén jiàn', zhuyin: 'ㄨㄣˊ ㄐㄧㄢˋ', vietnamese: 'Tài liệu', english: 'Document', difficulty: 3 },
    { traditional: '簽名', simplified: '签名', pinyin: 'qiān míng', zhuyin: 'ㄑㄧㄢ ㄇㄧㄥˊ', vietnamese: 'Ký tên', english: 'Sign', difficulty: 3 },
    { traditional: '影印', simplified: '影印', pinyin: 'yǐng yìn', zhuyin: 'ㄧㄥˇ ㄧㄣˋ', vietnamese: 'Photocopy', english: 'Photocopy', difficulty: 3 },
    { traditional: '會議室', simplified: '会议室', pinyin: 'huì yì shì', zhuyin: 'ㄏㄨㄟˋ ㄧˋ ㄕˋ', vietnamese: 'Phòng họp', english: 'Meeting room', difficulty: 3 },
    { traditional: '電子郵件', simplified: '电子邮件', pinyin: 'diàn zǐ yóu jiàn', zhuyin: 'ㄉㄧㄢˋ ㄗˇ ㄧㄡˊ ㄐㄧㄢˋ', vietnamese: 'Email', english: 'Email', difficulty: 3 }
  ],
  'dam-phan-thuong-luong': [
    { traditional: '協商', simplified: '协商', pinyin: 'xié shāng', zhuyin: 'ㄒㄧㄝˊ ㄕㄤ', vietnamese: 'Trao đổi, bàn bạc', english: 'Negotiate, consult', difficulty: 3 },
    { traditional: '談判', simplified: '谈判', pinyin: 'tán pàn', zhuyin: 'ㄊㄢˊ ㄆㄢˋ', vietnamese: 'Đàm phán', english: 'Negotiation', difficulty: 3 },
    { traditional: '妥協', simplified: '妥协', pinyin: 'tuǒ xié', zhuyin: 'ㄊㄨㄛˇ ㄒㄧㄝˊ', vietnamese: 'Thỏa hiệp', english: 'Compromise', difficulty: 3 },
    { traditional: '讓步', simplified: '让步', pinyin: 'ràng bù', zhuyin: 'ㄖㄤˋ ㄅㄨˋ', vietnamese: 'Nhượng bộ', english: 'Make concessions', difficulty: 3 },
    { traditional: '條件', simplified: '条件', pinyin: 'tiáo jiàn', zhuyin: 'ㄊㄧㄠˊ ㄐㄧㄢˋ', vietnamese: 'Điều kiện', english: 'Condition', difficulty: 3 },
    { traditional: '合約', simplified: '合约', pinyin: 'hé yuē', zhuyin: 'ㄏㄜˊ ㄩㄝ', vietnamese: 'Hợp đồng', english: 'Contract', difficulty: 3 },
    { traditional: '價格', simplified: '价格', pinyin: 'jià gé', zhuyin: 'ㄐㄧㄚˋ ㄍㄜˊ', vietnamese: 'Giá cả', english: 'Price', difficulty: 3 },
    { traditional: '折扣', simplified: '折扣', pinyin: 'zhé kòu', zhuyin: 'ㄓㄜˊ ㄎㄡˋ', vietnamese: 'Giảm giá', english: 'Discount', difficulty: 3 },
    { traditional: '達成協議', simplified: '达成协议', pinyin: 'dá chéng xié yì', zhuyin: 'ㄉㄚˊ ㄔㄥˊ ㄒㄧㄝˊ ㄧˋ', vietnamese: 'Đạt được thỏa thuận', english: 'Reach an agreement', difficulty: 3 },
    { traditional: '雙贏', simplified: '双赢', pinyin: 'shuāng yíng', zhuyin: 'ㄕㄨㄤ ㄧㄥˊ', vietnamese: 'Đôi bên cùng thắng', english: 'Win-win', difficulty: 3 }
  ],
  'cam-xuc-phuc-tap': [
    { traditional: '感動', simplified: '感动', pinyin: 'gǎn dòng', zhuyin: 'ㄍㄢˇ ㄉㄨㄥˋ', vietnamese: 'Cảm động', english: 'Moved, touched', difficulty: 3 },
    { traditional: '失望', simplified: '失望', pinyin: 'shī wàng', zhuyin: 'ㄕ ㄨㄤˋ', vietnamese: 'Thất vọng', english: 'Disappointed', difficulty: 3 },
    { traditional: '焦慮', simplified: '焦虑', pinyin: 'jiāo lǜ', zhuyin: 'ㄐㄧㄠ ㄌㄩˋ', vietnamese: 'Lo lắng', english: 'Anxious', difficulty: 3 },
    { traditional: '尷尬', simplified: '尴尬', pinyin: 'gān gà', zhuyin: 'ㄍㄢ ㄍㄚˋ', vietnamese: 'Lúng túng', english: 'Embarrassed', difficulty: 3 },
    { traditional: '沮喪', simplified: '沮丧', pinyin: 'jǔ sàng', zhuyin: 'ㄐㄩˇ ㄙㄤˋ', vietnamese: 'Chán nản', english: 'Depressed', difficulty: 3 },
    { traditional: '後悔', simplified: '后悔', pinyin: 'hòu huǐ', zhuyin: 'ㄏㄡˋ ㄏㄨㄟˇ', vietnamese: 'Hối hận', english: 'Regret', difficulty: 3 },
    { traditional: '驕傲', simplified: '骄傲', pinyin: 'jiāo ào', zhuyin: 'ㄐㄧㄠ ㄠˋ', vietnamese: 'Tự hào', english: 'Proud', difficulty: 3 },
    { traditional: '嫉妒', simplified: '嫉妒', pinyin: 'jí dù', zhuyin: 'ㄐㄧˊ ㄉㄨˋ', vietnamese: 'Ghen tị', english: 'Jealous', difficulty: 3 },
    { traditional: '感激', simplified: '感激', pinyin: 'gǎn jī', zhuyin: 'ㄍㄢˇ ㄐㄧ', vietnamese: 'Biết ơn', english: 'Grateful', difficulty: 3 },
    { traditional: '惆悵', simplified: '惆怅', pinyin: 'chóu chàng', zhuyin: 'ㄔㄡˊ ㄔㄤˋ', vietnamese: 'Buồn man mác', english: 'Melancholy', difficulty: 3 }
  ],
  'y-kien-quan-diem': [
    { traditional: '我認為', simplified: '我认为', pinyin: 'wǒ rèn wéi', zhuyin: 'ㄨㄛˇ ㄖㄣˋ ㄨㄟˊ', vietnamese: 'Tôi cho rằng', english: 'I think', difficulty: 3 },
    { traditional: '依我看來', simplified: '依我看来', pinyin: 'yī wǒ kàn lái', zhuyin: 'ㄧ ㄨㄛˇ ㄎㄢˋ ㄌㄞˊ', vietnamese: 'Theo tôi thấy', english: 'In my opinion', difficulty: 3 },
    { traditional: '就我而言', simplified: '就我而言', pinyin: 'jiù wǒ ér yán', zhuyin: 'ㄐㄧㄡˋ ㄨㄛˇ ㄦˊ ㄧㄢˊ', vietnamese: 'Đối với tôi', english: 'As far as I\'m concerned', difficulty: 3 },
    { traditional: '我的看法是', simplified: '我的看法是', pinyin: 'wǒ de kàn fǎ shì', zhuyin: 'ㄨㄛˇ ㄉㄜ˙ ㄎㄢˋ ㄈㄚˇ ㄕˋ', vietnamese: 'Quan điểm của tôi là', english: 'My view is', difficulty: 3 },
    { traditional: '據我所知', simplified: '据我所知', pinyin: 'jù wǒ suǒ zhī', zhuyin: 'ㄐㄩˋ ㄨㄛˇ ㄙㄨㄛˇ ㄓ', vietnamese: 'Theo những gì tôi biết', english: 'As far as I know', difficulty: 3 },
    { traditional: '我同意', simplified: '我同意', pinyin: 'wǒ tóng yì', zhuyin: 'ㄨㄛˇ ㄊㄨㄥˊ ㄧˋ', vietnamese: 'Tôi đồng ý', english: 'I agree', difficulty: 3 },
    { traditional: '我反對', simplified: '我反对', pinyin: 'wǒ fǎn duì', zhuyin: 'ㄨㄛˇ ㄈㄢˇ ㄉㄨㄟˋ', vietnamese: 'Tôi phản đối', english: 'I oppose', difficulty: 3 },
    { traditional: '我建議', simplified: '我建议', pinyin: 'wǒ jiàn yì', zhuyin: 'ㄨㄛˇ ㄐㄧㄢˋ ㄧˋ', vietnamese: 'Tôi đề nghị', english: 'I suggest', difficulty: 3 },
    { traditional: '恕我直言', simplified: '恕我直言', pinyin: 'shù wǒ zhí yán', zhuyin: 'ㄕㄨˋ ㄨㄛˇ ㄓˊ ㄧㄢˊ', vietnamese: 'Xin phép nói thẳng', english: 'To be frank', difficulty: 3 },
    { traditional: '個人意見', simplified: '个人意见', pinyin: 'gè rén yì jiàn', zhuyin: 'ㄍㄜˋ ㄖㄣˊ ㄧˋ ㄐㄧㄢˋ', vietnamese: 'Ý kiến cá nhân', english: 'Personal opinion', difficulty: 3 }
  ],
  'ke-chuyen-tuong-thuat': [
    { traditional: '從前', simplified: '从前', pinyin: 'cóng qián', zhuyin: 'ㄘㄨㄥˊ ㄑㄧㄢˊ', vietnamese: 'Ngày xưa', english: 'Once upon a time', difficulty: 3 },
    { traditional: '後來', simplified: '后来', pinyin: 'hòu lái', zhuyin: 'ㄏㄡˋ ㄌㄞˊ', vietnamese: 'Sau đó', english: 'Later', difficulty: 3 },
    { traditional: '接著', simplified: '接着', pinyin: 'jiē zhe', zhuyin: 'ㄐㄧㄝ ㄓㄜ˙', vietnamese: 'Tiếp theo', english: 'Next', difficulty: 3 },
    { traditional: '最後', simplified: '最后', pinyin: 'zuì hòu', zhuyin: 'ㄗㄨㄟˋ ㄏㄡˋ', vietnamese: 'Cuối cùng', english: 'Finally', difficulty: 3 },
    { traditional: '突然', simplified: '突然', pinyin: 'tū rán', zhuyin: 'ㄊㄨ ㄖㄢˊ', vietnamese: 'Đột nhiên', english: 'Suddenly', difficulty: 3 },
    { traditional: '結果', simplified: '结果', pinyin: 'jié guǒ', zhuyin: 'ㄐㄧㄝˊ ㄍㄨㄛˇ', vietnamese: 'Kết quả', english: 'As a result', difficulty: 3 },
    { traditional: '原來', simplified: '原来', pinyin: 'yuán lái', zhuyin: 'ㄩㄢˊ ㄌㄞˊ', vietnamese: 'Hóa ra', english: 'It turns out', difficulty: 3 },
    { traditional: '據說', simplified: '据说', pinyin: 'jù shuō', zhuyin: 'ㄐㄩˋ ㄕㄨㄛ', vietnamese: 'Nghe nói', english: 'It is said', difficulty: 3 },
    { traditional: '換句話說', simplified: '换句话说', pinyin: 'huàn jù huà shuō', zhuyin: 'ㄏㄨㄢˋ ㄐㄩˋ ㄏㄨㄚˋ ㄕㄨㄛ', vietnamese: 'Nói cách khác', english: 'In other words', difficulty: 3 },
    { traditional: '總之', simplified: '总之', pinyin: 'zǒng zhī', zhuyin: 'ㄗㄨㄥˇ ㄓ', vietnamese: 'Tóm lại', english: 'In short', difficulty: 3 }
  ],
  'so-sanh-nhan-manh': [
    { traditional: '比較', simplified: '比较', pinyin: 'bǐ jiào', zhuyin: 'ㄅㄧˇ ㄐㄧㄠˋ', vietnamese: 'So sánh', english: 'Compare', difficulty: 3 },
    { traditional: '更加', simplified: '更加', pinyin: 'gèng jiā', zhuyin: 'ㄍㄥˋ ㄐㄧㄚ', vietnamese: 'Hơn nữa', english: 'Even more', difficulty: 3 },
    { traditional: '最', simplified: '最', pinyin: 'zuì', zhuyin: 'ㄗㄨㄟˋ', vietnamese: 'Nhất', english: 'Most', difficulty: 3 },
    { traditional: '特別', simplified: '特别', pinyin: 'tè bié', zhuyin: 'ㄊㄜˋ ㄅㄧㄝˊ', vietnamese: 'Đặc biệt', english: 'Especially', difficulty: 3 },
    { traditional: '非常', simplified: '非常', pinyin: 'fēi cháng', zhuyin: 'ㄈㄟ ㄔㄤˊ', vietnamese: 'Rất, vô cùng', english: 'Very, extremely', difficulty: 3 },
    { traditional: '十分', simplified: '十分', pinyin: 'shí fēn', zhuyin: 'ㄕˊ ㄈㄣ', vietnamese: 'Rất, vô cùng', english: 'Very, extremely', difficulty: 3 },
    { traditional: '相對', simplified: '相对', pinyin: 'xiāng duì', zhuyin: 'ㄒㄧㄤ ㄉㄨㄟˋ', vietnamese: 'Tương đối', english: 'Relatively', difficulty: 3 },
    { traditional: '不如', simplified: '不如', pinyin: 'bù rú', zhuyin: 'ㄅㄨˋ ㄖㄨˊ', vietnamese: 'Không bằng', english: 'Not as good as', difficulty: 3 },
    { traditional: '簡直', simplified: '简直', pinyin: 'jiǎn zhí', zhuyin: 'ㄐㄧㄢˇ ㄓˊ', vietnamese: 'Đơn giản là', english: 'Simply', difficulty: 3 },
    { traditional: '尤其', simplified: '尤其', pinyin: 'yóu qí', zhuyin: 'ㄧㄡˊ ㄑㄧˊ', vietnamese: 'Nhất là', english: 'Especially', difficulty: 3 }
  ],
  'lich-su-kinh-ngu': [
    { traditional: '打擾了', simplified: '打扰了', pinyin: 'dǎ rǎo le', zhuyin: 'ㄉㄚˇ ㄖㄠˇ ㄌㄜ˙', vietnamese: 'Xin lỗi đã làm phiền', english: 'Sorry to disturb', difficulty: 3 },
    { traditional: '勞駕', simplified: '劳驾', pinyin: 'láo jià', zhuyin: 'ㄌㄠˊ ㄐㄧㄚˋ', vietnamese: 'Xin lỗi, làm phiền', english: 'Excuse me', difficulty: 3 },
    { traditional: '承蒙', simplified: '承蒙', pinyin: 'chéng méng', zhuyin: 'ㄔㄥˊ ㄇㄥˊ', vietnamese: 'Nhờ ơn', english: 'Thanks to (polite)', difficulty: 3 },
    { traditional: '拜託', simplified: '拜托', pinyin: 'bài tuō', zhuyin: 'ㄅㄞˋ ㄊㄨㄛ', vietnamese: 'Nhờ vả', english: 'Please (polite request)', difficulty: 3 },
    { traditional: '多謝', simplified: '多谢', pinyin: 'duō xiè', zhuyin: 'ㄉㄨㄛ ㄒㄧㄝˋ', vietnamese: 'Cảm ơn nhiều', english: 'Many thanks', difficulty: 3 },
    { traditional: '失禮了', simplified: '失礼了', pinyin: 'shī lǐ le', zhuyin: 'ㄕ ㄌㄧˇ ㄌㄜ˙', vietnamese: 'Thất lễ rồi', english: 'Pardon me', difficulty: 3 },
    { traditional: '恭喜', simplified: '恭喜', pinyin: 'gōng xǐ', zhuyin: 'ㄍㄨㄥ ㄒㄧˇ', vietnamese: 'Chúc mừng', english: 'Congratulations', difficulty: 3 },
    { traditional: '久仰大名', simplified: '久仰大名', pinyin: 'jiǔ yǎng dà míng', zhuyin: 'ㄐㄧㄡˇ ㄧㄤˇ ㄉㄚˋ ㄇㄧㄥˊ', vietnamese: 'Ngưỡng mộ danh tiếng từ lâu', english: 'I\'ve admired you for a long time', difficulty: 3 },
    { traditional: '不敢當', simplified: '不敢当', pinyin: 'bù gǎn dāng', zhuyin: 'ㄅㄨˋ ㄍㄢˇ ㄉㄤ', vietnamese: 'Không dám nhận', english: 'I don\'t deserve it', difficulty: 3 },
    { traditional: '幸會', simplified: '幸会', pinyin: 'xìng huì', zhuyin: 'ㄒㄧㄥˋ ㄏㄨㄟˋ', vietnamese: 'Hân hạnh', english: 'Nice to meet you (formal)', difficulty: 3 }
  ],
  'tranh-luan-phan-bien': [
    { traditional: '反駁', simplified: '反驳', pinyin: 'fǎn bó', zhuyin: 'ㄈㄢˇ ㄅㄛˊ', vietnamese: 'Phản bác', english: 'Refute', difficulty: 3 },
    { traditional: '質疑', simplified: '质疑', pinyin: 'zhì yí', zhuyin: 'ㄓˋ ㄧˊ', vietnamese: 'Nghi vấn', english: 'Question, doubt', difficulty: 3 },
    { traditional: '論點', simplified: '论点', pinyin: 'lùn diǎn', zhuyin: 'ㄌㄨㄣˋ ㄉㄧㄢˇ', vietnamese: 'Luận điểm', english: 'Argument', difficulty: 3 },
    { traditional: '證據', simplified: '证据', pinyin: 'zhèng jù', zhuyin: 'ㄓㄥˋ ㄐㄩˋ', vietnamese: 'Chứng cứ', english: 'Evidence', difficulty: 3 },
    { traditional: '辯解', simplified: '辩解', pinyin: 'biàn jiě', zhuyin: 'ㄅㄧㄢˋ ㄐㄧㄝˇ', vietnamese: 'Biện giải', english: 'Defend, explain', difficulty: 3 },
    { traditional: '駁斥', simplified: '驳斥', pinyin: 'bó chì', zhuyin: 'ㄅㄛˊ ㄔˋ', vietnamese: 'Bác bỏ', english: 'Rebut', difficulty: 3 },
    { traditional: '爭論', simplified: '争论', pinyin: 'zhēng lùn', zhuyin: 'ㄓㄥ ㄌㄨㄣˋ', vietnamese: 'Tranh luận', english: 'Debate', difficulty: 3 },
    { traditional: '立場', simplified: '立场', pinyin: 'lì chǎng', zhuyin: 'ㄌㄧˋ ㄔㄤˇ', vietnamese: 'Lập trường', english: 'Position, stance', difficulty: 3 },
    { traditional: '觀點', simplified: '观点', pinyin: 'guān diǎn', zhuyin: 'ㄍㄨㄢ ㄉㄧㄢˇ', vietnamese: 'Quan điểm', english: 'Viewpoint', difficulty: 3 },
    { traditional: '說服', simplified: '说服', pinyin: 'shuō fú', zhuyin: 'ㄕㄨㄛ ㄈㄨˊ', vietnamese: 'Thuyết phục', english: 'Persuade', difficulty: 3 }
  ],
  'van-hoa-dai-loan': [
    { traditional: '台灣腔', simplified: '台湾腔', pinyin: 'Tái wān qiāng', zhuyin: 'ㄊㄞˊ ㄨㄢ ㄑㄧㄤ', vietnamese: 'Giọng Đài Loan', english: 'Taiwan accent', difficulty: 3 },
    { traditional: '捷運', simplified: '捷运', pinyin: 'jié yùn', zhuyin: 'ㄐㄧㄝˊ ㄩㄣˋ', vietnamese: 'Tàu điện ngầm (MRT)', english: 'MRT (Mass Rapid Transit)', difficulty: 3 },
    { traditional: '機車', simplified: '机车', pinyin: 'jī chē', zhuyin: 'ㄐㄧ ㄔㄜ', vietnamese: 'Xe máy', english: 'Scooter, motorcycle', difficulty: 3 },
    { traditional: '夜市', simplified: '夜市', pinyin: 'yè shì', zhuyin: 'ㄧㄝˋ ㄕˋ', vietnamese: 'Chợ đêm', english: 'Night market', difficulty: 3 },
    { traditional: '小吃', simplified: '小吃', pinyin: 'xiǎo chī', zhuyin: 'ㄒㄧㄠˇ ㄔ', vietnamese: 'Món ăn vặt', english: 'Snacks', difficulty: 3 },
    { traditional: '便當', simplified: '便当', pinyin: 'biàn dāng', zhuyin: 'ㄅㄧㄢˋ ㄉㄤ', vietnamese: 'Cơm hộp', english: 'Bento, lunch box', difficulty: 3 },
    { traditional: '手搖飲料', simplified: '手摇饮料', pinyin: 'shǒu yáo yǐn liào', zhuyin: 'ㄕㄡˇ ㄧㄠˊ ㄧㄣˇ ㄌㄧㄠˋ', vietnamese: 'Trà sữa', english: 'Bubble tea, hand-shaken drinks', difficulty: 3 },
    { traditional: '便利商店', simplified: '便利商店', pinyin: 'biàn lì shāng diàn', zhuyin: 'ㄅㄧㄢˋ ㄌㄧˋ ㄕㄤ ㄉㄧㄢˋ', vietnamese: 'Cửa hàng tiện lợi', english: 'Convenience store', difficulty: 3 },
    { traditional: '悠遊卡', simplified: '悠游卡', pinyin: 'yōu yóu kǎ', zhuyin: 'ㄧㄡ ㄧㄡˊ ㄎㄚˇ', vietnamese: 'Thẻ EasyCard', english: 'EasyCard', difficulty: 3 },
    { traditional: '排隊', simplified: '排队', pinyin: 'pái duì', zhuyin: 'ㄆㄞˊ ㄉㄨㄟˋ', vietnamese: 'Xếp hàng', english: 'Queue up', difficulty: 3 }
  ],
  'le-nghi-phong-tuc': [
    { traditional: '過年', simplified: '过年', pinyin: 'guò nián', zhuyin: 'ㄍㄨㄛˋ ㄋㄧㄢˊ', vietnamese: 'Tết Nguyên Đán', english: 'Chinese New Year', difficulty: 3 },
    { traditional: '紅包', simplified: '红包', pinyin: 'hóng bāo', zhuyin: 'ㄏㄨㄥˊ ㄅㄠ', vietnamese: 'Bao lì xì', english: 'Red envelope', difficulty: 3 },
    { traditional: '拜年', simplified: '拜年', pinyin: 'bài nián', zhuyin: 'ㄅㄞˋ ㄋㄧㄢˊ', vietnamese: 'Chúc Tết', english: 'New Year greetings', difficulty: 3 },
    { traditional: '中秋節', simplified: '中秋节', pinyin: 'zhōng qiū jié', zhuyin: 'ㄓㄨㄥ ㄑㄧㄡ ㄐㄧㄝˊ', vietnamese: 'Tết Trung Thu', english: 'Mid-Autumn Festival', difficulty: 3 },
    { traditional: '端午節', simplified: '端午节', pinyin: 'duān wǔ jié', zhuyin: 'ㄉㄨㄢ ㄨˇ ㄐㄧㄝˊ', vietnamese: 'Tết Đoan Ngọ', english: 'Dragon Boat Festival', difficulty: 3 },
    { traditional: '祭祖', simplified: '祭祖', pinyin: 'jì zǔ', zhuyin: 'ㄐㄧˋ ㄗㄨˇ', vietnamese: 'Tế tổ tiên', english: 'Ancestor worship', difficulty: 3 },
    { traditional: '拜拜', simplified: '拜拜', pinyin: 'bài bài', zhuyin: 'ㄅㄞˋ ㄅㄞˋ', vietnamese: 'Lễ bái (đi chùa)', english: 'Worship, pray', difficulty: 3 },
    { traditional: '燒香', simplified: '烧香', pinyin: 'shāo xiāng', zhuyin: 'ㄕㄠ ㄒㄧㄤ', vietnamese: 'Đốt hương', english: 'Burn incense', difficulty: 3 },
    { traditional: '婚禮', simplified: '婚礼', pinyin: 'hūn lǐ', zhuyin: 'ㄏㄨㄣ ㄌㄧˇ', vietnamese: 'Hôn lễ', english: 'Wedding', difficulty: 3 },
    { traditional: '喪禮', simplified: '丧礼', pinyin: 'sāng lǐ', zhuyin: 'ㄙㄤ ㄌㄧˇ', vietnamese: 'Tang lễ', english: 'Funeral', difficulty: 3 }
  ],
  'tin-tuc-thoi-su': [
    { traditional: '新聞', simplified: '新闻', pinyin: 'xīn wén', zhuyin: 'ㄒㄧㄣ ㄨㄣˊ', vietnamese: 'Tin tức', english: 'News', difficulty: 3 },
    { traditional: '報導', simplified: '报导', pinyin: 'bào dǎo', zhuyin: 'ㄅㄠˋ ㄉㄠˇ', vietnamese: 'Báo đạo', english: 'Report', difficulty: 3 },
    { traditional: '頭條', simplified: '头条', pinyin: 'tóu tiáo', zhuyin: 'ㄊㄡˊ ㄊㄧㄠˊ', vietnamese: 'Tiêu đề chính', english: 'Headline', difficulty: 3 },
    { traditional: '政治', simplified: '政治', pinyin: 'zhèng zhì', zhuyin: 'ㄓㄥˋ ㄓˋ', vietnamese: 'Chính trị', english: 'Politics', difficulty: 3 },
    { traditional: '經濟', simplified: '经济', pinyin: 'jīng jì', zhuyin: 'ㄐㄧㄥ ㄐㄧˋ', vietnamese: 'Kinh tế', english: 'Economy', difficulty: 3 },
    { traditional: '社會', simplified: '社会', pinyin: 'shè huì', zhuyin: 'ㄕㄜˋ ㄏㄨㄟˋ', vietnamese: 'Xã hội', english: 'Society', difficulty: 3 },
    { traditional: '天氣預報', simplified: '天气预报', pinyin: 'tiān qì yù bào', zhuyin: 'ㄊㄧㄢ ㄑㄧˋ ㄩˋ ㄅㄠˋ', vietnamese: 'Dự báo thời tiết', english: 'Weather forecast', difficulty: 3 },
    { traditional: '颱風', simplified: '台风', pinyin: 'tái fēng', zhuyin: 'ㄊㄞˊ ㄈㄥ', vietnamese: 'Bão', english: 'Typhoon', difficulty: 3 },
    { traditional: '地震', simplified: '地震', pinyin: 'dì zhèn', zhuyin: 'ㄉㄧˋ ㄓㄣˋ', vietnamese: 'Động đất', english: 'Earthquake', difficulty: 3 },
    { traditional: '記者', simplified: '记者', pinyin: 'jì zhě', zhuyin: 'ㄐㄧˋ ㄓㄜˇ', vietnamese: 'Phóng viên', english: 'Reporter', difficulty: 3 }
  ],
  'giao-tiep-dien-thoai': [
    { traditional: '喂', simplified: '喂', pinyin: 'wéi', zhuyin: 'ㄨㄟˊ', vietnamese: 'A lô', english: 'Hello (on phone)', difficulty: 3 },
    { traditional: '請問是哪位', simplified: '请问是哪位', pinyin: 'qǐng wèn shì nǎ wèi', zhuyin: 'ㄑㄧㄥˇ ㄨㄣˋ ㄕˋ ㄋㄚˇ ㄨㄟˋ', vietnamese: 'Xin hỏi là ai?', english: 'Who is calling?', difficulty: 3 },
    { traditional: '我是', simplified: '我是', pinyin: 'wǒ shì', zhuyin: 'ㄨㄛˇ ㄕˋ', vietnamese: 'Tôi là', english: 'This is (name)', difficulty: 3 },
    { traditional: '請稍等', simplified: '请稍等', pinyin: 'qǐng shāo děng', zhuyin: 'ㄑㄧㄥˇ ㄕㄠ ㄉㄥˇ', vietnamese: 'Xin chờ một chút', english: 'Please hold', difficulty: 3 },
    { traditional: '掛斷', simplified: '挂断', pinyin: 'guà duàn', zhuyin: 'ㄍㄨㄚˋ ㄉㄨㄢˋ', vietnamese: 'Cúp máy', english: 'Hang up', difficulty: 3 },
    { traditional: '留言', simplified: '留言', pinyin: 'liú yán', zhuyin: 'ㄌㄧㄡˊ ㄧㄢˊ', vietnamese: 'Để lại lời nhắn', english: 'Leave a message', difficulty: 3 },
    { traditional: '打錯了', simplified: '打错了', pinyin: 'dǎ cuò le', zhuyin: 'ㄉㄚˇ ㄘㄨㄛˋ ㄌㄜ˙', vietnamese: 'Gọi nhầm rồi', english: 'Wrong number', difficulty: 3 },
    { traditional: '訊號不好', simplified: '讯号不好', pinyin: 'xùn hào bù hǎo', zhuyin: 'ㄒㄩㄣˋ ㄏㄠˋ ㄅㄨˋ ㄏㄠˇ', vietnamese: 'Sóng không tốt', english: 'Bad signal', difficulty: 3 },
    { traditional: '回電', simplified: '回电', pinyin: 'huí diàn', zhuyin: 'ㄏㄨㄟˊ ㄉㄧㄢˋ', vietnamese: 'Gọi lại', english: 'Call back', difficulty: 3 },
    { traditional: '佔線', simplified: '占线', pinyin: 'zhàn xiàn', zhuyin: 'ㄓㄢˋ ㄒㄧㄢˋ', vietnamese: 'Máy bận', english: 'Line is busy', difficulty: 3 }
  ],
  'xu-ly-tinh-huong': [
    { traditional: '處理', simplified: '处理', pinyin: 'chǔ lǐ', zhuyin: 'ㄔㄨˇ ㄌㄧˇ', vietnamese: 'Xử lý', english: 'Handle, deal with', difficulty: 3 },
    { traditional: '解決', simplified: '解决', pinyin: 'jiě jué', zhuyin: 'ㄐㄧㄝˇ ㄐㄩㄝˊ', vietnamese: 'Giải quyết', english: 'Solve', difficulty: 3 },
    { traditional: '麻煩', simplified: '麻烦', pinyin: 'má fán', zhuyin: 'ㄇㄚˊ ㄈㄢˊ', vietnamese: 'Phiền phức', english: 'Trouble', difficulty: 3 },
    { traditional: '遭遇', simplified: '遭遇', pinyin: 'zāo yù', zhuyin: 'ㄗㄠ ㄩˋ', vietnamese: 'Gặp phải', english: 'Encounter', difficulty: 3 },
    { traditional: '應對', simplified: '应对', pinyin: 'yìng duì', zhuyin: 'ㄧㄥˋ ㄉㄨㄟˋ', vietnamese: 'Ứng đối', english: 'Deal with, respond', difficulty: 3 },
    { traditional: '緊急情況', simplified: '紧急情况', pinyin: 'jǐn jí qíng kuàng', zhuyin: 'ㄐㄧㄣˇ ㄐㄧˊ ㄑㄧㄥˊ ㄎㄨㄤˋ', vietnamese: 'Tình huống khẩn cấp', english: 'Emergency', difficulty: 3 },
    { traditional: '冷靜', simplified: '冷静', pinyin: 'lěng jìng', zhuyin: 'ㄌㄥˇ ㄐㄧㄥˋ', vietnamese: 'Bình tĩnh', english: 'Calm down', difficulty: 3 },
    { traditional: '尋求幫助', simplified: '寻求帮助', pinyin: 'xún qiú bāng zhù', zhuyin: 'ㄒㄩㄣˊ ㄑㄧㄡˊ ㄅㄤ ㄓㄨˋ', vietnamese: 'Tìm kiếm sự giúp đỡ', english: 'Seek help', difficulty: 3 },
    { traditional: '採取措施', simplified: '采取措施', pinyin: 'cǎi qǔ cuò shī', zhuyin: 'ㄘㄞˇ ㄑㄩˇ ㄘㄨㄛˋ ㄕ', vietnamese: 'Thực hiện biện pháp', english: 'Take measures', difficulty: 3 },
    { traditional: '順利解決', simplified: '顺利解决', pinyin: 'shùn lì jiě jué', zhuyin: 'ㄕㄨㄣˋ ㄌㄧˋ ㄐㄧㄝˇ ㄐㄩㄝˊ', vietnamese: 'Giải quyết thuận lợi', english: 'Solve smoothly', difficulty: 3 }
  ],
  'phan-nan-gop-y': [
    { traditional: '抱怨', simplified: '抱怨', pinyin: 'bào yuàn', zhuyin: 'ㄅㄠˋ ㄩㄢˋ', vietnamese: 'Phàn nàn', english: 'Complain', difficulty: 3 },
    { traditional: '投訴', simplified: '投诉', pinyin: 'tóu sù', zhuyin: 'ㄊㄡˊ ㄙㄨˋ', vietnamese: 'Khiếu nại', english: 'File a complaint', difficulty: 3 },
    { traditional: '不滿意', simplified: '不满意', pinyin: 'bù mǎn yì', zhuyin: 'ㄅㄨˋ ㄇㄢˇ ㄧˋ', vietnamese: 'Không hài lòng', english: 'Dissatisfied', difficulty: 3 },
    { traditional: '建議', simplified: '建议', pinyin: 'jiàn yì', zhuyin: 'ㄐㄧㄢˋ ㄧˋ', vietnamese: 'Đề nghị', english: 'Suggestion', difficulty: 3 },
    { traditional: '改善', simplified: '改善', pinyin: 'gǎi shàn', zhuyin: 'ㄍㄞˇ ㄕㄢˋ', vietnamese: 'Cải thiện', english: 'Improve', difficulty: 3 },
    { traditional: '反映', simplified: '反映', pinyin: 'fǎn yìng', zhuyin: 'ㄈㄢˇ ㄧㄥˋ', vietnamese: 'Phản ánh', english: 'Reflect, report', difficulty: 3 },
    { traditional: '提出意見', simplified: '提出意见', pinyin: 'tí chū yì jiàn', zhuyin: 'ㄊㄧˊ ㄔㄨ ㄧˋ ㄐㄧㄢˋ', vietnamese: 'Đưa ra ý kiến', english: 'Give opinions', difficulty: 3 },
    { traditional: '服務態度', simplified: '服务态度', pinyin: 'fú wù tài dù', zhuyin: 'ㄈㄨˊ ㄨˋ ㄊㄞˋ ㄉㄨˋ', vietnamese: 'Thái độ phục vụ', english: 'Service attitude', difficulty: 3 },
    { traditional: '品質問題', simplified: '品质问题', pinyin: 'pǐn zhì wèn tí', zhuyin: 'ㄆㄧㄣˇ ㄓˋ ㄨㄣˋ ㄊㄧˊ', vietnamese: 'Vấn đề chất lượng', english: 'Quality issue', difficulty: 3 },
    { traditional: '希望改進', simplified: '希望改进', pinyin: 'xī wàng gǎi jìn', zhuyin: 'ㄒㄧ ㄨㄤˋ ㄍㄞˇ ㄐㄧㄣˋ', vietnamese: 'Hy vọng cải tiến', english: 'Hope to improve', difficulty: 3 }
  ],
  'hai-huoc-noi-dua': [
    { traditional: '開玩笑', simplified: '开玩笑', pinyin: 'kāi wán xiào', zhuyin: 'ㄎㄞ ㄨㄢˊ ㄒㄧㄠˋ', vietnamese: 'Nói đùa', english: 'Just kidding', difficulty: 3 },
    { traditional: '逗', simplified: '逗', pinyin: 'dòu', zhuyin: 'ㄉㄡˋ', vietnamese: 'Trêu chọc', english: 'Tease', difficulty: 3 },
    { traditional: '好笑', simplified: '好笑', pinyin: 'hǎo xiào', zhuyin: 'ㄏㄠˇ ㄒㄧㄠˋ', vietnamese: 'Buồn cười', english: 'Funny', difficulty: 3 },
    { traditional: '幽默', simplified: '幽默', pinyin: 'yōu mò', zhuyin: 'ㄧㄡ ㄇㄛˋ', vietnamese: 'Hài hước', english: 'Humorous', difficulty: 3 },
    { traditional: '搞笑', simplified: '搞笑', pinyin: 'gǎo xiào', zhuyin: 'ㄍㄠˇ ㄒㄧㄠˋ', vietnamese: 'Làm trò hề', english: 'Funny, hilarious', difficulty: 3 },
    { traditional: '冷笑話', simplified: '冷笑话', pinyin: 'lěng xiào huà', zhuyin: 'ㄌㄥˇ ㄒㄧㄠˋ ㄏㄨㄚˋ', vietnamese: 'Truyện cười lạnh', english: 'Cold joke', difficulty: 3 },
    { traditional: '笑死了', simplified: '笑死了', pinyin: 'xiào sǐ le', zhuyin: 'ㄒㄧㄠˋ ㄙˇ ㄌㄜ˙', vietnamese: 'Cười chết', english: 'Hilarious', difficulty: 3 },
    { traditional: '逗趣', simplified: '逗趣', pinyin: 'dòu qù', zhuyin: 'ㄉㄡˋ ㄑㄩˋ', vietnamese: 'Hài hước', english: 'Amusing', difficulty: 3 },
    { traditional: '別當真', simplified: '别当真', pinyin: 'bié dāng zhēn', zhuyin: 'ㄅㄧㄝˊ ㄉㄤ ㄓㄣ', vietnamese: 'Đừng nghiêm túc', english: 'Don\'t take it seriously', difficulty: 3 },
    { traditional: '開開玩笑而已', simplified: '开开玩笑而已', pinyin: 'kāi kai wán xiào ér yǐ', zhuyin: 'ㄎㄞ ㄎㄞ˙ ㄨㄢˊ ㄒㄧㄠˋ ㄦˊ ㄧˇ', vietnamese: 'Chỉ nói đùa thôi', english: 'Just joking', difficulty: 3 }
  ],
  'ngon-ngu-doi-song-tieng-long': [
    { traditional: '超', simplified: '超', pinyin: 'chāo', zhuyin: 'ㄔㄠ', vietnamese: 'Cực kỳ', english: 'Super, very', difficulty: 3 },
    { traditional: '帥', simplified: '帅', pinyin: 'shuài', zhuyin: 'ㄕㄨㄞˋ', vietnamese: 'Đẹp trai', english: 'Handsome, cool', difficulty: 3 },
    { traditional: '正', simplified: '正', pinyin: 'zhèng', zhuyin: 'ㄓㄥˋ', vietnamese: 'Xinh, đẹp', english: 'Hot, beautiful', difficulty: 3 },
    { traditional: '酷', simplified: '酷', pinyin: 'kù', zhuyin: 'ㄎㄨˋ', vietnamese: 'Ngầu', english: 'Cool', difficulty: 3 },
    { traditional: '遜', simplified: '逊', pinyin: 'xùn', zhuyin: 'ㄒㄩㄣˋ', vietnamese: 'Tệ, kém', english: 'Lame', difficulty: 3 },
    { traditional: '屌', simplified: '屌', pinyin: 'diǎo', zhuyin: 'ㄉㄧㄠˇ', vietnamese: 'Ngầu, đỉnh', english: 'Awesome (slang)', difficulty: 3 },
    { traditional: '爛', simplified: '烂', pinyin: 'làn', zhuyin: 'ㄌㄢˋ', vietnamese: 'Tệ, dở', english: 'Bad, terrible', difficulty: 3 },
    { traditional: '讚', simplified: '赞', pinyin: 'zàn', zhuyin: 'ㄗㄢˋ', vietnamese: 'Tuyệt, đỉnh', english: 'Awesome, great', difficulty: 3 },
    { traditional: '扯', simplified: '扯', pinyin: 'chě', zhuyin: 'ㄔㄜˇ', vietnamese: 'Vô lý', english: 'Ridiculous', difficulty: 3 },
    { traditional: '潮', simplified: '潮', pinyin: 'cháo', zhuyin: 'ㄔㄠˊ', vietnamese: 'Hợp thời trang', english: 'Trendy, fashionable', difficulty: 3 }
  ]
};

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/learn-chinese';

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Main seed function
async function seedData() {
  try {
    await connectDB();

    console.log('\n════════════════════════════════════════');
    console.log('🌱 SEEDING INTERMEDIATE LEVEL DATA');
    console.log('════════════════════════════════════════\n');

    // Find admin user
    const adminUser = await User.findOne({ username: ADMIN_USERNAME });
    if (!adminUser) {
      console.error(`❌ Admin user "${ADMIN_USERNAME}" not found!`);
      console.log('Please create the admin user first.');
      process.exit(1);
    }

    console.log(`👤 Found admin user: ${adminUser.username} (${adminUser.email})\n`);

    let categoriesCreated = 0;
    let wordsCreated = 0;

    // Create categories and words
    for (const catData of categoriesData) {
      console.log(`📁 Processing category: ${catData.name}...`);

      // Check if category already exists
      const existingCategory = await Category.findOne({
        userId: adminUser._id,
        slug: catData.slug
      });

      let category;
      if (existingCategory) {
        console.log(`  ⚠️  Category "${catData.name}" already exists, using existing...`);
        category = existingCategory;
      } else {
        category = await Category.create({
          ...catData,
          userId: adminUser._id,
          isPublic: true,
          isSystem: false
        });
        categoriesCreated++;
        console.log(`  ✅ Created category: ${catData.name}`);
      }

      // Add words for this category
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
