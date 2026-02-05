# Web Học Tiếng Đài Loan

Ứng dụng web để tự học tiếng Đài Loan/Trung Quốc với Node.js, MongoDB Atlas và Vercel.

## Tài khoản Admin
- **Email:** admin@example.com
- **Mật khẩu:** admin123456
-- node scripts/clear-all-database.js xóa tất cả dữ liệu 
## Tính năng nổi bật

### 🎓 Học từ vựng
- Học từ vựng tiếng Đài Loan với chữ Hán phồn thể
- Bộ từ vựng của Admin: Tất cả người dùng có thể xem bộ từ vựng do admin tạo
- Luyện tập câu và ngữ pháp
- Theo dõi tiến độ học tập

### 👥 Hỗ trợ nhiều tài khoản
Ứng dụng hỗ trợ đăng nhập nhiều tài khoản trên cùng một trình duyệt:
- Mỗi tab/cửa sổ có thể đăng nhập tài khoản khác nhau
- Sử dụng sessionStorage để phân biệt session
- Admin và User có thể truy cập dashboard riêng

### 🔐 Phân quyền
- **Admin** (`role === 'admin'`): 
  - Quản lý tất cả từ vựng, danh mục
  - Tạo bộ từ vựng công khai cho users
  - Truy cập Admin Dashboard
- **User**: 
  - Xem và học từ bộ từ vựng của Admin
  - Quản lý từ vựng cá nhân
  - Truy cập User Dashboard

## Cài đặt

1. Clone repository này
2. Cài đặt dependencies:
   ```bash
   npm install
   ```

3. Tạo file `.env` từ `.env.example` và điền thông tin MongoDB Atlas của bạn:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learn-taiwanese
   ```

4. Chạy ứng dụng local:
   ```bash
   npm run dev
   ```

## Deploy lên Vercel

1. Cài đặt Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Thêm environment variables trong Vercel Dashboard:
   - `MONGODB_URI`: Connection string từ MongoDB Atlas

## Cấu trúc thư mục

```
├── api/                 # Backend API
│   ├── index.js        # Entry point
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   └── config/         # Database config
├── public/             # Frontend files
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── vercel.json         # Vercel configuration
└── package.json
```

## API Endpoints

- `GET /api/words` - Lấy danh sách từ vựng
- `POST /api/words` - Thêm từ mới
- `GET /api/words/:id` - Lấy chi tiết từ
- `PUT /api/words/:id` - Cập nhật từ
- `DELETE /api/words/:id` - Xóa từ
- `GET /api/progress` - Lấy tiến độ học tập
- `POST /api/progress` - Cập nhật tiến độ

## Công nghệ sử dụng

- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: Vercel
