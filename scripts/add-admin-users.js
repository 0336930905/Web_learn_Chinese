const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chinese_learning";

// Password hash for "password123"
const passwordHash = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

// Additional admin users
const additionalAdmins = [
  {
    username: "admin_teacher1",
    email: "teacher1@example.com",
    password: passwordHash,
    displayName: "Giáo Viên Lý",
    role: "admin",
    isActive: true,
    isVerified: true,
    isPremium: true,
    isAdmin: true,
    level: 1,
    totalXP: 50,
    streak: 0,
    preferences: {
      dailyGoal: 20,
      notifications: true,
      theme: "light",
      language: "vi"
    },
    badges: [],
    achievements: [],
    createdAt: new Date("2025-11-01"),
    lastLoginAt: new Date("2026-02-01")
  },
  {
    username: "admin_teacher2",
    email: "teacher2@example.com",
    password: passwordHash,
    displayName: "Giáo Viên Trần",
    role: "admin",
    isActive: true,
    isVerified: true,
    isPremium: true,
    isAdmin: true,
    level: 1,
    totalXP: 30,
    streak: 0,
    preferences: {
      dailyGoal: 20,
      notifications: true,
      theme: "dark",
      language: "vi"
    },
    badges: [],
    achievements: [],
    createdAt: new Date("2025-12-01"),
    lastLoginAt: new Date("2026-01-28")
  }
];

async function addAdminUsers() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Đã kết nối MongoDB");

    const db = client.db();
    const usersCollection = db.collection('users');

    let insertedCount = 0;
    let skippedCount = 0;

    for (const admin of additionalAdmins) {
      const existingUser = await usersCollection.findOne({
        $or: [
          { username: admin.username },
          { email: admin.email }
        ]
      });

      if (existingUser) {
        console.log(`⏭️  Bỏ qua: ${admin.username} (đã tồn tại)`);
        skippedCount++;
      } else {
        await usersCollection.insertOne(admin);
        console.log(`✅ Đã thêm admin: ${admin.displayName} (${admin.email})`);
        insertedCount++;
      }
    }

    console.log(`\n📊 Kết quả:`);
    console.log(`   - Đã thêm: ${insertedCount} admin users`);
    console.log(`   - Đã bỏ qua: ${skippedCount} users`);
    
    // Count total admins
    const totalAdmins = await usersCollection.countDocuments({ role: 'admin' });
    console.log(`   - Tổng admin hiện tại: ${totalAdmins}`);

    console.log("\n🎉 Hoàn thành!");
    console.log("\n📝 Thông tin admin mới (password: password123):");
    console.log("   - teacher1@example.com - Giáo Viên Lý");
    console.log("   - teacher2@example.com - Giáo Viên Trần");

  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    await client.close();
    console.log("\n👋 Đã đóng kết nối MongoDB");
  }
}

addAdminUsers();
