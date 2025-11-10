# ⚡ QUICK START - Setup Ngrok

## 🎯 Cách nhanh nhất để share demo

### Bước 1: Cài đặt Ngrok
```bash
npm install -g ngrok
```

### Bước 2: Setup Authtoken
1. Đăng ký tài khoản tại: https://dashboard.ngrok.com/signup
2. Copy authtoken từ dashboard
3. Chạy:
```bash
ngrok config add-authtoken YOUR_TOKEN
```

### Bước 3: Start Next.js
```bash
npm run dev
```

### Bước 4: Start Ngrok (Terminal mới)
```bash
# Tự động detect port Next.js
npm run tunnel

# Hoặc chỉ định port cụ thể
npm run tunnel 3000
```

### Bước 5: Copy URL và share!
Ngrok sẽ hiển thị URL dạng: `https://abc123.ngrok-free.app`

---

## 🚀 Các cách khác

### Cách 1: Tự động start cả Next.js + Ngrok
```bash
# Windows
scripts\start-demo-auto.bat

# Linux/Mac/Git Bash
./scripts/start-demo-auto.sh
```

### Cách 2: Manual với script
```bash
# Node.js (khuyến nghị - cross-platform)
node scripts/start-ngrok.js

# Bash (Linux/Mac/Git Bash)
./scripts/start-ngrok.sh

# Batch (Windows)
scripts\start-ngrok.bat
```

---

## 📋 Scripts có sẵn

| Script | Mô tả | Platform |
|--------|-------|----------|
| `npm run tunnel` | Tự động detect port và start ngrok | All |
| `node scripts/start-ngrok.js` | Cross-platform script | All |
| `./scripts/start-ngrok.sh` | Bash script | Linux/Mac/Git Bash |
| `scripts\start-ngrok.bat` | Batch script | Windows |
| `scripts\start-demo-auto.bat` | Start cả Next.js + ngrok | Windows |

---

## ⚠️ Lưu ý

1. **URL ngrok là public** - ai có link đều truy cập được
2. **Free plan** - URL thay đổi mỗi lần restart
3. **Xem traffic** - Mở http://localhost:4040 để xem dashboard

---

## 🎉 Done!

Giờ bạn có thể share demo với sếp và team rồi! 🚀

