# 🚀 HƯỚNG DẪN SETUP NGROK

## Mục đích
Tạo public URL để mọi người có thể xem demo từ xa (qua internet).

---

## 📋 BƯỚC 1: Cài đặt Ngrok

### Cách 1: Download từ website (Recommended)
1. Vào https://ngrok.com/download
2. Download bản cho Windows
3. Giải nén file `ngrok.exe`
4. Copy `ngrok.exe` vào thư mục dự án hoặc thêm vào PATH

### Cách 2: Sử dụng npm (Nếu đã có Node.js)
```bash
npm install -g ngrok
```

### Cách 3: Sử dụng Chocolatey (Nếu đã cài)
```bash
choco install ngrok
```

---

## 📋 BƯỚC 2: Đăng ký tài khoản Ngrok (Miễn phí)

1. Vào https://dashboard.ngrok.com/signup
2. Đăng ký tài khoản miễn phí
3. Copy **Authtoken** từ dashboard (sẽ cần ở bước sau)

---

## 📋 BƯỚC 3: Setup Authtoken

Mở terminal và chạy:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

Thay `YOUR_AUTH_TOKEN` bằng token bạn đã copy từ dashboard.

---

## 📋 BƯỚC 4: Khởi động Next.js

Đảm bảo server Next.js đang chạy:
```bash
npm run dev
```

Lưu ý: Server thường chạy ở port **3000** (hoặc port khác nếu 3000 bận).

---

## 📋 BƯỚC 5: Chạy Ngrok

Mở terminal **mới** (giữ terminal chạy Next.js) và chạy:

### Nếu Next.js chạy ở port 3000:
```bash
ngrok http 3000
```

### Nếu Next.js chạy ở port khác (ví dụ 3002):
```bash
ngrok http 3002
```

---

## 📋 BƯỚC 6: Lấy Public URL

Sau khi chạy lệnh trên, bạn sẽ thấy:

```
Session Status                online
Account                       Your Account (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       50ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000
```

**URL public của bạn là:** `https://abc123.ngrok-free.app`

Copy URL này và share cho mọi người!

---

## 🎯 TIPS & TRICKS

### 1. **Giữ URL cố định (Static Domain) - Yêu cầu tài khoản có phí**
Nếu muốn URL không thay đổi mỗi lần restart:
```bash
ngrok http 3000 --domain=your-static-domain.ngrok-free.app
```

### 2. **Xem traffic qua Ngrok Web Interface**
Mở trình duyệt và vào: `http://localhost:4040`
- Xem các request/response
- Replay requests
- Inspect traffic

### 3. **Chạy ở background (Windows)**
Tạo file `start-ngrok.bat`:
```batch
@echo off
start "Ngrok" cmd /k ngrok http 3000
```

### 4. **Tự động start khi Next.js start**
Tạo file `package.json` script:
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:tunnel": "concurrently \"npm run dev\" \"ngrok http 3000\""
  }
}
```

Cần cài `concurrently`:
```bash
npm install -D concurrently
```

---

## ⚠️ LƯU Ý

1. **Free plan có giới hạn:**
   - URL thay đổi mỗi lần restart
   - Giới hạn số lượng connections
   - Có thể bị rate limit

2. **Bảo mật:**
   - Ngrok URL là public, ai có link đều truy cập được
   - Không dùng cho production với data thật
   - Có thể thêm basic auth nếu cần

3. **Performance:**
   - Có thể chậm hơn localhost một chút
   - Phụ thuộc vào kết nối internet

---

## 🔧 TROUBLESHOOTING

### Lỗi: "ngrok: command not found"
- Đảm bảo đã cài đặt ngrok
- Thêm ngrok vào PATH hoặc chạy bằng đường dẫn đầy đủ

### Lỗi: "authtoken is required"
- Chạy lại: `ngrok config add-authtoken YOUR_TOKEN`

### URL không hoạt động
- Kiểm tra Next.js server đang chạy
- Kiểm tra port đúng (3000 hoặc port khác)
- Xem log trong terminal ngrok

### Cần restart ngrok
- Nhấn `Ctrl+C` để dừng
- Chạy lại `ngrok http 3000`

---

## 📝 QUICK START SCRIPT

Tạo file `start-demo.bat` (Windows):

```batch
@echo off
echo Starting Next.js server...
start "Next.js" cmd /k npm run dev

timeout /t 5

echo Starting Ngrok tunnel...
start "Ngrok" cmd /k ngrok http 3000

echo.
echo ✅ Next.js: http://localhost:3000
echo ✅ Ngrok dashboard: http://localhost:4040
echo.
echo Copy URL từ ngrok terminal và share cho mọi người!
pause
```

Chạy file này để tự động start cả Next.js và Ngrok.

---

## 🎉 DONE!

Giờ bạn đã có public URL để share demo cho sếp và team rồi! 🚀

