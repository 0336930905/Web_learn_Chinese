const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chinese_learning";

// Generate ObjectIds for referencing between collections
const userIds = Array.from({ length: 5 }, () => new ObjectId());
const wordSetIds = Array.from({ length: 5 }, () => new ObjectId());
const wordIds = Array.from({ length: 25 }, () => new ObjectId()); // 5 words per set
const testIds = Array.from({ length: 5 }, () => new ObjectId());
const badgeIds = Array.from({ length: 5 }, () => new ObjectId());
const achievementIds = Array.from({ length: 5 }, () => new ObjectId());

// Demo data generators
// Password hash for "password123" - bcrypt hash must be exactly 60 characters
const passwordHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

const demoData = {
  users: [
    {
      _id: userIds[0],
      username: "demo_user1",
      email: "demo1@example.com",
      password: passwordHash,
      displayName: "张伟",
      role: "user",
      isActive: true,
      isVerified: true,
      isPremium: false,
      level: 5,
      totalXP: 1250,
      streak: 7,
      preferences: {
        dailyGoal: 50,
        notifications: true,
        theme: "light",
        language: "vi"
      },
      badges: [badgeIds[0], badgeIds[1]],
      achievements: [achievementIds[0]],
      createdAt: new Date("2025-12-01"),
      lastLoginAt: new Date("2026-02-02")
    },
    {
      _id: userIds[1],
      username: "demo_user2",
      email: "demo2@example.com",
      password: passwordHash,
      displayName: "李娜",
      role: "user",
      isActive: true,
      isVerified: true,
      isPremium: false,
      level: 3,
      totalXP: 750,
      streak: 3,
      preferences: {
        dailyGoal: 30,
        notifications: true,
        theme: "dark",
        language: "vi"
      },
      badges: [badgeIds[0]],
      achievements: [],
      createdAt: new Date("2026-01-10"),
      lastLoginAt: new Date("2026-02-01")
    },
    {
      _id: userIds[2],
      username: "demo_user3",
      email: "demo3@example.com",
      password: passwordHash,
      displayName: "王芳",
      role: "user",
      isActive: true,
      isVerified: true,
      isPremium: false,
      level: 8,
      totalXP: 2400,
      streak: 15,
      preferences: {
        dailyGoal: 100,
        notifications: true,
        theme: "light",
        language: "vi"
      },
      badges: [badgeIds[0], badgeIds[1], badgeIds[2]],
      achievements: [achievementIds[0], achievementIds[1]],
      createdAt: new Date("2025-11-15"),
      lastLoginAt: new Date("2026-02-02")
    },
    {
      _id: userIds[3],
      username: "demo_user4",
      email: "demo4@example.com",
      password: passwordHash,
      displayName: "刘洋",
      role: "user",
      isActive: true,
      isVerified: true,
      isPremium: true,
      level: 12,
      totalXP: 4500,
      streak: 30,
      preferences: {
        dailyGoal: 150,
        notifications: true,
        theme: "dark",
        language: "vi"
      },
      badges: [badgeIds[0], badgeIds[1], badgeIds[2], badgeIds[3]],
      achievements: [achievementIds[0], achievementIds[1], achievementIds[2]],
      createdAt: new Date("2025-10-01"),
      lastLoginAt: new Date("2026-02-02")
    },
    {
      _id: userIds[4],
      username: "admin_demo",
      email: "admin@example.com",
      password: passwordHash,
      displayName: "管理员",
      role: "admin",
      isActive: true,
      isVerified: true,
      isPremium: true,
      level: 1,
      totalXP: 100,
      streak: 1,
      preferences: {
        dailyGoal: 20,
        notifications: true,
        theme: "light",
        language: "vi"
      },
      badges: [],
      achievements: [],
      createdAt: new Date("2025-09-01"),
      lastLoginAt: new Date("2026-02-02")
    }
  ],

  wordsets: [
    {
      _id: wordSetIds[0],
      userId: userIds[4],
      name: "HSK 1 - Cơ bản",
      description: "Từ vựng HSK cấp độ 1 - 150 từ cơ bản nhất",
      category: "beginner",
      subcategory: "HSK",
      tags: ["HSK1", "basic", "beginner"],
      isPublic: true,
      isOfficial: true,
      allowClone: true,
      allowContribute: false,
      wordCount: 5,
      difficulty: 1,
      createdAt: new Date("2025-12-01"),
      updatedAt: new Date("2026-01-15")
    },
    {
      _id: wordSetIds[1],
      userId: userIds[4],
      name: "HSK 2 - Nâng cao",
      description: "Từ vựng HSK cấp độ 2 - 300 từ",
      category: "intermediate",
      subcategory: "HSK",
      tags: ["HSK2", "elementary"],
      isPublic: true,
      isOfficial: true,
      allowClone: true,
      allowContribute: false,
      wordCount: 5,
      difficulty: 2,
      createdAt: new Date("2025-12-10"),
      updatedAt: new Date("2026-01-20")
    },
    {
      _id: wordSetIds[2],
      userId: userIds[0],
      name: "Giao tiếp hàng ngày",
      description: "Các câu giao tiếp thông dụng trong cuộc sống",
      category: "beginner",
      subcategory: "Daily",
      tags: ["daily", "conversation", "practical"],
      isPublic: true,
      isOfficial: false,
      allowClone: true,
      allowContribute: true,
      wordCount: 5,
      difficulty: 1,
      createdAt: new Date("2025-12-15"),
      updatedAt: new Date("2026-02-01")
    },
    {
      _id: wordSetIds[3],
      userId: userIds[3],
      name: "Từ vựng kinh doanh",
      description: "Thuật ngữ tiếng Trung trong kinh doanh",
      category: "advanced",
      subcategory: "Business",
      tags: ["business", "professional", "workplace"],
      isPublic: false,
      isOfficial: false,
      allowClone: false,
      allowContribute: false,
      wordCount: 5,
      difficulty: 4,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-30")
    },
    {
      _id: wordSetIds[4],
      userId: userIds[2],
      name: "Ẩm thực Trung Hoa",
      description: "Từ vựng về món ăn và nhà hàng",
      category: "intermediate",
      subcategory: "Culture",
      tags: ["food", "restaurant", "culture"],
      isPublic: true,
      isOfficial: false,
      allowClone: true,
      allowContribute: true,
      wordCount: 5,
      difficulty: 3,
      createdAt: new Date("2025-12-20"),
      updatedAt: new Date("2026-01-25")
    }
  ],

  words: [
    // WordSet 1 - HSK 1
    { _id: wordIds[0], wordSetId: wordSetIds[0], userId: userIds[4], traditional: "你好", simplified: "你好", pinyin: "nǐ hǎo", pinyinNumbered: "ni3 hao3", vietnamese: "Xin chào", english: "Hello", partOfSpeech: "interjection", difficulty: 1, hskLevel: 1, order: 0, createdAt: new Date("2025-12-01"), updatedAt: new Date("2025-12-01") },
    { _id: wordIds[1], wordSetId: wordSetIds[0], userId: userIds[4], traditional: "謝謝", simplified: "谢谢", pinyin: "xièxie", pinyinNumbered: "xie4xie4", vietnamese: "Cảm ơn", english: "Thank you", partOfSpeech: "verb", difficulty: 1, hskLevel: 1, order: 1, createdAt: new Date("2025-12-01"), updatedAt: new Date("2025-12-01") },
    { _id: wordIds[2], wordSetId: wordSetIds[0], userId: userIds[4], traditional: "再見", simplified: "再见", pinyin: "zàijiàn", pinyinNumbered: "zai4 jian4", vietnamese: "Tạm biệt", english: "Goodbye", partOfSpeech: "interjection", difficulty: 1, hskLevel: 1, order: 2, createdAt: new Date("2025-12-01"), updatedAt: new Date("2025-12-01") },
    { _id: wordIds[3], wordSetId: wordSetIds[0], userId: userIds[4], traditional: "對不起", simplified: "对不起", pinyin: "duìbuqǐ", pinyinNumbered: "dui4bu5qi3", vietnamese: "Xin lỗi", english: "Sorry", partOfSpeech: "phrase", difficulty: 1, hskLevel: 1, order: 3, createdAt: new Date("2025-12-01"), updatedAt: new Date("2025-12-01") },
    { _id: wordIds[4], wordSetId: wordSetIds[0], userId: userIds[4], traditional: "沒關係", simplified: "没关系", pinyin: "méi guānxi", pinyinNumbered: "mei2 guan1xi5", vietnamese: "Không sao", english: "No problem", partOfSpeech: "phrase", difficulty: 1, hskLevel: 1, order: 4, createdAt: new Date("2025-12-01"), updatedAt: new Date("2025-12-01") },
    
    // WordSet 2 - HSK 2
    { _id: wordIds[5], wordSetId: wordSetIds[1], userId: userIds[4], traditional: "學習", simplified: "学习", pinyin: "xuéxí", pinyinNumbered: "xue2xi2", vietnamese: "Học tập", english: "Study", partOfSpeech: "verb", difficulty: 2, hskLevel: 2, order: 0, createdAt: new Date("2025-12-10"), updatedAt: new Date("2025-12-10") },
    { _id: wordIds[6], wordSetId: wordSetIds[1], userId: userIds[4], traditional: "工作", simplified: "工作", pinyin: "gōngzuò", pinyinNumbered: "gong1zuo4", vietnamese: "Làm việc", english: "Work", partOfSpeech: "verb/noun", difficulty: 2, hskLevel: 2, order: 1, createdAt: new Date("2025-12-10"), updatedAt: new Date("2025-12-10") },
    { _id: wordIds[7], wordSetId: wordSetIds[1], userId: userIds[4], traditional: "朋友", simplified: "朋友", pinyin: "péngyou", pinyinNumbered: "peng2you5", vietnamese: "Bạn bè", english: "Friend", partOfSpeech: "noun", difficulty: 2, hskLevel: 2, order: 2, createdAt: new Date("2025-12-10"), updatedAt: new Date("2025-12-10") },
    { _id: wordIds[8], wordSetId: wordSetIds[1], userId: userIds[4], traditional: "時間", simplified: "时间", pinyin: "shíjiān", pinyinNumbered: "shi2jian1", vietnamese: "Thời gian", english: "Time", partOfSpeech: "noun", difficulty: 2, hskLevel: 2, order: 3, createdAt: new Date("2025-12-10"), updatedAt: new Date("2025-12-10") },
    { _id: wordIds[9], wordSetId: wordSetIds[1], userId: userIds[4], traditional: "喜歡", simplified: "喜欢", pinyin: "xǐhuan", pinyinNumbered: "xi3huan5", vietnamese: "Thích", english: "Like", partOfSpeech: "verb", difficulty: 2, hskLevel: 2, order: 4, createdAt: new Date("2025-12-10"), updatedAt: new Date("2025-12-10") },
    
    // WordSet 3 - Daily
    { _id: wordIds[10], wordSetId: wordSetIds[2], userId: userIds[0], traditional: "多少錢", simplified: "多少钱", pinyin: "duōshao qián", pinyinNumbered: "duo1shao5 qian2", vietnamese: "Bao nhiêu tiền", english: "How much money", partOfSpeech: "phrase", difficulty: 2, hskLevel: 1, order: 0, createdAt: new Date("2025-12-15"), updatedAt: new Date("2025-12-15") },
    { _id: wordIds[11], wordSetId: wordSetIds[2], userId: userIds[0], traditional: "在哪裡", simplified: "在哪里", pinyin: "zài nǎlǐ", pinyinNumbered: "zai4 na3li3", vietnamese: "Ở đâu", english: "Where", partOfSpeech: "phrase", difficulty: 2, hskLevel: 1, order: 1, createdAt: new Date("2025-12-15"), updatedAt: new Date("2025-12-15") },
    { _id: wordIds[12], wordSetId: wordSetIds[2], userId: userIds[0], traditional: "怎麼走", simplified: "怎么走", pinyin: "zěnme zǒu", pinyinNumbered: "zen3me5 zou3", vietnamese: "Đi như thế nào", english: "How to go", partOfSpeech: "phrase", difficulty: 2, hskLevel: 2, order: 2, createdAt: new Date("2025-12-15"), updatedAt: new Date("2025-12-15") },
    { _id: wordIds[13], wordSetId: wordSetIds[2], userId: userIds[0], traditional: "我要", simplified: "我要", pinyin: "wǒ yào", pinyinNumbered: "wo3 yao4", vietnamese: "Tôi muốn", english: "I want", partOfSpeech: "phrase", difficulty: 1, hskLevel: 1, order: 3, createdAt: new Date("2025-12-15"), updatedAt: new Date("2025-12-15") },
    { _id: wordIds[14], wordSetId: wordSetIds[2], userId: userIds[0], traditional: "買單", simplified: "买单", pinyin: "mǎi dān", pinyinNumbered: "mai3 dan1", vietnamese: "Thanh toán", english: "Pay the bill", partOfSpeech: "verb", difficulty: 2, hskLevel: 3, order: 4, createdAt: new Date("2025-12-15"), updatedAt: new Date("2025-12-15") },
    
    // WordSet 4 - Business
    { _id: wordIds[15], wordSetId: wordSetIds[3], userId: userIds[3], traditional: "合同", simplified: "合同", pinyin: "hétong", pinyinNumbered: "he2tong5", vietnamese: "Hợp đồng", english: "Contract", partOfSpeech: "noun", difficulty: 4, hskLevel: 4, order: 0, createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-01") },
    { _id: wordIds[16], wordSetId: wordSetIds[3], userId: userIds[3], traditional: "會議", simplified: "会议", pinyin: "huìyì", pinyinNumbered: "hui4yi4", vietnamese: "Họp", english: "Meeting", partOfSpeech: "noun", difficulty: 3, hskLevel: 4, order: 1, createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-01") },
    { _id: wordIds[17], wordSetId: wordSetIds[3], userId: userIds[3], traditional: "客戶", simplified: "客户", pinyin: "kèhù", pinyinNumbered: "ke4hu4", vietnamese: "Khách hàng", english: "Customer", partOfSpeech: "noun", difficulty: 3, hskLevel: 5, order: 2, createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-01") },
    { _id: wordIds[18], wordSetId: wordSetIds[3], userId: userIds[3], traditional: "報價", simplified: "报价", pinyin: "bàojià", pinyinNumbered: "bao4jia4", vietnamese: "Báo giá", english: "Quotation", partOfSpeech: "verb/noun", difficulty: 4, hskLevel: 5, order: 3, createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-01") },
    { _id: wordIds[19], wordSetId: wordSetIds[3], userId: userIds[3], traditional: "利潤", simplified: "利润", pinyin: "lìrùn", pinyinNumbered: "li4run4", vietnamese: "Lợi nhuận", english: "Profit", partOfSpeech: "noun", difficulty: 4, hskLevel: 5, order: 4, createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-01") },
    
    // WordSet 5 - Food
    { _id: wordIds[20], wordSetId: wordSetIds[4], userId: userIds[2], traditional: "餃子", simplified: "饺子", pinyin: "jiǎozi", pinyinNumbered: "jiao3zi5", vietnamese: "Sủi cảo", english: "Dumpling", partOfSpeech: "noun", difficulty: 2, hskLevel: 3, order: 0, createdAt: new Date("2025-12-20"), updatedAt: new Date("2025-12-20") },
    { _id: wordIds[21], wordSetId: wordSetIds[4], userId: userIds[2], traditional: "米飯", simplified: "米饭", pinyin: "mǐfàn", pinyinNumbered: "mi3fan4", vietnamese: "Cơm", english: "Rice", partOfSpeech: "noun", difficulty: 1, hskLevel: 2, order: 1, createdAt: new Date("2025-12-20"), updatedAt: new Date("2025-12-20") },
    { _id: wordIds[22], wordSetId: wordSetIds[4], userId: userIds[2], traditional: "麵條", simplified: "面条", pinyin: "miàntiáo", pinyinNumbered: "mian4tiao2", vietnamese: "Mì", english: "Noodles", partOfSpeech: "noun", difficulty: 2, hskLevel: 3, order: 2, createdAt: new Date("2025-12-20"), updatedAt: new Date("2025-12-20") },
    { _id: wordIds[23], wordSetId: wordSetIds[4], userId: userIds[2], traditional: "菜單", simplified: "菜单", pinyin: "càidān", pinyinNumbered: "cai4dan1", vietnamese: "Thực đơn", english: "Menu", partOfSpeech: "noun", difficulty: 2, hskLevel: 3, order: 3, createdAt: new Date("2025-12-20"), updatedAt: new Date("2025-12-20") },
    { _id: wordIds[24], wordSetId: wordSetIds[4], userId: userIds[2], traditional: "筷子", simplified: "筷子", pinyin: "kuàizi", pinyinNumbered: "kuai4zi5", vietnamese: "Đũa", english: "Chopsticks", partOfSpeech: "noun", difficulty: 2, hskLevel: 2, order: 4, createdAt: new Date("2025-12-20"), updatedAt: new Date("2025-12-20") }
  ],

  progress: [
    { userId: userIds[0], wordId: wordIds[0], wordSetId: wordSetIds[0], masteryLevel: 75, status: "reviewing", reviewCount: 5, correctCount: 4, incorrectCount: 1, consecutiveCorrect: 2, consecutiveIncorrect: 0, createdAt: new Date("2025-12-02"), updatedAt: new Date("2026-02-02") },
    { userId: userIds[0], wordId: wordIds[1], wordSetId: wordSetIds[0], masteryLevel: 60, status: "learning", reviewCount: 3, correctCount: 2, incorrectCount: 1, consecutiveCorrect: 1, consecutiveIncorrect: 0, createdAt: new Date("2025-12-03"), updatedAt: new Date("2026-02-02") },
    { userId: userIds[0], wordId: wordIds[2], wordSetId: wordSetIds[0], masteryLevel: 85, status: "reviewing", reviewCount: 7, correctCount: 6, incorrectCount: 1, consecutiveCorrect: 3, consecutiveIncorrect: 0, createdAt: new Date("2025-12-01"), updatedAt: new Date("2026-02-02") },
    { userId: userIds[1], wordId: wordIds[0], wordSetId: wordSetIds[0], masteryLevel: 40, status: "learning", reviewCount: 2, correctCount: 1, incorrectCount: 1, consecutiveCorrect: 0, consecutiveIncorrect: 1, createdAt: new Date("2026-01-11"), updatedAt: new Date("2026-02-02") },
    { userId: userIds[2], wordId: wordIds[5], wordSetId: wordSetIds[1], masteryLevel: 95, status: "mastered", reviewCount: 10, correctCount: 9, incorrectCount: 1, consecutiveCorrect: 5, consecutiveIncorrect: 0, createdAt: new Date("2025-12-11"), updatedAt: new Date("2026-02-02") }
  ],

  tests: [
    {
      _id: testIds[0],
      userId: userIds[4],
      wordSetId: wordSetIds[0],
      name: "HSK 1 - Kiểm tra tuần 1",
      description: "Kiểm tra từ vựng HSK 1 tuần đầu tiên",
      type: "multiple-choice",
      category: "HSK",
      isPublic: true,
      isOfficial: true,
      allowClone: true,
      createdAt: new Date("2025-12-05"),
      updatedAt: new Date("2025-12-05")
    },
    {
      _id: testIds[1],
      userId: userIds[4],
      wordSetId: wordSetIds[1],
      name: "HSK 2 - Thực hành",
      description: "Bài tập thực hành HSK 2",
      type: "flashcard",
      category: "HSK",
      isPublic: true,
      isOfficial: true,
      allowClone: true,
      createdAt: new Date("2025-12-15"),
      updatedAt: new Date("2025-12-15")
    },
    {
      _id: testIds[2],
      userId: userIds[0],
      wordSetId: wordSetIds[2],
      name: "Giao tiếp - Quiz nhanh",
      description: "Kiểm tra nhanh các câu giao tiếp hàng ngày",
      type: "writing",
      category: "Daily",
      isPublic: true,
      isOfficial: false,
      allowClone: true,
      createdAt: new Date("2025-12-20"),
      updatedAt: new Date("2025-12-20")
    },
    {
      _id: testIds[3],
      userId: userIds[3],
      wordSetId: wordSetIds[3],
      name: "Kinh doanh - Cơ bản",
      description: "Thuật ngữ kinh doanh cơ bản",
      type: "multiple-choice",
      category: "Business",
      isPublic: false,
      isOfficial: false,
      allowClone: false,
      createdAt: new Date("2026-01-05"),
      updatedAt: new Date("2026-01-05")
    },
    {
      _id: testIds[4],
      userId: userIds[2],
      wordSetId: wordSetIds[4],
      name: "Ẩm thực - Thực đơn",
      description: "Từ vựng về đồ ăn và nhà hàng",
      type: "mixed",
      category: "Culture",
      isPublic: true,
      isOfficial: false,
      allowClone: true,
      createdAt: new Date("2025-12-25"),
      updatedAt: new Date("2025-12-25")
    }
  ],

  testresults: [
    {
      userId: userIds[0],
      testId: testIds[0],
      wordSetId: wordSetIds[0],
      sessionId: "session-001-20260110",
      attemptNumber: 1,
      score: 100,
      pointsEarned: 30,
      totalPoints: 30,
      totalQuestions: 3,
      correctAnswers: 3,
      incorrectAnswers: 0,
      skippedAnswers: 0,
      timeSpent: 12,
      passed: true,
      passingScore: 70,
      createdAt: new Date("2026-01-10T10:30:00"),
      completedAt: new Date("2026-01-10T10:30:12")
    },
    {
      userId: userIds[1],
      testId: testIds[0],
      wordSetId: wordSetIds[0],
      sessionId: "session-002-20260115",
      attemptNumber: 1,
      score: 67,
      pointsEarned: 20,
      totalPoints: 30,
      totalQuestions: 3,
      correctAnswers: 2,
      incorrectAnswers: 1,
      skippedAnswers: 0,
      timeSpent: 24,
      passed: false,
      passingScore: 70,
      createdAt: new Date("2026-01-15T14:20:00"),
      completedAt: new Date("2026-01-15T14:20:24")
    },
    {
      userId: userIds[2],
      testId: testIds[1],
      wordSetId: wordSetIds[1],
      sessionId: "session-003-20260120",
      attemptNumber: 1,
      score: 100,
      pointsEarned: 20,
      totalPoints: 20,
      totalQuestions: 2,
      correctAnswers: 2,
      incorrectAnswers: 0,
      skippedAnswers: 0,
      timeSpent: 7,
      passed: true,
      passingScore: 60,
      createdAt: new Date("2026-01-20T16:45:00"),
      completedAt: new Date("2026-01-20T16:45:07")
    },
    {
      userId: userIds[0],
      testId: testIds[2],
      wordSetId: wordSetIds[2],
      sessionId: "session-004-20260125",
      attemptNumber: 1,
      score: 50,
      pointsEarned: 10,
      totalPoints: 20,
      totalQuestions: 2,
      correctAnswers: 1,
      incorrectAnswers: 1,
      skippedAnswers: 0,
      timeSpent: 27,
      passed: false,
      passingScore: 75,
      createdAt: new Date("2026-01-25T09:15:00"),
      completedAt: new Date("2026-01-25T09:15:27")
    },
    {
      userId: userIds[3],
      testId: testIds[3],
      wordSetId: wordSetIds[3],
      sessionId: "session-005-20260128",
      attemptNumber: 1,
      score: 100,
      pointsEarned: 20,
      totalPoints: 20,
      totalQuestions: 2,
      correctAnswers: 2,
      incorrectAnswers: 0,
      skippedAnswers: 0,
      timeSpent: 11,
      passed: true,
      passingScore: 80,
      createdAt: new Date("2026-01-28T11:30:00"),
      completedAt: new Date("2026-01-28T11:30:11")
    }
  ],

  userstats: [
    {
      userId: userIds[0],
      date: new Date("2026-02-01T00:00:00Z"),
      year: 2026,
      month: 2,
      week: 5,
      dayOfWeek: 6,
      wordsLearned: 12,
      wordsReviewed: 25,
      testsCompleted: 2,
      testsScore: 75,
      xpEarned: 150,
      studyTime: 45,
      streak: 7,
      createdAt: new Date("2026-02-01T00:00:00Z"),
      updatedAt: new Date("2026-02-01T23:59:59Z")
    },
    {
      userId: userIds[1],
      date: new Date("2026-02-01T00:00:00Z"),
      year: 2026,
      month: 2,
      week: 5,
      dayOfWeek: 6,
      wordsLearned: 8,
      wordsReviewed: 15,
      testsCompleted: 1,
      testsScore: 67,
      xpEarned: 80,
      studyTime: 30,
      streak: 3,
      createdAt: new Date("2026-02-01T00:00:00Z"),
      updatedAt: new Date("2026-02-01T23:59:59Z")
    },
    {
      userId: userIds[2],
      date: new Date("2026-02-01T00:00:00Z"),
      year: 2026,
      month: 2,
      week: 5,
      dayOfWeek: 6,
      wordsLearned: 20,
      wordsReviewed: 45,
      testsCompleted: 3,
      testsScore: 92,
      xpEarned: 220,
      studyTime: 90,
      streak: 15,
      createdAt: new Date("2026-02-01T00:00:00Z"),
      updatedAt: new Date("2026-02-01T23:59:59Z")
    },
    {
      userId: userIds[3],
      date: new Date("2026-02-01T00:00:00Z"),
      year: 2026,
      month: 2,
      week: 5,
      dayOfWeek: 6,
      wordsLearned: 35,
      wordsReviewed: 80,
      testsCompleted: 5,
      testsScore: 95,
      xpEarned: 400,
      studyTime: 150,
      streak: 30,
      createdAt: new Date("2026-02-01T00:00:00Z"),
      updatedAt: new Date("2026-02-01T23:59:59Z")
    },
    {
      userId: userIds[0],
      date: new Date("2026-02-02T00:00:00Z"),
      year: 2026,
      month: 2,
      week: 5,
      dayOfWeek: 0,
      wordsLearned: 15,
      wordsReviewed: 30,
      testsCompleted: 1,
      testsScore: 80,
      xpEarned: 180,
      studyTime: 60,
      streak: 8,
      createdAt: new Date("2026-02-02T00:00:00Z"),
      updatedAt: new Date("2026-02-02T23:59:59Z")
    }
  ],

  badges: [
    {
      _id: badgeIds[0],
      badgeId: "beginner-001",
      name: "First Step",
      nameVi: "Người mới bắt đầu",
      description: "Complete your first lesson",
      descriptionVi: "Hoàn thành bài học đầu tiên",
      icon: "🌟",
      category: "beginner",
      rarity: "common",
      points: 50
    },
    {
      _id: badgeIds[1],
      badgeId: "streak-007",
      name: "7-Day Scholar",
      nameVi: "Học giả 7 ngày",
      description: "Maintain a 7-day streak",
      descriptionVi: "Duy trì streak 7 ngày liên tục",
      icon: "🔥",
      category: "streak",
      rarity: "rare",
      points: 100
    },
    {
      _id: badgeIds[2],
      badgeId: "vocab-100",
      name: "Vocabulary Master",
      nameVi: "Bậc thầy từ vựng",
      description: "Learn 100 new words",
      descriptionVi: "Học được 100 từ mới",
      icon: "📚",
      category: "vocabulary",
      rarity: "rare",
      points: 200
    },
    {
      _id: badgeIds[3],
      badgeId: "perfect-005",
      name: "Test Warrior",
      nameVi: "Chiến binh thi cử",
      description: "Score 100% on 5 tests",
      descriptionVi: "Đạt điểm 100% trong 5 bài test",
      icon: "🏆",
      category: "testing",
      rarity: "epic",
      points: 300
    },
    {
      _id: badgeIds[4],
      badgeId: "hsk-master",
      name: "HSK Master",
      nameVi: "HSK Master",
      description: "Complete all HSK tests",
      descriptionVi: "Hoàn thành tất cả bài test HSK",
      icon: "👑",
      category: "achievement",
      rarity: "legendary",
      points: 500
    }
  ],

  achievements: [
    {
      _id: achievementIds[0],
      achievementId: "user0-badge0",
      userId: userIds[0],
      badgeId: "beginner-001",
      name: "First Step",
      nameVi: "Người mới bắt đầu",
      category: "beginner",
      earnedAt: new Date("2025-12-02"),
      progress: 100
    },
    {
      _id: achievementIds[1],
      achievementId: "user2-badge1",
      userId: userIds[2],
      badgeId: "streak-007",
      name: "7-Day Scholar",
      nameVi: "Học giả 7 ngày",
      category: "streak",
      earnedAt: new Date("2025-12-10"),
      progress: 100
    },
    {
      _id: achievementIds[2],
      achievementId: "user3-badge2",
      userId: userIds[3],
      badgeId: "vocab-100",
      name: "Vocabulary Master",
      nameVi: "Bậc thầy từ vựng",
      category: "vocabulary",
      earnedAt: new Date("2025-11-20"),
      progress: 100
    },
    {
      _id: achievementIds[3],
      achievementId: "user0-badge1",
      userId: userIds[0],
      badgeId: "streak-007",
      name: "7-Day Scholar",
      nameVi: "Học giả 7 ngày",
      category: "streak",
      earnedAt: new Date("2026-01-05"),
      progress: 100
    },
    {
      _id: achievementIds[4],
      achievementId: "user3-badge3",
      userId: userIds[3],
      badgeId: "perfect-005",
      name: "Test Warrior",
      nameVi: "Chiến binh thi cử",
      category: "testing",
      earnedAt: new Date("2026-01-28"),
      progress: 100
    }
  ],

  notifications: [
    {
      userId: userIds[0],
      type: "achievement",
      title: "Huy hiệu mới! 🎉",
      message: "Bạn vừa nhận được huy hiệu 'Học giả 7 ngày'",
      data: { badgeId: badgeIds[1].toString() },
      isRead: false,
      createdAt: new Date("2026-02-02T08:00:00")
    },
    {
      userId: userIds[1],
      type: "reminder",
      title: "Đã đến giờ học! ⏰",
      message: "Bạn còn 15 từ cần ôn tập hôm nay",
      data: { wordCount: 15 },
      isRead: true,
      createdAt: new Date("2026-02-01T18:00:00")
    },
    {
      userId: userIds[2],
      type: "test",
      title: "Bài kiểm tra mới",
      message: "Có bài kiểm tra HSK 1 mới được thêm vào",
      data: { testId: testIds[0].toString() },
      isRead: false,
      createdAt: new Date("2026-01-30T10:00:00")
    },
    {
      userId: userIds[0],
      type: "streak",
      title: "Streak sắp hết! 🔥",
      message: "Hãy học ngay để duy trì chuỗi 7 ngày của bạn",
      data: { currentStreak: 7 },
      isRead: false,
      createdAt: new Date("2026-02-02T20:00:00")
    },
    {
      userId: userIds[3],
      type: "level_up",
      title: "Thăng cấp! 🎊",
      message: "Chúc mừng! Bạn đã đạt level 12",
      data: { newLevel: 12, xpEarned: 500 },
      isRead: true,
      createdAt: new Date("2026-01-28T15:30:00")
    }
  ]
};

async function seedDatabase() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Đã kết nối MongoDB");

    const db = client.db();

    // Insert data for each collection
    const collections = Object.keys(demoData);
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const data = demoData[collectionName];

      // Clear existing data
      await collection.deleteMany({});
      console.log(`🗑️  Đã xóa dữ liệu cũ trong collection: ${collectionName}`);

      // Insert new data
      if (data.length > 0) {
        await collection.insertMany(data);
        console.log(`✅ Đã thêm ${data.length} dữ liệu vào collection: ${collectionName}`);
      }
    }

    console.log("\n📊 Tổng kết:");
    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`   - ${collectionName}: ${count} documents`);
    }

    console.log("\n🎉 Hoàn thành! Đã thêm dữ liệu demo vào MongoDB");
    console.log("\n📝 Thông tin đăng nhập demo:");
    console.log("   - User 1: demo_user1 / password123");
    console.log("   - User 2: demo_user2 / password123");
    console.log("   - User 3: demo_user3 / password123");
    console.log("   - User 4 (Premium): demo_user4 / password123");
    console.log("   - Admin: admin_demo / password123");

  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    await client.close();
    console.log("\n👋 Đã đóng kết nối MongoDB");
  }
}

// Run the seed
seedDatabase();
