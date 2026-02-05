const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chinese_learning";

// Password hash for "password123"
const passwordHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

// Demo users data
const demoUsers = [
  {
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
    badges: [],
    achievements: [],
    createdAt: new Date("2025-12-01"),
    lastLoginAt: new Date("2026-02-02")
  },
  {
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
    badges: [],
    achievements: [],
    createdAt: new Date("2026-01-10"),
    lastLoginAt: new Date("2026-02-01")
  },
  {
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
    badges: [],
    achievements: [],
    createdAt: new Date("2025-11-15"),
    lastLoginAt: new Date("2026-02-02")
  },
  {
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
    badges: [],
    achievements: [],
    createdAt: new Date("2025-10-01"),
    lastLoginAt: new Date("2026-02-02")
  },
  {
    username: "admin",
    email: "admin@example.com",
    password: passwordHash,
    displayName: "Quản Trị Viên",
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
];

async function restoreUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Đã kết nối MongoDB");

    const db = client.db();
    const usersCollection = db.collection('users');

    // Check current users
    const currentCount = await usersCollection.countDocuments();
    console.log(`📊 Số users hiện tại: ${currentCount}`);

    if (currentCount > 0) {
      console.log('\n⚠️  Đã có users trong database!');
      console.log('Bạn có muốn:');
      console.log('1. Thêm users demo (không xóa users hiện có)');
      console.log('2. Xóa tất cả và thêm lại users demo');
      console.log('\nĐang chọn tùy chọn 1 (an toàn hơn)...\n');
    }

    // Insert demo users (skip if exists)
    let insertedCount = 0;
    let skippedCount = 0;

    for (const user of demoUsers) {
      const existingUser = await usersCollection.findOne({
        $or: [
          { username: user.username },
          { email: user.email }
        ]
      });

      if (existingUser) {
        console.log(`⏭️  Bỏ qua: ${user.username} (đã tồn tại)`);
        skippedCount++;
      } else {
        await usersCollection.insertOne(user);
        console.log(`✅ Đã thêm: ${user.username} (${user.role})`);
        insertedCount++;
      }
    }

    console.log(`\n📊 Kết quả:`);
    console.log(`   - Đã thêm: ${insertedCount} users`);
    console.log(`   - Đã bỏ qua: ${skippedCount} users`);
    console.log(`   - Tổng users hiện tại: ${await usersCollection.countDocuments()}`);

    console.log("\n🎉 Hoàn thành khôi phục users!");
    console.log("\n📝 Thông tin đăng nhập (password: password123):");
    console.log("   - demo_user1 (Level 5)");
    console.log("   - demo_user2 (Level 3)");
    console.log("   - demo_user3 (Level 8)");
    console.log("   - demo_user4 (Level 12 - Premium)");
    console.log("   - admin (Admin role)");

  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    await client.close();
    console.log("\n👋 Đã đóng kết nối MongoDB");
  }
}

// Run the restore
restoreUsers();
