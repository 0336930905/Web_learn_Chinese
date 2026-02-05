/**
 * Seed Advanced Level Categories and Words
 * Tạo 20 categories cao cấp với 10 words mỗi category cho admin user nhhaoa20135
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../api/models/User');
const Category = require('../api/models/Category');
const Word = require('../api/models/Word');

// Admin username
const ADMIN_USERNAME = 'nhhaoa20135';

// Categories data - Advanced Level
const categoriesData = [
  {
    slug: 'ngu-phap-hoc-thuat',
    name: 'Ngữ pháp học thuật nâng cao',
    description: 'Ngữ pháp tiếng Trung trình độ học thuật',
    icon: '📚',
    color: '#667eea',
    order: 41
  },
  {
    slug: 'bien-the-vung-mien-dai',
    name: 'Biến thể vùng miền trong tiếng Đài',
    description: 'Sự khác biệt ngôn ngữ giữa các vùng miền Đài Loan',
    icon: '🗺️',
    color: '#f093fb',
    order: 42
  },
  {
    slug: 'phan-tich-dien-ngon',
    name: 'Phân tích diễn ngôn',
    description: 'Phân tích và nghiên cứu diễn ngôn',
    icon: '🔍',
    color: '#4facfe',
    order: 43
  },
  {
    slug: 'ngon-ngu-chinh-tri',
    name: 'Ngôn ngữ chính trị',
    description: 'Từ vựng và ngôn ngữ chính trị',
    icon: '🏛️',
    color: '#43e97b',
    order: 44
  },
  {
    slug: 'ngon-ngu-kinh-doanh-chuyen-sau',
    name: 'Ngôn ngữ kinh doanh chuyên sâu',
    description: 'Thuật ngữ kinh doanh và tài chính chuyên nghiệp',
    icon: '💼',
    color: '#fa709a',
    order: 45
  },
  {
    slug: 'tranh-luan-hoc-thuat',
    name: 'Tranh luận học thuật',
    description: 'Kỹ năng tranh luận và biện luận học thuật',
    icon: '🎓',
    color: '#30cfd0',
    order: 46
  },
  {
    slug: 'dien-thuyet-hung-bien',
    name: 'Diễn thuyết – hùng biện',
    description: 'Nghệ thuật diễn thuyết và hùng biện',
    icon: '🎤',
    color: '#a8edea',
    order: 47
  },
  {
    slug: 'van-hoc-tieng-dai',
    name: 'Văn học tiếng Đài',
    description: 'Văn học và tác phẩm văn học Đài Loan',
    icon: '📖',
    color: '#f5af19',
    order: 48
  },
  {
    slug: 'phim-anh-kich-ban',
    name: 'Phim ảnh – kịch bản – thoại tự nhiên',
    description: 'Ngôn ngữ trong phim ảnh và kịch bản',
    icon: '🎬',
    color: '#fbc2eb',
    order: 49
  },
  {
    slug: 'bao-chi-binh-luan',
    name: 'Báo chí – bình luận thời sự',
    description: 'Ngôn ngữ báo chí và bình luận',
    icon: '📰',
    color: '#a1c4fd',
    order: 50
  },
  {
    slug: 'ngon-ngu-phap-ly',
    name: 'Ngôn ngữ pháp lý',
    description: 'Thuật ngữ pháp luật và văn bản pháp lý',
    icon: '⚖️',
    color: '#d299c2',
    order: 51
  },
  {
    slug: 'ngon-ngu-y-te',
    name: 'Ngôn ngữ y tế – chuyên ngành',
    description: 'Thuật ngữ y học và chăm sóc sức khỏe',
    icon: '⚕️',
    color: '#ffecd2',
    order: 52
  },
  {
    slug: 'dich-thuat-hoa-dai',
    name: 'Dịch thuật Hoa ↔ Đài',
    description: 'Kỹ năng dịch thuật giữa tiếng Hoa và tiếng Đài',
    icon: '🔄',
    color: '#ff9a9e',
    order: 53
  },
  {
    slug: 'so-sanh-dai-quan-thoai',
    name: 'So sánh tiếng Đài – tiếng Quan Thoại',
    description: 'Sự khác biệt giữa tiếng Đài và tiếng Quan Thoại',
    icon: '↔️',
    color: '#fad0c4',
    order: 54
  },
  {
    slug: 'an-du-ham-y',
    name: 'Ẩn dụ – hàm ý – nói bóng gió',
    description: 'Nghệ thuật nói ẩn dụ và hàm ý',
    icon: '🌙',
    color: '#a18cd1',
    order: 55
  },
  {
    slug: 'cham-biem-mia-mai',
    name: 'Châm biếm – mỉa mai',
    description: 'Ngôn ngữ châm biếm và mỉa mai',
    icon: '😏',
    color: '#fbc2eb',
    order: 56
  },
  {
    slug: 'ngon-ngu-mang-xa-hoi',
    name: 'Ngôn ngữ mạng xã hội',
    description: 'Thuật ngữ và ngôn ngữ trên mạng xã hội',
    icon: '📱',
    color: '#fdcb6e',
    order: 57
  },
  {
    slug: 'giao-tiep-da-van-hoa',
    name: 'Giao tiếp đa văn hóa',
    description: 'Giao tiếp trong bối cảnh đa văn hóa',
    icon: '🌏',
    color: '#e17055',
    order: 58
  },
  {
    slug: 'lich-su-tieng-dai',
    name: 'Lịch sử phát triển tiếng Đài',
    description: 'Lịch sử và sự phát triển của tiếng Đài',
    icon: '📜',
    color: '#00b894',
    order: 59
  },
  {
    slug: 'phong-cach-ban-xu-cao-cap',
    name: 'Phong cách nói bản xứ cao cấp',
    description: 'Phong cách nói như người bản xứ',
    icon: '🗣️',
    color: '#6c5ce7',
    order: 60
  }
];

// Words data for each category
const wordsData = {
  'ngu-phap-hoc-thuat': [
    { traditional: '假設語氣', simplified: '假设语气', pinyin: 'jiǎ shè yǔ qì', zhuyin: 'ㄐㄧㄚˇ ㄕㄜˋ ㄩˇ ㄑㄧˋ', vietnamese: 'Ngữ khí giả định', english: 'Subjunctive mood', difficulty: 4 },
    { traditional: '修辭手法', simplified: '修辞手法', pinyin: 'xiū cí shǒu fǎ', zhuyin: 'ㄒㄧㄡ ㄘˊ ㄕㄡˇ ㄈㄚˇ', vietnamese: 'Thủ pháp tu từ', english: 'Rhetorical device', difficulty: 4 },
    { traditional: '倒裝句', simplified: '倒装句', pinyin: 'dào zhuāng jù', zhuyin: 'ㄉㄠˋ ㄓㄨㄤ ㄐㄩˋ', vietnamese: 'Câu đảo ngữ', english: 'Inverted sentence', difficulty: 4 },
    { traditional: '被動語態', simplified: '被动语态', pinyin: 'bèi dòng yǔ tài', zhuyin: 'ㄅㄟˋ ㄉㄨㄥˋ ㄩˇ ㄊㄞˋ', vietnamese: 'Thể bị động', english: 'Passive voice', difficulty: 4 },
    { traditional: '複句結構', simplified: '复句结构', pinyin: 'fù jù jié gòu', zhuyin: 'ㄈㄨˋ ㄐㄩˋ ㄐㄧㄝˊ ㄍㄡˋ', vietnamese: 'Cấu trúc câu phức', english: 'Complex sentence structure', difficulty: 4 },
    { traditional: '補語', simplified: '补语', pinyin: 'bǔ yǔ', zhuyin: 'ㄅㄨˇ ㄩˇ', vietnamese: 'Bổ ngữ', english: 'Complement', difficulty: 4 },
    { traditional: '語義學', simplified: '语义学', pinyin: 'yǔ yì xué', zhuyin: 'ㄩˇ ㄧˋ ㄒㄩㄝˊ', vietnamese: 'Ngữ nghĩa học', english: 'Semantics', difficulty: 4 },
    { traditional: '句法分析', simplified: '句法分析', pinyin: 'jù fǎ fēn xī', zhuyin: 'ㄐㄩˋ ㄈㄚˇ ㄈㄣ ㄒㄧ', vietnamese: 'Phân tích cú pháp', english: 'Syntactic analysis', difficulty: 4 },
    { traditional: '詞性轉換', simplified: '词性转换', pinyin: 'cí xìng zhuǎn huàn', zhuyin: 'ㄘˊ ㄒㄧㄥˋ ㄓㄨㄢˇ ㄏㄨㄢˋ', vietnamese: 'Chuyển đổi từ loại', english: 'Part of speech conversion', difficulty: 4 },
    { traditional: '連動式', simplified: '连动式', pinyin: 'lián dòng shì', zhuyin: 'ㄌㄧㄢˊ ㄉㄨㄥˋ ㄕˋ', vietnamese: 'Cấu trúc liên động', english: 'Serial verb construction', difficulty: 4 }
  ],
  'bien-the-vung-mien-dai': [
    { traditional: '北部腔', simplified: '北部腔', pinyin: 'běi bù qiāng', zhuyin: 'ㄅㄟˇ ㄅㄨˋ ㄑㄧㄤ', vietnamese: 'Giọng miền Bắc (Đài Loan)', english: 'Northern accent', difficulty: 4 },
    { traditional: '南部腔', simplified: '南部腔', pinyin: 'nán bù qiāng', zhuyin: 'ㄋㄢˊ ㄅㄨˋ ㄑㄧㄤ', vietnamese: 'Giọng miền Nam (Đài Loan)', english: 'Southern accent', difficulty: 4 },
    { traditional: '客家話', simplified: '客家话', pinyin: 'kè jiā huà', zhuyin: 'ㄎㄜˋ ㄐㄧㄚ ㄏㄨㄚˋ', vietnamese: 'Tiếng Khách Gia', english: 'Hakka language', difficulty: 4 },
    { traditional: '閩南語', simplified: '闽南语', pinyin: 'mǐn nán yǔ', zhuyin: 'ㄇㄧㄣˇ ㄋㄢˊ ㄩˇ', vietnamese: 'Tiếng Mân Nam', english: 'Hokkien, Taiwanese', difficulty: 4 },
    { traditional: '台語', simplified: '台语', pinyin: 'tái yǔ', zhuyin: 'ㄊㄞˊ ㄩˇ', vietnamese: 'Tiếng Đài', english: 'Taiwanese (Hokkien)', difficulty: 4 },
    { traditional: '原住民語言', simplified: '原住民语言', pinyin: 'yuán zhù mín yǔ yán', zhuyin: 'ㄩㄢˊ ㄓㄨˋ ㄇㄧㄣˊ ㄩˇ ㄧㄢˊ', vietnamese: 'Ngôn ngữ thổ dân', english: 'Indigenous languages', difficulty: 4 },
    { traditional: '方言差異', simplified: '方言差异', pinyin: 'fāng yán chā yì', zhuyin: 'ㄈㄤ ㄧㄢˊ ㄔㄚ ㄧˋ', vietnamese: 'Sự khác biệt phương ngữ', english: 'Dialect differences', difficulty: 4 },
    { traditional: '語音變化', simplified: '语音变化', pinyin: 'yǔ yīn biàn huà', zhuyin: 'ㄩˇ ㄧㄣ ㄅㄧㄢˋ ㄏㄨㄚˋ', vietnamese: 'Biến đổi ngữ âm', english: 'Phonetic variation', difficulty: 4 },
    { traditional: '在地用語', simplified: '在地用语', pinyin: 'zài dì yòng yǔ', zhuyin: 'ㄗㄞˋ ㄉㄧˋ ㄩㄥˋ ㄩˇ', vietnamese: 'Thuật ngữ địa phương', english: 'Local terminology', difficulty: 4 },
    { traditional: '混合語碼', simplified: '混合语码', pinyin: 'hùn hé yǔ mǎ', zhuyin: 'ㄏㄨㄣˋ ㄏㄜˊ ㄩˇ ㄇㄚˇ', vietnamese: 'Pha trộn ngôn ngữ', english: 'Code-mixing', difficulty: 4 }
  ],
  'phan-tich-dien-ngon': [
    { traditional: '話語分析', simplified: '话语分析', pinyin: 'huà yǔ fēn xī', zhuyin: 'ㄏㄨㄚˋ ㄩˇ ㄈㄣ ㄒㄧ', vietnamese: 'Phân tích diễn ngôn', english: 'Discourse analysis', difficulty: 4 },
    { traditional: '語境', simplified: '语境', pinyin: 'yǔ jìng', zhuyin: 'ㄩˇ ㄐㄧㄥˋ', vietnamese: 'Ngữ cảnh', english: 'Context', difficulty: 4 },
    { traditional: '言外之意', simplified: '言外之意', pinyin: 'yán wài zhī yì', zhuyin: 'ㄧㄢˊ ㄨㄞˋ ㄓ ㄧˋ', vietnamese: 'Ý ngoài lời', english: 'Implication', difficulty: 4 },
    { traditional: '語用學', simplified: '语用学', pinyin: 'yǔ yòng xué', zhuyin: 'ㄩˇ ㄩㄥˋ ㄒㄩㄝˊ', vietnamese: 'Ngữ dụng học', english: 'Pragmatics', difficulty: 4 },
    { traditional: '會話分析', simplified: '会话分析', pinyin: 'huì huà fēn xī', zhuyin: 'ㄏㄨㄟˋ ㄏㄨㄚˋ ㄈㄣ ㄒㄧ', vietnamese: 'Phân tích hội thoại', english: 'Conversation analysis', difficulty: 4 },
    { traditional: '敘事結構', simplified: '叙事结构', pinyin: 'xù shì jié gòu', zhuyin: 'ㄒㄩˋ ㄕˋ ㄐㄧㄝˊ ㄍㄡˋ', vietnamese: 'Cấu trúc tường thuật', english: 'Narrative structure', difficulty: 4 },
    { traditional: '修辭策略', simplified: '修辞策略', pinyin: 'xiū cí cè lüè', zhuyin: 'ㄒㄧㄡ ㄘˊ ㄘㄜˋ ㄌㄩㄝˋ', vietnamese: 'Chiến lược tu từ', english: 'Rhetorical strategy', difficulty: 4 },
    { traditional: '權力關係', simplified: '权力关系', pinyin: 'quán lì guān xì', zhuyin: 'ㄑㄩㄢˊ ㄌㄧˋ ㄍㄨㄢ ㄒㄧˋ', vietnamese: 'Quan hệ quyền lực', english: 'Power relations', difficulty: 4 },
    { traditional: '意識形態', simplified: '意识形态', pinyin: 'yì shí xíng tài', zhuyin: 'ㄧˋ ㄕˊ ㄒㄧㄥˊ ㄊㄞˋ', vietnamese: 'Ý thức hệ', english: 'Ideology', difficulty: 4 },
    { traditional: '批判性分析', simplified: '批判性分析', pinyin: 'pī pàn xìng fēn xī', zhuyin: 'ㄆㄧ ㄆㄢˋ ㄒㄧㄥˋ ㄈㄣ ㄒㄧ', vietnamese: 'Phân tích phê phán', english: 'Critical analysis', difficulty: 4 }
  ],
  'ngon-ngu-chinh-tri': [
    { traditional: '民主', simplified: '民主', pinyin: 'mín zhǔ', zhuyin: 'ㄇㄧㄣˊ ㄓㄨˇ', vietnamese: 'Dân chủ', english: 'Democracy', difficulty: 4 },
    { traditional: '立法院', simplified: '立法院', pinyin: 'lì fǎ yuàn', zhuyin: 'ㄌㄧˋ ㄈㄚˇ ㄩㄢˋ', vietnamese: 'Viện lập pháp', english: 'Legislative Yuan', difficulty: 4 },
    { traditional: '總統', simplified: '总统', pinyin: 'zǒng tǒng', zhuyin: 'ㄗㄨㄥˇ ㄊㄨㄥˇ', vietnamese: 'Tổng thống', english: 'President', difficulty: 4 },
    { traditional: '選舉', simplified: '选举', pinyin: 'xuǎn jǔ', zhuyin: 'ㄒㄩㄢˇ ㄐㄩˇ', vietnamese: 'Bầu cử', english: 'Election', difficulty: 4 },
    { traditional: '政黨', simplified: '政党', pinyin: 'zhèng dǎng', zhuyin: 'ㄓㄥˋ ㄉㄤˇ', vietnamese: 'Chính đảng', english: 'Political party', difficulty: 4 },
    { traditional: '兩岸關係', simplified: '两岸关系', pinyin: 'liǎng àn guān xì', zhuyin: 'ㄌㄧㄤˇ ㄢˋ ㄍㄨㄢ ㄒㄧˋ', vietnamese: 'Quan hệ hai bờ eo biển', english: 'Cross-strait relations', difficulty: 4 },
    { traditional: '外交政策', simplified: '外交政策', pinyin: 'wài jiāo zhèng cè', zhuyin: 'ㄨㄞˋ ㄐㄧㄠ ㄓㄥˋ ㄘㄜˋ', vietnamese: 'Chính sách ngoại giao', english: 'Foreign policy', difficulty: 4 },
    { traditional: '憲法', simplified: '宪法', pinyin: 'xiàn fǎ', zhuyin: 'ㄒㄧㄢˋ ㄈㄚˇ', vietnamese: 'Hiến pháp', english: 'Constitution', difficulty: 4 },
    { traditional: '主權', simplified: '主权', pinyin: 'zhǔ quán', zhuyin: 'ㄓㄨˇ ㄑㄩㄢˊ', vietnamese: 'Chủ quyền', english: 'Sovereignty', difficulty: 4 },
    { traditional: '國會議員', simplified: '国会议员', pinyin: 'guó huì yì yuán', zhuyin: 'ㄍㄨㄛˊ ㄏㄨㄟˋ ㄧˋ ㄩㄢˊ', vietnamese: 'Nghị sĩ quốc hội', english: 'Parliament member', difficulty: 4 }
  ],
  'ngon-ngu-kinh-doanh-chuyen-sau': [
    { traditional: '併購', simplified: '并购', pinyin: 'bìng gòu', zhuyin: 'ㄅㄧㄥˋ ㄍㄡˋ', vietnamese: 'Sáp nhập', english: 'Merger and acquisition', difficulty: 4 },
    { traditional: '股東', simplified: '股东', pinyin: 'gǔ dōng', zhuyin: 'ㄍㄨˇ ㄉㄨㄥ', vietnamese: 'Cổ đông', english: 'Shareholder', difficulty: 4 },
    { traditional: '資產負債表', simplified: '资产负债表', pinyin: 'zī chǎn fù zhài biǎo', zhuyin: 'ㄗ ㄔㄢˇ ㄈㄨˋ ㄓㄞˋ ㄅㄧㄠˇ', vietnamese: 'Bảng cân đối kế toán', english: 'Balance sheet', difficulty: 4 },
    { traditional: '現金流', simplified: '现金流', pinyin: 'xiàn jīn liú', zhuyin: 'ㄒㄧㄢˋ ㄐㄧㄣ ㄌㄧㄡˊ', vietnamese: 'Dòng tiền', english: 'Cash flow', difficulty: 4 },
    { traditional: '投資報酬率', simplified: '投资报酬率', pinyin: 'tóu zī bào chóu lǜ', zhuyin: 'ㄊㄡˊ ㄗ ㄅㄠˋ ㄔㄡˊ ㄌㄩˋ', vietnamese: 'Tỷ suất lợi nhuận đầu tư', english: 'Return on investment (ROI)', difficulty: 4 },
    { traditional: '供應鏈', simplified: '供应链', pinyin: 'gōng yìng liàn', zhuyin: 'ㄍㄨㄥ ㄧㄥˋ ㄌㄧㄢˋ', vietnamese: 'Chuỗi cung ứng', english: 'Supply chain', difficulty: 4 },
    { traditional: '市場佔有率', simplified: '市场占有率', pinyin: 'shì chǎng zhàn yǒu lǜ', zhuyin: 'ㄕˋ ㄔㄤˇ ㄓㄢˋ ㄧㄡˇ ㄌㄩˋ', vietnamese: 'Thị phần', english: 'Market share', difficulty: 4 },
    { traditional: '企業策略', simplified: '企业策略', pinyin: 'qǐ yè cè lüè', zhuyin: 'ㄑㄧˇ ㄧㄝˋ ㄘㄜˋ ㄌㄩㄝˋ', vietnamese: 'Chiến lược doanh nghiệp', english: 'Corporate strategy', difficulty: 4 },
    { traditional: '風險管理', simplified: '风险管理', pinyin: 'fēng xiǎn guǎn lǐ', zhuyin: 'ㄈㄥ ㄒㄧㄢˇ ㄍㄨㄢˇ ㄌㄧˇ', vietnamese: 'Quản lý rủi ro', english: 'Risk management', difficulty: 4 },
    { traditional: '盡職調查', simplified: '尽职调查', pinyin: 'jìn zhí diào chá', zhuyin: 'ㄐㄧㄣˋ ㄓˊ ㄉㄧㄠˋ ㄔㄚˊ', vietnamese: 'Thẩm định', english: 'Due diligence', difficulty: 4 }
  ],
  'tranh-luan-hoc-thuat': [
    { traditional: '論證', simplified: '论证', pinyin: 'lùn zhèng', zhuyin: 'ㄌㄨㄣˋ ㄓㄥˋ', vietnamese: 'Luận chứng', english: 'Argumentation', difficulty: 4 },
    { traditional: '假說', simplified: '假说', pinyin: 'jiǎ shuō', zhuyin: 'ㄐㄧㄚˇ ㄕㄨㄛ', vietnamese: 'Giả thuyết', english: 'Hypothesis', difficulty: 4 },
    { traditional: '實證研究', simplified: '实证研究', pinyin: 'shí zhèng yán jiū', zhuyin: 'ㄕˊ ㄓㄥˋ ㄧㄢˊ ㄐㄧㄡ', vietnamese: 'Nghiên cứu thực nghiệm', english: 'Empirical research', difficulty: 4 },
    { traditional: '邏輯謬誤', simplified: '逻辑谬误', pinyin: 'luó ji miù wù', zhuyin: 'ㄌㄨㄛˊ ㄐㄧˊ ㄇㄧㄡˋ ㄨˋ', vietnamese: 'Ngụy biện logic', english: 'Logical fallacy', difficulty: 4 },
    { traditional: '反駁論點', simplified: '反驳论点', pinyin: 'fǎn bó lùn diǎn', zhuyin: 'ㄈㄢˇ ㄅㄛˊ ㄌㄨㄣˋ ㄉㄧㄢˇ', vietnamese: 'Phản bác luận điểm', english: 'Counter-argument', difficulty: 4 },
    { traditional: '引用文獻', simplified: '引用文献', pinyin: 'yǐn yòng wén xiàn', zhuyin: 'ㄧㄣˇ ㄩㄥˋ ㄨㄣˊ ㄒㄧㄢˋ', vietnamese: 'Trích dẫn tài liệu', english: 'Citation', difficulty: 4 },
    { traditional: '學術辯論', simplified: '学术辩论', pinyin: 'xué shù biàn lùn', zhuyin: 'ㄒㄩㄝˊ ㄕㄨˋ ㄅㄧㄢˋ ㄌㄨㄣˋ', vietnamese: 'Tranh luận học thuật', english: 'Academic debate', difficulty: 4 },
    { traditional: '批判性思維', simplified: '批判性思维', pinyin: 'pī pàn xìng sī wéi', zhuyin: 'ㄆㄧ ㄆㄢˋ ㄒㄧㄥˋ ㄙ ㄨㄟˊ', vietnamese: 'Tư duy phê phán', english: 'Critical thinking', difficulty: 4 },
    { traditional: '理論框架', simplified: '理论框架', pinyin: 'lǐ lùn kuàng jià', zhuyin: 'ㄌㄧˇ ㄌㄨㄣˋ ㄎㄨㄤˋ ㄐㄧㄚˋ', vietnamese: 'Khung lý thuyết', english: 'Theoretical framework', difficulty: 4 },
    { traditional: '結論', simplified: '结论', pinyin: 'jié lùn', zhuyin: 'ㄐㄧㄝˊ ㄌㄨㄣˋ', vietnamese: 'Kết luận', english: 'Conclusion', difficulty: 4 }
  ],
  'dien-thuyet-hung-bien': [
    { traditional: '演講稿', simplified: '演讲稿', pinyin: 'yǎn jiǎng gǎo', zhuyin: 'ㄧㄢˇ ㄐㄧㄤˇ ㄍㄠˇ', vietnamese: 'Bản diễn thuyết', english: 'Speech script', difficulty: 4 },
    { traditional: '口才', simplified: '口才', pinyin: 'kǒu cái', zhuyin: 'ㄎㄡˇ ㄘㄞˊ', vietnamese: 'Khẩu tài', english: 'Eloquence', difficulty: 4 },
    { traditional: '說服力', simplified: '说服力', pinyin: 'shuō fú lì', zhuyin: 'ㄕㄨㄛ ㄈㄨˊ ㄌㄧˋ', vietnamese: 'Sức thuyết phục', english: 'Persuasiveness', difficulty: 4 },
    { traditional: '肢體語言', simplified: '肢体语言', pinyin: 'zhī tǐ yǔ yán', zhuyin: 'ㄓ ㄊㄧˇ ㄩˇ ㄧㄢˊ', vietnamese: 'Ngôn ngữ cơ thể', english: 'Body language', difficulty: 4 },
    { traditional: '氣勢', simplified: '气势', pinyin: 'qì shì', zhuyin: 'ㄑㄧˋ ㄕˋ', vietnamese: 'Khí thế', english: 'Momentum, presence', difficulty: 4 },
    { traditional: '即興演說', simplified: '即兴演说', pinyin: 'jí xìng yǎn shuō', zhuyin: 'ㄐㄧˊ ㄒㄧㄥˋ ㄧㄢˇ ㄕㄨㄛ', vietnamese: 'Diễn thuyết ngẫu hứng', english: 'Impromptu speech', difficulty: 4 },
    { traditional: '感染力', simplified: '感染力', pinyin: 'gǎn rǎn lì', zhuyin: 'ㄍㄢˇ ㄖㄢˇ ㄌㄧˋ', vietnamese: 'Sức lây lan, sức hấp dẫn', english: 'Charisma', difficulty: 4 },
    { traditional: '引起共鳴', simplified: '引起共鸣', pinyin: 'yǐn qǐ gòng míng', zhuyin: 'ㄧㄣˇ ㄑㄧˇ ㄍㄨㄥˋ ㄇㄧㄥˊ', vietnamese: 'Gây cộng hưởng', english: 'Resonate', difficulty: 4 },
    { traditional: '高潮迭起', simplified: '高潮迭起', pinyin: 'gāo cháo dié qǐ', zhuyin: 'ㄍㄠ ㄔㄠˊ ㄉㄧㄝˊ ㄑㄧˇ', vietnamese: 'Cao trào liên tiếp', english: 'Climax after climax', difficulty: 4 },
    { traditional: '聲音抑揚', simplified: '声音抑扬', pinyin: 'shēng yīn yì yáng', zhuyin: 'ㄕㄥ ㄧㄣ ㄧˋ ㄧㄤˊ', vietnamese: 'Giọng nói nhấn nhá', english: 'Voice modulation', difficulty: 4 }
  ],
  'van-hoc-tieng-dai': [
    { traditional: '現代詩', simplified: '现代诗', pinyin: 'xiàn dài shī', zhuyin: 'ㄒㄧㄢˋ ㄉㄞˋ ㄕ', vietnamese: 'Thơ hiện đại', english: 'Modern poetry', difficulty: 4 },
    { traditional: '散文', simplified: '散文', pinyin: 'sǎn wén', zhuyin: 'ㄙㄢˇ ㄨㄣˊ', vietnamese: 'Tản văn', english: 'Prose', difficulty: 4 },
    { traditional: '鄉土文學', simplified: '乡土文学', pinyin: 'xiāng tǔ wén xué', zhuyin: 'ㄒㄧㄤ ㄊㄨˇ ㄨㄣˊ ㄒㄩㄝˊ', vietnamese: 'Văn học hương thổ', english: 'Nativist literature', difficulty: 4 },
    { traditional: '意象', simplified: '意象', pinyin: 'yì xiàng', zhuyin: 'ㄧˋ ㄒㄧㄤˋ', vietnamese: 'Ý tượng', english: 'Imagery', difficulty: 4 },
    { traditional: '象徵主義', simplified: '象征主义', pinyin: 'xiàng zhēng zhǔ yì', zhuyin: 'ㄒㄧㄤˋ ㄓㄥ ㄓㄨˇ ㄧˋ', vietnamese: 'Chủ nghĩa tượng trưng', english: 'Symbolism', difficulty: 4 },
    { traditional: '文學批評', simplified: '文学批评', pinyin: 'wén xué pī píng', zhuyin: 'ㄨㄣˊ ㄒㄩㄝˊ ㄆㄧ ㄆㄧㄥˊ', vietnamese: 'Phê bình văn học', english: 'Literary criticism', difficulty: 4 },
    { traditional: '敘事觀點', simplified: '叙事观点', pinyin: 'xù shì guān diǎn', zhuyin: 'ㄒㄩˋ ㄕˋ ㄍㄨㄢ ㄉㄧㄢˇ', vietnamese: 'Quan điểm tường thuật', english: 'Narrative perspective', difficulty: 4 },
    { traditional: '隱喻', simplified: '隐喻', pinyin: 'yǐn yù', zhuyin: 'ㄧㄣˇ ㄩˋ', vietnamese: 'Ẩn dụ', english: 'Metaphor', difficulty: 4 },
    { traditional: '寫實主義', simplified: '写实主义', pinyin: 'xiě shí zhǔ yì', zhuyin: 'ㄒㄧㄝˇ ㄕˊ ㄓㄨˇ ㄧˋ', vietnamese: 'Chủ nghĩa hiện thực', english: 'Realism', difficulty: 4 },
    { traditional: '文學流派', simplified: '文学流派', pinyin: 'wén xué liú pài', zhuyin: 'ㄨㄣˊ ㄒㄩㄝˊ ㄌㄧㄡˊ ㄆㄞˋ', vietnamese: 'Trào lưu văn học', english: 'Literary school', difficulty: 4 }
  ],
  'phim-anh-kich-ban': [
    { traditional: '劇本', simplified: '剧本', pinyin: 'jù běn', zhuyin: 'ㄐㄩˋ ㄅㄣˇ', vietnamese: 'Kịch bản', english: 'Script', difficulty: 4 },
    { traditional: '台詞', simplified: '台词', pinyin: 'tái cí', zhuyin: 'ㄊㄞˊ ㄘˊ', vietnamese: 'Thoại', english: 'Dialogue', difficulty: 4 },
    { traditional: '口語化', simplified: '口语化', pinyin: 'kǒu yǔ huà', zhuyin: 'ㄎㄡˇ ㄩˇ ㄏㄨㄚˋ', vietnamese: 'Khẩu ngữ hóa', english: 'Colloquial', difficulty: 4 },
    { traditional: '字幕', simplified: '字幕', pinyin: 'zì mù', zhuyin: 'ㄗˋ ㄇㄨˋ', vietnamese: 'Phụ đề', english: 'Subtitle', difficulty: 4 },
    { traditional: '配音', simplified: '配音', pinyin: 'pèi yīn', zhuyin: 'ㄆㄟˋ ㄧㄣ', vietnamese: 'Lồng tiếng', english: 'Dubbing', difficulty: 4 },
    { traditional: '情境對話', simplified: '情境对话', pinyin: 'qíng jìng duì huà', zhuyin: 'ㄑㄧㄥˊ ㄐㄧㄥˋ ㄉㄨㄟˋ ㄏㄨㄚˋ', vietnamese: 'Đối thoại theo tình huống', english: 'Situational dialogue', difficulty: 4 },
    { traditional: '角色刻畫', simplified: '角色刻画', pinyin: 'jué sè kè huà', zhuyin: 'ㄐㄩㄝˊ ㄙㄜˋ ㄎㄜˋ ㄏㄨㄚˋ', vietnamese: 'Khắc họa nhân vật', english: 'Character portrayal', difficulty: 4 },
    { traditional: '場景描寫', simplified: '场景描写', pinyin: 'chǎng jǐng miáo xiě', zhuyin: 'ㄔㄤˇ ㄐㄧㄥˇ ㄇㄧㄠˊ ㄒㄧㄝˇ', vietnamese: 'Miêu tả cảnh', english: 'Scene description', difficulty: 4 },
    { traditional: '自然流暢', simplified: '自然流畅', pinyin: 'zì rán liú chàng', zhuyin: 'ㄗˋ ㄖㄢˊ ㄌㄧㄡˊ ㄔㄤˋ', vietnamese: 'Tự nhiên trôi chảy', english: 'Natural and fluent', difficulty: 4 },
    { traditional: '生活化語言', simplified: '生活化语言', pinyin: 'shēng huó huà yǔ yán', zhuyin: 'ㄕㄥ ㄏㄨㄛˊ ㄏㄨㄚˋ ㄩˇ ㄧㄢˊ', vietnamese: 'Ngôn ngữ đời sống', english: 'Everyday language', difficulty: 4 }
  ],
  'bao-chi-binh-luan': [
    { traditional: '社論', simplified: '社论', pinyin: 'shè lùn', zhuyin: 'ㄕㄜˋ ㄌㄨㄣˋ', vietnamese: 'Bài xã luận', english: 'Editorial', difficulty: 4 },
    { traditional: '專欄', simplified: '专栏', pinyin: 'zhuān lán', zhuyin: 'ㄓㄨㄢ ㄌㄢˊ', vietnamese: 'Chuyên mục', english: 'Column', difficulty: 4 },
    { traditional: '時事評論', simplified: '时事评论', pinyin: 'shí shì píng lùn', zhuyin: 'ㄕˊ ㄕˋ ㄆㄧㄥˊ ㄌㄨㄣˋ', vietnamese: 'Bình luận thời sự', english: 'Current affairs commentary', difficulty: 4 },
    { traditional: '調查報導', simplified: '调查报导', pinyin: 'diào chá bào dǎo', zhuyin: 'ㄉㄧㄠˋ ㄔㄚˊ ㄅㄠˋ ㄉㄠˇ', vietnamese: 'Phóng sự điều tra', english: 'Investigative journalism', difficulty: 4 },
    { traditional: '深度報導', simplified: '深度报导', pinyin: 'shēn dù bào dǎo', zhuyin: 'ㄕㄣ ㄉㄨˋ ㄅㄠˋ ㄉㄠˇ', vietnamese: 'Phóng sự chuyên sâu', english: 'In-depth report', difficulty: 4 },
    { traditional: '客觀報導', simplified: '客观报导', pinyin: 'kè guān bào dǎo', zhuyin: 'ㄎㄜˋ ㄍㄨㄢ ㄅㄠˋ ㄉㄠˇ', vietnamese: 'Báo đạo khách quan', english: 'Objective reporting', difficulty: 4 },
    { traditional: '媒體素養', simplified: '媒体素养', pinyin: 'méi tǐ sù yǎng', zhuyin: 'ㄇㄟˊ ㄊㄧˇ ㄙㄨˋ ㄧㄤˇ', vietnamese: 'Hiểu biết về truyền thông', english: 'Media literacy', difficulty: 4 },
    { traditional: '新聞自由', simplified: '新闻自由', pinyin: 'xīn wén zì yóu', zhuyin: 'ㄒㄧㄣ ㄨㄣˊ ㄗˋ ㄧㄡˊ', vietnamese: 'Tự do báo chí', english: 'Press freedom', difficulty: 4 },
    { traditional: '獨家新聞', simplified: '独家新闻', pinyin: 'dú jiā xīn wén', zhuyin: 'ㄉㄨˊ ㄐㄧㄚ ㄒㄧㄣ ㄨㄣˊ', vietnamese: 'Tin độc quyền', english: 'Exclusive news', difficulty: 4 },
    { traditional: '輿論', simplified: '舆论', pinyin: 'yú lùn', zhuyin: 'ㄩˊ ㄌㄨㄣˋ', vietnamese: 'Dư luận', english: 'Public opinion', difficulty: 4 }
  ],
  'ngon-ngu-phap-ly': [
    { traditional: '訴訟', simplified: '诉讼', pinyin: 'sù sòng', zhuyin: 'ㄙㄨˋ ㄙㄨㄥˋ', vietnamese: 'Kiện tụng', english: 'Litigation', difficulty: 4 },
    { traditional: '合同', simplified: '合同', pinyin: 'hé tong', zhuyin: 'ㄏㄜˊ ㄊㄨㄥˊ', vietnamese: 'Hợp đồng', english: 'Contract', difficulty: 4 },
    { traditional: '原告', simplified: '原告', pinyin: 'yuán gào', zhuyin: 'ㄩㄢˊ ㄍㄠˋ', vietnamese: 'Nguyên đơn', english: 'Plaintiff', difficulty: 4 },
    { traditional: '被告', simplified: '被告', pinyin: 'bèi gào', zhuyin: 'ㄅㄟˋ ㄍㄠˋ', vietnamese: 'Bị đơn', english: 'Defendant', difficulty: 4 },
    { traditional: '法律條款', simplified: '法律条款', pinyin: 'fǎ lǜ tiáo kuǎn', zhuyin: 'ㄈㄚˇ ㄌㄩˋ ㄊㄧㄠˊ ㄎㄨㄢˇ', vietnamese: 'Điều khoản pháp luật', english: 'Legal clause', difficulty: 4 },
    { traditional: '判決', simplified: '判决', pinyin: 'pàn jué', zhuyin: 'ㄆㄢˋ ㄐㄩㄝˊ', vietnamese: 'Phán quyết', english: 'Verdict', difficulty: 4 },
    { traditional: '上訴', simplified: '上诉', pinyin: 'shàng sù', zhuyin: 'ㄕㄤˋ ㄙㄨˋ', vietnamese: 'Kháng cáo', english: 'Appeal', difficulty: 4 },
    { traditional: '證據', simplified: '证据', pinyin: 'zhèng jù', zhuyin: 'ㄓㄥˋ ㄐㄩˋ', vietnamese: 'Chứng cứ', english: 'Evidence', difficulty: 4 },
    { traditional: '律師', simplified: '律师', pinyin: 'lǜ shī', zhuyin: 'ㄌㄩˋ ㄕ', vietnamese: 'Luật sư', english: 'Lawyer', difficulty: 4 },
    { traditional: '法律責任', simplified: '法律责任', pinyin: 'fǎ lǜ zé rèn', zhuyin: 'ㄈㄚˇ ㄌㄩˋ ㄗㄜˊ ㄖㄣˋ', vietnamese: 'Trách nhiệm pháp lý', english: 'Legal liability', difficulty: 4 }
  ],
  'ngon-ngu-y-te': [
    { traditional: '診斷', simplified: '诊断', pinyin: 'zhěn duàn', zhuyin: 'ㄓㄣˇ ㄉㄨㄢˋ', vietnamese: 'Chẩn đoán', english: 'Diagnosis', difficulty: 4 },
    { traditional: '症狀', simplified: '症状', pinyin: 'zhèng zhuàng', zhuyin: 'ㄓㄥˋ ㄓㄨㄤˋ', vietnamese: 'Triệu chứng', english: 'Symptom', difficulty: 4 },
    { traditional: '處方', simplified: '处方', pinyin: 'chǔ fāng', zhuyin: 'ㄔㄨˇ ㄈㄤ', vietnamese: 'Đơn thuốc', english: 'Prescription', difficulty: 4 },
    { traditional: '手術', simplified: '手术', pinyin: 'shǒu shù', zhuyin: 'ㄕㄡˇ ㄕㄨˋ', vietnamese: 'Phẫu thuật', english: 'Surgery', difficulty: 4 },
    { traditional: '慢性病', simplified: '慢性病', pinyin: 'màn xìng bìng', zhuyin: 'ㄇㄢˋ ㄒㄧㄥˋ ㄅㄧㄥˋ', vietnamese: 'Bệnh mãn tính', english: 'Chronic disease', difficulty: 4 },
    { traditional: '急性病', simplified: '急性病', pinyin: 'jí xìng bìng', zhuyin: 'ㄐㄧˊ ㄒㄧㄥˋ ㄅㄧㄥˋ', vietnamese: 'Bệnh cấp tính', english: 'Acute disease', difficulty: 4 },
    { traditional: '復健', simplified: '复健', pinyin: 'fù jiàn', zhuyin: 'ㄈㄨˋ ㄐㄧㄢˋ', vietnamese: 'Phục hồi chức năng', english: 'Rehabilitation', difficulty: 4 },
    { traditional: '預防接種', simplified: '预防接种', pinyin: 'yù fáng jiē zhǒng', zhuyin: 'ㄩˋ ㄈㄤˊ ㄐㄧㄝ ㄓㄨㄥˇ', vietnamese: 'Tiêm phòng', english: 'Vaccination', difficulty: 4 },
    { traditional: '病歷', simplified: '病历', pinyin: 'bìng lì', zhuyin: 'ㄅㄧㄥˋ ㄌㄧˋ', vietnamese: 'Bệnh án', english: 'Medical record', difficulty: 4 },
    { traditional: '副作用', simplified: '副作用', pinyin: 'fù zuò yòng', zhuyin: 'ㄈㄨˋ ㄗㄨㄛˋ ㄩㄥˋ', vietnamese: 'Tác dụng phụ', english: 'Side effect', difficulty: 4 }
  ],
  'dich-thuat-hoa-dai': [
    { traditional: '翻譯', simplified: '翻译', pinyin: 'fān yì', zhuyin: 'ㄈㄢ ㄧˋ', vietnamese: 'Dịch thuật', english: 'Translation', difficulty: 4 },
    { traditional: '口譯', simplified: '口译', pinyin: 'kǒu yì', zhuyin: 'ㄎㄡˇ ㄧˋ', vietnamese: 'Phiên dịch', english: 'Interpretation', difficulty: 4 },
    { traditional: '筆譯', simplified: '笔译', pinyin: 'bǐ yì', zhuyin: 'ㄅㄧˇ ㄧˋ', vietnamese: 'Biên dịch', english: 'Written translation', difficulty: 4 },
    { traditional: '同步口譯', simplified: '同步口译', pinyin: 'tóng bù kǒu yì', zhuyin: 'ㄊㄨㄥˊ ㄅㄨˋ ㄎㄡˇ ㄧˋ', vietnamese: 'Phiên dịch đồng thời', english: 'Simultaneous interpretation', difficulty: 4 },
    { traditional: '逐步口譯', simplified: '逐步口译', pinyin: 'zhú bù kǒu yì', zhuyin: 'ㄓㄨˊ ㄅㄨˋ ㄎㄡˇ ㄧˋ', vietnamese: 'Phiên dịch tuần tự', english: 'Consecutive interpretation', difficulty: 4 },
    { traditional: '直譯', simplified: '直译', pinyin: 'zhí yì', zhuyin: 'ㄓˊ ㄧˋ', vietnamese: 'Dịch trực tiếp', english: 'Literal translation', difficulty: 4 },
    { traditional: '意譯', simplified: '意译', pinyin: 'yì yì', zhuyin: 'ㄧˋ ㄧˋ', vietnamese: 'Dịch ý', english: 'Free translation', difficulty: 4 },
    { traditional: '術語對照', simplified: '术语对照', pinyin: 'shù yǔ duì zhào', zhuyin: 'ㄕㄨˋ ㄩˇ ㄉㄨㄟˋ ㄓㄠˋ', vietnamese: 'Đối chiếu thuật ngữ', english: 'Terminology comparison', difficulty: 4 },
    { traditional: '文化差異', simplified: '文化差异', pinyin: 'wén huà chā yì', zhuyin: 'ㄨㄣˊ ㄏㄨㄚˋ ㄔㄚ ㄧˋ', vietnamese: 'Khác biệt văn hóa', english: 'Cultural difference', difficulty: 4 },
    { traditional: '本地化', simplified: '本地化', pinyin: 'běn dì huà', zhuyin: 'ㄅㄣˇ ㄉㄧˋ ㄏㄨㄚˋ', vietnamese: 'Bản địa hóa', english: 'Localization', difficulty: 4 }
  ],
  'so-sanh-dai-quan-thoai': [
    { traditional: '用詞差異', simplified: '用词差异', pinyin: 'yòng cí chā yì', zhuyin: 'ㄩㄥˋ ㄘˊ ㄔㄚ ㄧˋ', vietnamese: 'Khác biệt từ vựng', english: 'Vocabulary differences', difficulty: 4 },
    { traditional: '發音不同', simplified: '发音不同', pinyin: 'fā yīn bù tóng', zhuyin: 'ㄈㄚ ㄧㄣ ㄅㄨˋ ㄊㄨㄥˊ', vietnamese: 'Phát âm khác nhau', english: 'Pronunciation differences', difficulty: 4 },
    { traditional: '語法結構', simplified: '语法结构', pinyin: 'yǔ fǎ jié gòu', zhuyin: 'ㄩˇ ㄈㄚˇ ㄐㄧㄝˊ ㄍㄡˋ', vietnamese: 'Cấu trúc ngữ pháp', english: 'Grammar structure', difficulty: 4 },
    { traditional: '慣用語', simplified: '惯用语', pinyin: 'guàn yòng yǔ', zhuyin: 'ㄍㄨㄢˋ ㄩㄥˋ ㄩˇ', vietnamese: 'Thành ngữ thông dụng', english: 'Idiomatic expression', difficulty: 4 },
    { traditional: '口語表達', simplified: '口语表达', pinyin: 'kǒu yǔ biǎo dá', zhuyin: 'ㄎㄡˇ ㄩˇ ㄅㄧㄠˇ ㄉㄚˊ', vietnamese: 'Diễn đạt khẩu ngữ', english: 'Oral expression', difficulty: 4 },
    { traditional: '書面語', simplified: '书面语', pinyin: 'shū miàn yǔ', zhuyin: 'ㄕㄨ ㄇㄧㄢˋ ㄩˇ', vietnamese: 'Ngôn ngữ viết', english: 'Written language', difficulty: 4 },
    { traditional: '台式中文', simplified: '台式中文', pinyin: 'tái shì zhōng wén', zhuyin: 'ㄊㄞˊ ㄕˋ ㄓㄨㄥ ㄨㄣˊ', vietnamese: 'Tiếng Trung kiểu Đài', english: 'Taiwan-style Chinese', difficulty: 4 },
    { traditional: '大陸用語', simplified: '大陆用语', pinyin: 'dà lù yòng yǔ', zhuyin: 'ㄉㄚˋ ㄌㄨˋ ㄩㄥˋ ㄩˇ', vietnamese: 'Thuật ngữ Đại lục', english: 'Mainland terminology', difficulty: 4 },
    { traditional: '外來語', simplified: '外来语', pinyin: 'wài lái yǔ', zhuyin: 'ㄨㄞˋ ㄌㄞˊ ㄩˇ', vietnamese: 'Từ ngoại lai', english: 'Loanword', difficulty: 4 },
    { traditional: '語言演變', simplified: '语言演变', pinyin: 'yǔ yán yǎn biàn', zhuyin: 'ㄩˇ ㄧㄢˊ ㄧㄢˇ ㄅㄧㄢˋ', vietnamese: 'Diễn biến ngôn ngữ', english: 'Language evolution', difficulty: 4 }
  ],
  'an-du-ham-y': [
    { traditional: '弦外之音', simplified: '弦外之音', pinyin: 'xián wài zhī yīn', zhuyin: 'ㄒㄧㄢˊ ㄨㄞˋ ㄓ ㄧㄣ', vietnamese: 'Ý ngoài lời', english: 'Implied meaning', difficulty: 4 },
    { traditional: '話中有話', simplified: '话中有话', pinyin: 'huà zhōng yǒu huà', zhuyin: 'ㄏㄨㄚˋ ㄓㄨㄥ ㄧㄡˇ ㄏㄨㄚˋ', vietnamese: 'Lời trong có lời', english: 'Hidden meaning', difficulty: 4 },
    { traditional: '暗示', simplified: '暗示', pinyin: 'àn shì', zhuyin: 'ㄢˋ ㄕˋ', vietnamese: 'Ám chỉ', english: 'Hint, imply', difficulty: 4 },
    { traditional: '含蓄', simplified: '含蓄', pinyin: 'hán xù', zhuyin: 'ㄏㄢˊ ㄒㄩˋ', vietnamese: 'Hàm súc', english: 'Implicit, subtle', difficulty: 4 },
    { traditional: '委婉', simplified: '委婉', pinyin: 'wěi wǎn', zhuyin: 'ㄨㄟˇ ㄨㄢˇ', vietnamese: 'Uyển chuyển', english: 'Euphemistic', difficulty: 4 },
    { traditional: '拐彎抹角', simplified: '拐弯抹角', pinyin: 'guǎi wān mò jiǎo', zhuyin: 'ㄍㄨㄞˇ ㄨㄢ ㄇㄛˋ ㄐㄧㄠˇ', vietnamese: 'Nói vòng vo', english: 'Beat around the bush', difficulty: 4 },
    { traditional: '指桑罵槐', simplified: '指桑骂槐', pinyin: 'zhǐ sāng mà huái', zhuyin: 'ㄓˇ ㄙㄤ ㄇㄚˋ ㄏㄨㄞˊ', vietnamese: 'Chỉ cây dâu mắng cây hòe', english: 'Criticize obliquely', difficulty: 4 },
    { traditional: '意在言外', simplified: '意在言外', pinyin: 'yì zài yán wài', zhuyin: 'ㄧˋ ㄗㄞˋ ㄧㄢˊ ㄨㄞˋ', vietnamese: 'Ý ở ngoài lời', english: 'Implication beyond words', difficulty: 4 },
    { traditional: '心照不宣', simplified: '心照不宣', pinyin: 'xīn zhào bù xuān', zhuyin: 'ㄒㄧㄣ ㄓㄠˋ ㄅㄨˋ ㄒㄩㄢ', vietnamese: 'Tâm đầu ý hợp', english: 'Tacit understanding', difficulty: 4 },
    { traditional: '點到為止', simplified: '点到为止', pinyin: 'diǎn dào wéi zhǐ', zhuyin: 'ㄉㄧㄢˇ ㄉㄠˋ ㄨㄟˊ ㄓˇ', vietnamese: 'Chỉ cần điểm đến là đủ', english: 'Just hint at it', difficulty: 4 }
  ],
  'cham-biem-mia-mai': [
    { traditional: '諷刺', simplified: '讽刺', pinyin: 'fěng cì', zhuyin: 'ㄈㄥˇ ㄘˋ', vietnamese: 'Châm biếm', english: 'Satire, irony', difficulty: 4 },
    { traditional: '挖苦', simplified: '挖苦', pinyin: 'wā kǔ', zhuyin: 'ㄨㄚ ㄎㄨˇ', vietnamese: 'Mỉa mai', english: 'Sarcastic', difficulty: 4 },
    { traditional: '冷嘲熱諷', simplified: '冷嘲热讽', pinyin: 'lěng cháo rè fěng', zhuyin: 'ㄌㄥˇ ㄔㄠˊ ㄖㄜˋ ㄈㄥˇ', vietnamese: 'Chế giễu mỉa mai', english: 'Sneer and mock', difficulty: 4 },
    { traditional: '嘲笑', simplified: '嘲笑', pinyin: 'cháo xiào', zhuyin: 'ㄔㄠˊ ㄒㄧㄠˋ', vietnamese: 'Chế nhạo', english: 'Mock, ridicule', difficulty: 4 },
    { traditional: '反諷', simplified: '反讽', pinyin: 'fǎn fěng', zhuyin: 'ㄈㄢˇ ㄈㄥˇ', vietnamese: 'Phản biếm', english: 'Irony', difficulty: 4 },
    { traditional: '自嘲', simplified: '自嘲', pinyin: 'zì cháo', zhuyin: 'ㄗˋ ㄔㄠˊ', vietnamese: 'Tự giễu', english: 'Self-mockery', difficulty: 4 },
    { traditional: '酸言酸語', simplified: '酸言酸语', pinyin: 'suān yán suān yǔ', zhuyin: 'ㄙㄨㄢ ㄧㄢˊ ㄙㄨㄢ ㄩˇ', vietnamese: 'Nói chua chát', english: 'Sarcastic remarks', difficulty: 4 },
    { traditional: '幽默諷刺', simplified: '幽默讽刺', pinyin: 'yōu mò fěng cì', zhuyin: 'ㄧㄡ ㄇㄛˋ ㄈㄥˇ ㄘˋ', vietnamese: 'Hài hước châm biếm', english: 'Humorous satire', difficulty: 4 },
    { traditional: '尖酸刻薄', simplified: '尖酸刻薄', pinyin: 'jiān suān kè bó', zhuyin: 'ㄐㄧㄢ ㄙㄨㄢ ㄎㄜˋ ㄅㄛˊ', vietnamese: 'Chua cay khắc nghiệt', english: 'Acerbic, caustic', difficulty: 4 },
    { traditional: '黑色幽默', simplified: '黑色幽默', pinyin: 'hēi sè yōu mò', zhuyin: 'ㄏㄟ ㄙㄜˋ ㄧㄡ ㄇㄛˋ', vietnamese: 'Hài hước đen', english: 'Black humor', difficulty: 4 }
  ],
  'ngon-ngu-mang-xa-hoi': [
    { traditional: '按讚', simplified: '按赞', pinyin: 'àn zàn', zhuyin: 'ㄢˋ ㄗㄢˋ', vietnamese: 'Bấm like', english: 'Like', difficulty: 4 },
    { traditional: '分享', simplified: '分享', pinyin: 'fēn xiǎng', zhuyin: 'ㄈㄣ ㄒㄧㄤˇ', vietnamese: 'Chia sẻ', english: 'Share', difficulty: 4 },
    { traditional: '標籤', simplified: '标签', pinyin: 'biāo qiān', zhuyin: 'ㄅㄧㄠ ㄑㄧㄢ', vietnamese: 'Tag', english: 'Tag', difficulty: 4 },
    { traditional: '粉絲', simplified: '粉丝', pinyin: 'fěn sī', zhuyin: 'ㄈㄣˇ ㄙ', vietnamese: 'Fan, người theo dõi', english: 'Fan, follower', difficulty: 4 },
    { traditional: '直播', simplified: '直播', pinyin: 'zhí bō', zhuyin: 'ㄓˊ ㄅㄛ', vietnamese: 'Livestream', english: 'Live broadcast', difficulty: 4 },
    { traditional: '網紅', simplified: '网红', pinyin: 'wǎng hóng', zhuyin: 'ㄨㄤˇ ㄏㄨㄥˊ', vietnamese: 'Hot trend mạng', english: 'Internet celebrity', difficulty: 4 },
    { traditional: '發文', simplified: '发文', pinyin: 'fā wén', zhuyin: 'ㄈㄚ ㄨㄣˊ', vietnamese: 'Đăng bài', english: 'Post', difficulty: 4 },
    { traditional: '留言', simplified: '留言', pinyin: 'liú yán', zhuyin: 'ㄌㄧㄡˊ ㄧㄢˊ', vietnamese: 'Bình luận', english: 'Comment', difficulty: 4 },
    { traditional: '病毒式傳播', simplified: '病毒式传播', pinyin: 'bìng dú shì chuán bō', zhuyin: 'ㄅㄧㄥˋ ㄉㄨˊ ㄕˋ ㄔㄨㄢˊ ㄅㄛ', vietnamese: 'Lan truyền nhanh', english: 'Go viral', difficulty: 4 },
    { traditional: '限時動態', simplified: '限时动态', pinyin: 'xiàn shí dòng tài', zhuyin: 'ㄒㄧㄢˋ ㄕˊ ㄉㄨㄥˋ ㄊㄞˋ', vietnamese: 'Story (24h)', english: 'Story', difficulty: 4 }
  ],
  'giao-tiep-da-van-hoa': [
    { traditional: '跨文化溝通', simplified: '跨文化沟通', pinyin: 'kuà wén huà gōu tōng', zhuyin: 'ㄎㄨㄚˋ ㄨㄣˊ ㄏㄨㄚˋ ㄍㄡ ㄊㄨㄥ', vietnamese: 'Giao tiếp liên văn hóa', english: 'Cross-cultural communication', difficulty: 4 },
    { traditional: '文化敏感度', simplified: '文化敏感度', pinyin: 'wén huà mǐn gǎn dù', zhuyin: 'ㄨㄣˊ ㄏㄨㄚˋ ㄇㄧㄣˇ ㄍㄢˇ ㄉㄨˋ', vietnamese: 'Nhạy cảm văn hóa', english: 'Cultural sensitivity', difficulty: 4 },
    { traditional: '文化衝突', simplified: '文化冲突', pinyin: 'wén huà chōng tū', zhuyin: 'ㄨㄣˊ ㄏㄨㄚˋ ㄔㄨㄥ ㄊㄨ', vietnamese: 'Xung đột văn hóa', english: 'Cultural conflict', difficulty: 4 },
    { traditional: '禁忌', simplified: '禁忌', pinyin: 'jìn jì', zhuyin: 'ㄐㄧㄣˋ ㄐㄧˋ', vietnamese: 'Kiêng kị', english: 'Taboo', difficulty: 4 },
    { traditional: '尊重差異', simplified: '尊重差异', pinyin: 'zūn zhòng chā yì', zhuyin: 'ㄗㄨㄣ ㄓㄨㄥˋ ㄔㄚ ㄧˋ', vietnamese: 'Tôn trọng sự khác biệt', english: 'Respect differences', difficulty: 4 },
    { traditional: '文化適應', simplified: '文化适应', pinyin: 'wén huà shì yìng', zhuyin: 'ㄨㄣˊ ㄏㄨㄚˋ ㄕˋ ㄧㄥˋ', vietnamese: 'Thích ứng văn hóa', english: 'Cultural adaptation', difficulty: 4 },
    { traditional: '多元文化', simplified: '多元文化', pinyin: 'duō yuán wén huà', zhuyin: 'ㄉㄨㄛ ㄩㄢˊ ㄨㄣˊ ㄏㄨㄚˋ', vietnamese: 'Đa văn hóa', english: 'Multiculturalism', difficulty: 4 },
    { traditional: '文化認同', simplified: '文化认同', pinyin: 'wén huà rèn tóng', zhuyin: 'ㄨㄣˊ ㄏㄨㄚˋ ㄖㄣˋ ㄊㄨㄥˊ', vietnamese: 'Bản sắc văn hóa', english: 'Cultural identity', difficulty: 4 },
    { traditional: '包容性', simplified: '包容性', pinyin: 'bāo róng xìng', zhuyin: 'ㄅㄠ ㄖㄨㄥˊ ㄒㄧㄥˋ', vietnamese: 'Tính bao dung', english: 'Inclusiveness', difficulty: 4 },
    { traditional: '全球化', simplified: '全球化', pinyin: 'quán qiú huà', zhuyin: 'ㄑㄩㄢˊ ㄑㄧㄡˊ ㄏㄨㄚˋ', vietnamese: 'Toàn cầu hóa', english: 'Globalization', difficulty: 4 }
  ],
  'lich-su-tieng-dai': [
    { traditional: '語言演進', simplified: '语言演进', pinyin: 'yǔ yán yǎn jìn', zhuyin: 'ㄩˇ ㄧㄢˊ ㄧㄢˇ ㄐㄧㄣˋ', vietnamese: 'Tiến hóa ngôn ngữ', english: 'Language evolution', difficulty: 4 },
    { traditional: '日治時期', simplified: '日治时期', pinyin: 'rì zhì shí qī', zhuyin: 'ㄖˋ ㄓˋ ㄕˊ ㄑㄧ', vietnamese: 'Thời kỳ Nhật trị', english: 'Japanese colonial period', difficulty: 4 },
    { traditional: '國語運動', simplified: '国语运动', pinyin: 'guó yǔ yùn dòng', zhuyin: 'ㄍㄨㄛˊ ㄩˇ ㄩㄣˋ ㄉㄨㄥˋ', vietnamese: 'Phong trào quốc ngữ', english: 'National language movement', difficulty: 4 },
    { traditional: '母語教育', simplified: '母语教育', pinyin: 'mǔ yǔ jiào yù', zhuyin: 'ㄇㄨˇ ㄩˇ ㄐㄧㄠˋ ㄩˋ', vietnamese: 'Giáo dục tiếng mẹ đẻ', english: 'Mother tongue education', difficulty: 4 },
    { traditional: '語言政策', simplified: '语言政策', pinyin: 'yǔ yán zhèng cè', zhuyin: 'ㄩˇ ㄧㄢˊ ㄓㄥˋ ㄘㄜˋ', vietnamese: 'Chính sách ngôn ngữ', english: 'Language policy', difficulty: 4 },
    { traditional: '語言復興', simplified: '语言复兴', pinyin: 'yǔ yán fù xīng', zhuyin: 'ㄩˇ ㄧㄢˊ ㄈㄨˋ ㄒㄧㄥ', vietnamese: 'Phục hưng ngôn ngữ', english: 'Language revival', difficulty: 4 },
    { traditional: '漢字簡化', simplified: '汉字简化', pinyin: 'hàn zì jiǎn huà', zhuyin: 'ㄏㄢˋ ㄗˋ ㄐㄧㄢˇ ㄏㄨㄚˋ', vietnamese: 'Đơn giản hóa chữ Hán', english: 'Chinese character simplification', difficulty: 4 },
    { traditional: '注音符號', simplified: '注音符号', pinyin: 'zhù yīn fú hào', zhuyin: 'ㄓㄨˋ ㄧㄣ ㄈㄨˊ ㄏㄠˋ', vietnamese: 'Chú âm phù hiệu (Bopomofo)', english: 'Zhuyin/Bopomofo', difficulty: 4 },
    { traditional: '語言保存', simplified: '语言保存', pinyin: 'yǔ yán bǎo cún', zhuyin: 'ㄩˇ ㄧㄢˊ ㄅㄠˇ ㄘㄨㄣˊ', vietnamese: 'Bảo tồn ngôn ngữ', english: 'Language preservation', difficulty: 4 },
    { traditional: '語言文化遺產', simplified: '语言文化遗产', pinyin: 'yǔ yán wén huà yí chǎn', zhuyin: 'ㄩˇ ㄧㄢˊ ㄨㄣˊ ㄏㄨㄚˋ ㄧˊ ㄔㄢˇ', vietnamese: 'Di sản văn hóa ngôn ngữ', english: 'Linguistic cultural heritage', difficulty: 4 }
  ],
  'phong-cach-ban-xu-cao-cap': [
    { traditional: '道地', simplified: '道地', pinyin: 'dào dì', zhuyin: 'ㄉㄠˋ ㄉㄧˋ', vietnamese: 'Thuần túy, bản địa', english: 'Authentic, genuine', difficulty: 4 },
    { traditional: '流利', simplified: '流利', pinyin: 'liú lì', zhuyin: 'ㄌㄧㄡˊ ㄌㄧˋ', vietnamese: 'Lưu loát', english: 'Fluent', difficulty: 4 },
    { traditional: '母語人士', simplified: '母语人士', pinyin: 'mǔ yǔ rén shì', zhuyin: 'ㄇㄨˇ ㄩˇ ㄖㄣˊ ㄕˋ', vietnamese: 'Người bản ngữ', english: 'Native speaker', difficulty: 4 },
    { traditional: '語感', simplified: '语感', pinyin: 'yǔ gǎn', zhuyin: 'ㄩˇ ㄍㄢˇ', vietnamese: 'Ngữ cảm', english: 'Language sense', difficulty: 4 },
    { traditional: '自然表達', simplified: '自然表达', pinyin: 'zì rán biǎo dá', zhuyin: 'ㄗˋ ㄖㄢˊ ㄅㄧㄠˇ ㄉㄚˊ', vietnamese: 'Diễn đạt tự nhiên', english: 'Natural expression', difficulty: 4 },
    { traditional: '口音', simplified: '口音', pinyin: 'kǒu yīn', zhuyin: 'ㄎㄡˇ ㄧㄣ', vietnamese: 'Giọng nói', english: 'Accent', difficulty: 4 },
    { traditional: '語言習慣', simplified: '语言习惯', pinyin: 'yǔ yán xí guàn', zhuyin: 'ㄩˇ ㄧㄢˊ ㄒㄧˊ ㄍㄨㄢˋ', vietnamese: 'Thói quen ngôn ngữ', english: 'Language habit', difficulty: 4 },
    { traditional: '用詞精準', simplified: '用词精准', pinyin: 'yòng cí jīng zhǔn', zhuyin: 'ㄩㄥˋ ㄘˊ ㄐㄧㄥ ㄓㄨㄣˇ', vietnamese: 'Dùng từ chính xác', english: 'Precise word choice', difficulty: 4 },
    { traditional: '語言直覺', simplified: '语言直觉', pinyin: 'yǔ yán zhí jué', zhuyin: 'ㄩˇ ㄧㄢˊ ㄓˊ ㄐㄩㄝˊ', vietnamese: 'Trực giác ngôn ngữ', english: 'Language intuition', difficulty: 4 },
    { traditional: '文化底蘊', simplified: '文化底蕴', pinyin: 'wén huà dǐ yùn', zhuyin: 'ㄨㄣˊ ㄏㄨㄚˋ ㄉㄧˇ ㄩㄣˋ', vietnamese: 'Bản sắc văn hóa sâu sắc', english: 'Cultural depth', difficulty: 4 }
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
    console.log('🌱 SEEDING ADVANCED LEVEL DATA');
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
