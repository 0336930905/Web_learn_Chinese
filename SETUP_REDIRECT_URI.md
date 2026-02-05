# ✅ HƯỚNG DẪN THÊM REDIRECT URI - GIẢI QUYẾT LỖI OAUTH

## ❌ Lỗi hiện tại:
```
Bạn không thể đăng nhập vào ứng dụng này vì ứng dụng không tuân thủ chính sách OAuth 2.0 của Google.
Request details: redirect_uri=http://localhost:3000/api/auth/google/callback
```

---

## 🎯 GIẢI PHÁP - Làm theo từng bước:

### **BƯỚC 1: Mở Google Cloud Console**

1. Truy cập: https://console.cloud.google.com/apis/credentials
2. Đăng nhập với tài khoản Google
3. Chọn Project của bạn (nếu có nhiều project)

---

### **BƯỚC 2: Tìm và mở OAuth Client**

1. Trong trang **Credentials**, tìm phần **OAuth 2.0 Client IDs**
2. Click vào tên client: **Web_learn_Chinese** (hoặc tên bạn đã đặt)
3. Sẽ mở trang **Edit OAuth client**

---

### **BƯỚC 3: Thêm Authorized JavaScript Origins**

Scroll xuống phần **Authorized JavaScript origins**

#### ✅ Thêm URL sau (KHÔNG có dấu `/` cuối):
```
http://localhost:3000
```

**Click nút "+ ADD URI"** nếu cần thêm URI mới

---

### **BƯỚC 4: Thêm Authorized Redirect URIs** ⭐ QUAN TRỌNG

Scroll tiếp xuống phần **Authorized redirect URIs**

#### ✅ Thêm chính xác URL sau:
```
http://localhost:3000/api/auth/google/callback
```

**LƯU Ý:**
- ✅ Phải có `/api/auth/google/callback` ở cuối
- ✅ Không có dấu `/` cuối cùng
- ✅ Phải khớp 100% với redirect_uri trong error message

---

### **BƯỚC 5: Cấu hình đầy đủ**

Sau khi hoàn thành, cấu hình của bạn sẽ như sau:

#### 📋 **Authorized JavaScript origins:**
```
http://localhost:3000
```

#### 📋 **Authorized redirect URIs:**
```
http://localhost:3000/api/auth/google/callback
```

**Screenshot tham khảo:**
```
┌─────────────────────────────────────────────┐
│ Authorized JavaScript origins               │
├─────────────────────────────────────────────┤
│ URIs 1                                      │
│ http://localhost:3000                       │
│                                             │
│ + ADD URI                                   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Authorized redirect URIs                    │
├─────────────────────────────────────────────┤
│ URIs 1                                      │
│ http://localhost:3000/api/auth/google/cal...│
│                                             │
│ + ADD URI                                   │
└─────────────────────────────────────────────┘
```

---

### **BƯỚC 6: Lưu cấu hình**

1. Scroll xuống cuối trang
2. Click nút **SAVE** (màu xanh)
3. Đợi thông báo "OAuth client updated" xuất hiện

---

### **BƯỚC 7: Đợi Google cập nhật**

⏰ **Quan trọng:** Đợi **2-5 phút** để Google cập nhật cấu hình vào hệ thống

Trong lúc đợi:
- Clear browser cache: **Ctrl + Shift + Delete**
- Đóng tất cả tab liên quan
- Hoặc dùng **Incognito Mode** (Ctrl + Shift + N)

---

### **BƯỚC 8: Test lại**

1. Mở trình duyệt Incognito (Ctrl + Shift + N)
2. Truy cập: `http://localhost:3000/login.html`
3. Click **"Đăng nhập với Google"**
4. Chọn tài khoản Google
5. ✅ Phải redirect về `http://localhost:3000/login.html?token=...`

---

## 🔍 KIỂM TRA NHANH

### ✅ Checklist trước khi test:

- [ ] Authorized JavaScript origins có: `http://localhost:3000` (không `/`)
- [ ] Authorized redirect URIs có: `http://localhost:3000/api/auth/google/callback`
- [ ] Đã click SAVE trong Google Console
- [ ] Đã đợi ít nhất 2 phút
- [ ] Đã clear browser cache hoặc dùng Incognito
- [ ] Server đang chạy: `http://localhost:3000`
- [ ] File `.env` có GOOGLE_CLIENT_SECRET mới

---

## 🎯 Nếu vẫn lỗi

### 1️⃣ Kiểm tra lại URIs trong Google Console

Vào lại: https://console.cloud.google.com/apis/credentials

Click vào OAuth client và kiểm tra:
- ✅ `http://localhost:3000` (origins)
- ✅ `http://localhost:3000/api/auth/google/callback` (redirect)

### 2️⃣ Xóa và tạo lại OAuth Client

Nếu vẫn không được:
1. Delete OAuth client cũ
2. Tạo mới OAuth client
3. Copy Client ID và Client Secret mới
4. Update vào file `.env`
5. Restart server

### 3️⃣ Kiểm tra Server Log

Terminal phải hiển thị:
```
http://localhost:3000
MongoDB Connected: ...
```

### 4️⃣ Kiểm tra Browser Console

Mở DevTools (F12) → Console tab:
```javascript
🔵 Đang khởi tạo Google OAuth...
🔵 Google Auth URL: http://localhost:3000/api/auth/google
```

---

## 📝 Thông tin cấu hình

**Client ID:**
```
YOUR_GOOGLE_CLIENT_ID_HERE
```

**Client Secret:**
```
YOUR_GOOGLE_CLIENT_SECRET_HERE
```

**Redirect URI:**
```
http://localhost:3000/api/auth/google/callback
```

**JavaScript Origin:**
```
http://localhost:3000
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### 1. Phân biệt Origins vs Redirect URIs:

**Origins** (nơi request xuất phát):
- `http://localhost:3000` ← Không có path
- Không có dấu `/` cuối

**Redirect URIs** (nơi Google callback về):
- `http://localhost:3000/api/auth/google/callback` ← Có path đầy đủ
- Phải khớp 100% với callbackURL trong passport.js

### 2. Development vs Production:

**Development (hiện tại):**
```
Origins: http://localhost:3000
Redirect: http://localhost:3000/api/auth/google/callback
```

**Production (khi deploy):**
```
Origins: https://yourdomain.com
Redirect: https://yourdomain.com/api/auth/google/callback
```

### 3. Múi giờ Google:

- Thay đổi cấu hình có thể mất 2-5 phút để propagate
- Nếu gấp, dùng Incognito mode để test

---

## 🚀 SAU KHI THÀNH CÔNG

Khi Google OAuth hoạt động:
1. Click "Đăng nhập với Google"
2. Chọn tài khoản
3. Cho phép truy cập
4. Redirect về `/login.html?token=...`
5. Auto redirect về `/index.html`
6. Đã đăng nhập thành công! 🎉

---

## 📞 Debug Commands

### Kiểm tra server đang chạy:
```bash
curl http://localhost:3000/api
```

### Kiểm tra OAuth endpoint:
```bash
curl -I http://localhost:3000/api/auth/google
```

### Restart server:
```bash
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
node api/index.js
```

---

**Created:** February 2, 2026  
**Status:** ⭐ Ready to configure  
**Next Step:** Thêm redirect URI vào Google Console
