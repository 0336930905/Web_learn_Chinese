const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chinese_learning";

// Sample words for teacher1 (Giáo Viên Lý) - focus on basics
const teacher1Words = {
  greetings: [
    { traditional: '您好', simplified: '您好', pinyin: 'nín hǎo', zhuyin: 'ㄋㄧㄣˊ ㄏㄠˇ', vietnamese: 'Xin chào (kính trọng)', english: 'Hello (formal)', difficulty: 2 },
    { traditional: '哈囉', simplified: '哈啰', pinyin: 'hā lō', zhuyin: 'ㄏㄚ ㄌㄛ', vietnamese: 'Xin chào (thân mật)', english: 'Hi', difficulty: 1 }
  ],
  numbers: [
    { traditional: '百', simplified: '百', pinyin: 'bǎi', zhuyin: 'ㄅㄞˇ', vietnamese: 'Trăm', english: 'Hundred', difficulty: 2 },
    { traditional: '千', simplified: '千', pinyin: 'qiān', zhuyin: 'ㄑㄧㄢ', vietnamese: 'Ngàn', english: 'Thousand', difficulty: 2 }
  ]
};

// Sample words for teacher2 (Giáo Viên Trần) - focus on advanced
const teacher2Words = {
  greetings: [
    { traditional: '久仰', simplified: '久仰', pinyin: 'jiǔ yǎng', zhuyin: 'ㄐㄧㄡˇ ㄧㄤˇ', vietnamese: 'Ngưỡng mộ đã lâu', english: 'Long admired (greeting)', difficulty: 3 },
    { traditional: '幸會', simplified: '幸会', pinyin: 'xìng huì', zhuyin: 'ㄒㄧㄥˋ ㄏㄨㄟˋ', vietnamese: 'Hân hạnh được gặp', english: 'Pleased to meet you', difficulty: 3 }
  ],
  food: [
    { traditional: '點心', simplified: '点心', pinyin: 'diǎn xīn', zhuyin: 'ㄉㄧㄢˇ ㄒㄧㄣ', vietnamese: 'Điểm tâm', english: 'Dim sum', difficulty: 2 },
    { traditional: '小吃', simplified: '小吃', pinyin: 'xiǎo chī', zhuyin: 'ㄒㄧㄠˇ ㄔ', vietnamese: 'Ăn vặt', english: 'Snack', difficulty: 2 }
  ]
};

async function addTeacherWords() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Đã kết nối MongoDB");

    const db = client.db();
    const usersCollection = db.collection('users');
    const wordsCollection = db.collection('words');

    // Find teacher1
    const teacher1 = await usersCollection.findOne({ email: 'teacher1@example.com' });
    if (!teacher1) {
      console.log('❌ Không tìm thấy teacher1@example.com');
      return;
    }

    // Find teacher2
    const teacher2 = await usersCollection.findOne({ email: 'teacher2@example.com' });
    if (!teacher2) {
      console.log('❌ Không tìm thấy teacher2@example.com');
      return;
    }

    console.log('✅ Found teachers:', teacher1.displayName, 'and', teacher2.displayName);

    let totalAdded = 0;

    // Add words for teacher1
    console.log('\n📝 Adding words for', teacher1.displayName);
    for (const [category, words] of Object.entries(teacher1Words)) {
      for (const word of words) {
        const wordDoc = {
          ...word,
          category: category,
          createdBy: teacher1._id,
          isPublic: true,
          tags: ['teacher1', category],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await wordsCollection.insertOne(wordDoc);
        console.log(`   ✅ ${word.traditional} - ${word.vietnamese}`);
        totalAdded++;
      }
    }

    // Add words for teacher2
    console.log('\n📝 Adding words for', teacher2.displayName);
    for (const [category, words] of Object.entries(teacher2Words)) {
      for (const word of words) {
        const wordDoc = {
          ...word,
          category: category,
          createdBy: teacher2._id,
          isPublic: true,
          tags: ['teacher2', category],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await wordsCollection.insertOne(wordDoc);
        console.log(`   ✅ ${word.traditional} - ${word.vietnamese}`);
        totalAdded++;
      }
    }

    console.log(`\n🎉 Successfully added ${totalAdded} words!`);
    console.log(`   - ${teacher1.displayName}: ${Object.values(teacher1Words).flat().length} words`);
    console.log(`   - ${teacher2.displayName}: ${Object.values(teacher2Words).flat().length} words`);

  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    await client.close();
    console.log("\n👋 Đã đóng kết nối MongoDB");
  }
}

addTeacherWords();
