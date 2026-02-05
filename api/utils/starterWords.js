/**
 * Create starter words for new users
 * Provides basic vocabulary to get started
 */

const Word = require('../models/Word');

const starterWords = [
  // Greetings & Basic
  {
    traditional: '你好',
    pinyin: 'nǐ hǎo',
    zhuyin: 'ㄋㄧˇ ㄏㄠˇ',
    vietnamese: 'Xin chào',
    english: 'Hello',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '謝謝',
    pinyin: 'xiè xie',
    zhuyin: 'ㄒㄧㄝˋ ㄒㄧㄝˋ',
    vietnamese: 'Cảm ơn',
    english: 'Thank you',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '再見',
    pinyin: 'zài jiàn',
    zhuyin: 'ㄗㄞˋ ㄐㄧㄢˋ',
    vietnamese: 'Tạm biệt',
    english: 'Goodbye',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '對不起',
    pinyin: 'duì bu qǐ',
    zhuyin: 'ㄉㄨㄟˋ ㄅㄨˋ ㄑㄧˇ',
    vietnamese: 'Xin lỗi',
    english: 'Sorry',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '是',
    pinyin: 'shì',
    zhuyin: 'ㄕˋ',
    vietnamese: 'Là, phải',
    english: 'Yes, to be',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '不',
    pinyin: 'bù',
    zhuyin: 'ㄅㄨˋ',
    vietnamese: 'Không',
    english: 'No, not',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  },
  
  // Numbers
  {
    traditional: '一',
    pinyin: 'yī',
    zhuyin: 'ㄧ',
    vietnamese: 'Một',
    english: 'One',
    category: 'numbers',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '二',
    pinyin: 'èr',
    zhuyin: 'ㄦˋ',
    vietnamese: 'Hai',
    english: 'Two',
    category: 'numbers',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '三',
    pinyin: 'sān',
    zhuyin: 'ㄙㄢ',
    vietnamese: 'Ba',
    english: 'Three',
    category: 'numbers',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '四',
    pinyin: 'sì',
    zhuyin: 'ㄙˋ',
    vietnamese: 'Bốn',
    english: 'Four',
    category: 'numbers',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '五',
    pinyin: 'wǔ',
    zhuyin: 'ㄨˇ',
    vietnamese: 'Năm',
    english: 'Five',
    category: 'numbers',
    difficulty: 1,
    isPublic: false
  },
  
  // Common words
  {
    traditional: '我',
    pinyin: 'wǒ',
    zhuyin: 'ㄨㄛˇ',
    vietnamese: 'Tôi',
    english: 'I, me',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '你',
    pinyin: 'nǐ',
    zhuyin: 'ㄋㄧˇ',
    vietnamese: 'Bạn',
    english: 'You',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '他',
    pinyin: 'tā',
    zhuyin: 'ㄊㄚ',
    vietnamese: 'Anh ấy',
    english: 'He, him',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  },
  {
    traditional: '她',
    pinyin: 'tā',
    zhuyin: 'ㄊㄚ',
    vietnamese: 'Cô ấy',
    english: 'She, her',
    category: 'beginner',
    difficulty: 1,
    isPublic: false
  }
];

/**
 * Create starter words for a new user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} Created words
 */
async function createStarterWords(userId) {
  try {
    const wordsToCreate = starterWords.map(word => ({
      ...word,
      createdBy: userId
    }));

    const createdWords = await Word.insertMany(wordsToCreate);
    console.log(`✅ Created ${createdWords.length} starter words for user ${userId}`);
    return createdWords;
  } catch (error) {
    console.error('Error creating starter words:', error);
    throw error;
  }
}

module.exports = { createStarterWords, starterWords };
