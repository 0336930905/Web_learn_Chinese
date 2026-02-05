# Database Scripts

Scripts để thiết lập và quản lý database MongoDB.

## 📝 Available Scripts

### 1. Setup Database
Tạo collections với validators và indexes.

```bash
node api/scripts/setupDatabase.js
```

**Chức năng:**
- Tạo tất cả collections với validation rules
- Tạo indexes cho performance
- Setup collections phụ (badges, achievements, notifications)

**Khi nào dùng:**
- Lần đầu setup project
- Sau khi cập nhật schema
- Reset database (sau khi xóa collections)

---

### 2. Migration Script
Migrate từ v1.0 (single-user) sang v2.0 (multi-user).

```bash
node api/scripts/migrate.js
```

**Chức năng:**
- Tạo backup tự động
- Tạo default admin user
- Tạo default word set
- Migrate existing words
- Migrate existing progress data
- Update user statistics

**Default Admin Credentials:**
- Email: `admin@learnchinese.com`
- Password: `Admin@123`
- ⚠️ **Đổi password ngay sau khi login!**

**Lưu ý:**
- Script sẽ hỏi xác nhận trước khi chạy
- Backup được tạo với format: `backup_v1_YYYY-MM-DD`
- Không xóa backup sau khi migrate thành công

---

## 🔧 Configuration

### Environment Variables
Đảm bảo file `.env` có các biến sau:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NODE_ENV=development
```

### MongoDB Connection
Scripts sử dụng Mongoose để connect tới MongoDB Atlas hoặc local MongoDB.

---

## 📊 Database Collections

### Main Collections
1. **users** - User accounts
2. **wordsets** - Vocabulary sets
3. **words** - Individual words
4. **progress** - Learning progress (SRS)
5. **tests** - Custom tests
6. **testresults** - Test results
7. **userstats** - Daily statistics

### Additional Collections
8. **badges** - Achievement badges
9. **achievements** - Achievement definitions
10. **notifications** - User notifications

---

## 🚀 Quick Start

### Lần đầu setup (New Project)

```bash
# 1. Install dependencies
npm install

# 2. Setup database
node api/scripts/setupDatabase.js

# 3. (Optional) Tạo default user và sample data
# Chạy migrate script hoặc tạo user qua API
```

### Migrate từ v1.0 (Existing Project)

```bash
# 1. Backup database hiện tại (manual)
# mongodump --uri="mongodb+srv://..." --out=backup

# 2. Chạy setup để tạo schema mới
node api/scripts/setupDatabase.js

# 3. Migrate dữ liệu cũ
node api/scripts/migrate.js

# 4. Verify data
# Check collections trong MongoDB Compass
```

---

## 🛡️ Safety Features

### Backup Strategy
- Migration script tự động tạo backup
- Backup format: `backup_v1_YYYY-MM-DD_words` và `backup_v1_YYYY-MM-DD_progress`
- Giữ backup ít nhất 30 ngày

### Validation
- Schema validation ở mức `moderate` (cho phép flexibility)
- Required fields được validate
- Data types được enforce
- Unique constraints trên email, username

### Rollback
Nếu migration fail:

```bash
# 1. Stop application
# 2. Restore từ backup
mongorestore --uri="mongodb+srv://..." --nsFrom="dbname.backup_v1_*" --nsTo="dbname.*"

# 3. Drop new collections nếu cần
```

---

## 📖 Examples

### Check Collections
```javascript
// In MongoDB shell or Compass
db.getCollectionNames()

// Get collection stats
db.users.stats()
db.words.stats()
```

### Verify Indexes
```javascript
// Show all indexes for a collection
db.users.getIndexes()
db.words.getIndexes()
```

### Sample Queries
```javascript
// Find all users
db.users.find().pretty()

// Find words in a word set
db.words.find({ wordSetId: ObjectId("...") }).limit(10)

// Get user's progress
db.progress.find({ userId: ObjectId("...") }).sort({ 'srs.nextReview': 1 })
```

---

## ⚠️ Troubleshooting

### Error: Collection already exists
**Solution:** Script sẽ update validator thay vì tạo mới.

### Error: Index build failed
**Solution:** Drop existing indexes manually:
```javascript
db.collection.dropIndexes()
```

### Error: Validation failed
**Solution:** Kiểm tra data format, đảm bảo required fields có giá trị.

### Connection timeout
**Solution:** 
- Check MONGODB_URI
- Check network/firewall
- Verify MongoDB Atlas IP whitelist

---

## 📚 Related Documentation

- [Database Schema](../docs/DATABASE_SCHEMA.md)
- [API Design](../docs/API_DESIGN.md)
- [Features](../../FEATURES.md)

---

## 🔮 Future Scripts

Planned scripts:
- `seedData.js` - Tạo sample data cho testing
- `cleanupData.js` - Xóa old/orphaned records
- `exportData.js` - Export data sang JSON/CSV
- `importData.js` - Import HSK vocabulary sets

---

**Version**: 2.0.0  
**Last Updated**: 02/02/2026  
**Maintainer**: Development Team
