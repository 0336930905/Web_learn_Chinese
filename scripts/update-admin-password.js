const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/chinese_learning";

async function updateAdminPassword() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Đã kết nối MongoDB");

    const db = client.db();
    const usersCollection = db.collection('users');

    // Find admin user
    const admin = await usersCollection.findOne({ email: 'admin@example.com' });

    if (!admin) {
      console.log('❌ Không tìm thấy admin@example.com');
      return;
    }

    console.log(`📋 Admin hiện tại:`, {
      email: admin.email,
      username: admin.username,
      displayName: admin.displayName,
      role: admin.role
    });

    // Hash new password
    const newPassword = 'admin123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await usersCollection.updateOne(
      { email: 'admin@example.com' },
      { 
        $set: { 
          password: hashedPassword,
          role: 'admin',
          isAdmin: true,
          isActive: true,
          isVerified: true
        } 
      }
    );

    console.log('✅ Đã cập nhật mật khẩu admin thành công!');
    console.log('\n📝 Thông tin đăng nhập:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123456');

    // Verify password
    const updatedAdmin = await usersCollection.findOne({ email: 'admin@example.com' });
    const isValid = await bcrypt.compare(newPassword, updatedAdmin.password);
    console.log('\n🔐 Kiểm tra mật khẩu:', isValid ? '✅ Hợp lệ' : '❌ Không hợp lệ');

  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    await client.close();
    console.log("\n👋 Đã đóng kết nối MongoDB");
  }
}

updateAdminPassword();
