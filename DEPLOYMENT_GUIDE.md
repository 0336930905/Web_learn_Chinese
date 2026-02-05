# Hướng Dẫn Deploy Lên GitHub và Vercel

## ✅ Đã hoàn thành
- [x] Khởi tạo Git repository
- [x] Commit code lần đầu

## 🔄 Bước tiếp theo

### 1. Đẩy Code Lên GitHub

#### Bước 1.1: Tạo repository trên GitHub
1. Truy cập https://github.com/new
2. Đặt tên repository (ví dụ: `learn-chinese-web`)
3. Chọn **Public** hoặc **Private**
4. **KHÔNG** chọn "Initialize this repository with a README"
5. Click "Create repository"

#### Bước 1.2: Kết nối và push code
Sau khi tạo repository, chạy các lệnh sau trong terminal:

```bash
# Thay <your-username> và <your-repo-name> bằng thông tin thực tế
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```

**Ví dụ:**
```bash
git remote add origin https://github.com/johndoe/learn-chinese-web.git
git branch -M main
git push -u origin main
```

### 2. Deploy Lên Vercel

#### Bước 2.1: Chuẩn bị MongoDB Atlas
1. Truy cập https://www.mongodb.com/cloud/atlas
2. Đăng ký/Đăng nhập
3. Tạo một cluster miễn phí (nếu chưa có)
4. Lấy **Connection String** (dạng: `mongodb+srv://username:password@cluster.mongodb.net/`)
5. Lưu lại để dùng cho bước tiếp theo

#### Bước 2.2: Deploy trên Vercel
1. Truy cập https://vercel.com
2. Đăng nhập bằng GitHub account
3. Click "Add New" → "Project"
4. Chọn repository vừa tạo từ danh sách
5. Click "Import"

#### Bước 2.3: Cấu hình Environment Variables
Trong phần **Environment Variables**, thêm các biến sau:

| Name | Value | Mô tả |
|------|-------|-------|
| `MONGODB_URI` | `mongodb+srv://...` | Connection string từ MongoDB Atlas |
| `NODE_ENV` | `production` | Môi trường production |
| `SESSION_SECRET` | `your-secret-key-here` | Key bảo mật cho session (tạo chuỗi ngẫu nhiên) |
| `JWT_SECRET` | `your-jwt-secret-here` | Key bảo mật cho JWT (tạo chuỗi ngẫu nhiên) |
| `GOOGLE_CLIENT_ID` | `your-client-id` | (Nếu dùng Google OAuth) |
| `GOOGLE_CLIENT_SECRET` | `your-client-secret` | (Nếu dùng Google OAuth) |

**Lưu ý:** 
- Có thể tạo secret key ngẫu nhiên bằng lệnh: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Thay thế các giá trị mẫu bằng giá trị thực tế của bạn

#### Bước 2.4: Deploy
1. Click "Deploy"
2. Chờ Vercel build và deploy (khoảng 2-3 phút)
3. Khi hoàn tất, bạn sẽ nhận được URL dạng: `https://your-app.vercel.app`

### 3. Cấu hình Google OAuth (Nếu sử dụng)

Sau khi có URL từ Vercel:
1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Chọn project của bạn
3. Vào "APIs & Services" → "Credentials"
4. Chỉnh sửa OAuth 2.0 Client ID
5. Thêm vào **Authorized redirect URIs**:
   - `https://your-app.vercel.app/api/auth/google/callback`
6. Lưu thay đổi

### 4. Kiểm Tra Deployment

Truy cập URL của bạn và kiểm tra:
- [ ] Trang chủ hiển thị đúng
- [ ] Có thể đăng ký/đăng nhập
- [ ] Kết nối database hoạt động
- [ ] Tất cả tính năng chạy bình thường

### 5. Cập Nhật Code Sau Này

Khi có thay đổi code:
```bash
git add .
git commit -m "Mô tả thay đổi"
git push
```

Vercel sẽ tự động deploy lại khi phát hiện thay đổi trên GitHub!

## 🔗 Links Hữu Ích

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [GitHub Guides](https://guides.github.com/)

## ⚠️ Lưu Ý Quan Trọng

1. **KHÔNG** commit file `.env` lên GitHub (đã có trong .gitignore)
2. **BẮT BUỘC** phải cấu hình environment variables trên Vercel
3. MongoDB Atlas cần whitelist IP `0.0.0.0/0` để Vercel có thể kết nối
4. Nếu gặp lỗi, kiểm tra logs tại: https://vercel.com/dashboard → chọn project → "Deployments" → click vào deployment → "Logs"

## 📝 Ghi Chú

- Repository GitHub: `https://github.com/<your-username>/<your-repo-name>`
- Vercel URL: `https://your-app.vercel.app`
- MongoDB Connection: `mongodb+srv://...`

---

**Chúc bạn deploy thành công! 🎉**
