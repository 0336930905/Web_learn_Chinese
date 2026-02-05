# Scripts Directory

Thư mục chứa các utility scripts cho việc quản lý database và seed dữ liệu.

## 🚀 Quick Start

### Setup dữ liệu hoàn chỉnh (chạy lần đầu)

```bash
# 1. Tạo admin user
node scripts/create-admin-nhhaoa20135.js

# 2. Seed categories và words
node scripts/seed-admin-categories-words.js

# 3. Seed badges/achievements
node scripts/seed-badges.js
```

## 📚 Documentation

- **[SETUP_COMPLETE_GUIDE.md](SETUP_COMPLETE_GUIDE.md)** - 🌟 Hướng dẫn setup đầy đủ (BẮT ĐẦU TỪ ĐÂY!)
- **[SEED_GUIDE.md](SEED_GUIDE.md)** - Hướng dẫn seed Categories & Words
- **[BADGES_GUIDE.md](BADGES_GUIDE.md)** - Hướng dẫn seed Badges/Achievements  
- **[SCRIPTS_README.md](SCRIPTS_README.md)** - Tổng quan tất cả scripts

## ⚡ Main Scripts

### 1️⃣ create-admin-nhhaoa20135.js
Tạo admin user với username `nhhaoa20135`

```bash
node scripts/create-admin-nhhaoa20135.js
```

### 2️⃣ seed-admin-categories-words.js
Seed 20 categories + 200 words cho admin

```bash
node scripts/seed-admin-categories-words.js
```

### 3️⃣ seed-badges.js
Seed 33 badges/achievements vào hệ thống

```bash
node scripts/seed-badges.js
```

## 📊 Kết quả

| Script | Output |
|--------|--------|
| create-admin | 1 admin user |
| seed-categories-words | 20 categories + 200 words |
| seed-badges | 33 badges |

## 🔧 Other Utility Scripts

- `add-admin-users.js` - Thêm quyền admin cho users
- `clear-all-database.js` - ⚠️ Xóa toàn bộ database
- `create-test-user.js` - Tạo test users
- `seed-admin-words.js` - Seed words cho admin
- `set-admin-password.js` - Reset admin password
- `update-admin-password.js` - Cập nhật admin password

## ⚠️ Important Notes

1. **Chạy theo thứ tự**: Admin user → Categories/Words → Badges
2. **Idempotent**: Tất cả scripts đều safe để chạy nhiều lần
3. **No duplicates**: Tự động kiểm tra và skip nếu đã tồn tại
4. **MongoDB required**: Đảm bảo MongoDB đang chạy

## 🛡️ Security

- ⚠️ Đổi password admin sau khi login lần đầu
- 🔒 Không commit `.env` file
- 📝 Backup database trước khi chạy destructive scripts

## 📞 Need Help?

Xem [SETUP_COMPLETE_GUIDE.md](SETUP_COMPLETE_GUIDE.md) để biết hướng dẫn chi tiết và troubleshooting.
