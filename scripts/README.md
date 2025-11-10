# 🚀 Scripts Directory

Thư mục chứa các script tiện ích cho dự án.

## 📋 Danh sách Scripts

### 1. `start-ngrok.js` ⭐ (Recommended)
**Cross-platform script tự động detect port và start ngrok**

```bash
# Tự động detect port Next.js
npm run tunnel

# Hoặc chỉ định port cụ thể
npm run tunnel 3002
```

**Đặc điểm:**
- ✅ Cross-platform (Windows, Mac, Linux)
- ✅ Tự động detect port Next.js (3000-3005)
- ✅ Kiểm tra ngrok đã cài đặt
- ✅ Tự động dừng ngrok process cũ
- ✅ Dễ sử dụng nhất

---

### 2. `start-ngrok.sh`
**Bash script cho Linux/Mac/Git Bash**

```bash
# Tự động detect port
./scripts/start-ngrok.sh

# Hoặc chỉ định port
./scripts/start-ngrok.sh 3002
```

**Đặc điểm:**
- ✅ Tự động detect port
- ✅ Màu sắc output đẹp
- ✅ Error handling tốt

---

### 3. `start-ngrok.bat`
**Batch script cho Windows**

```cmd
REM Tự động detect port
scripts\start-ngrok.bat

REM Hoặc chỉ định port
scripts\start-ngrok.bat 3002
```

**Đặc điểm:**
- ✅ Tự động detect port
- ✅ Tương thích Windows
- ✅ Dễ sử dụng

---

### 4. `start-demo-auto.sh` / `start-demo-auto.bat`
**Script tự động start cả Next.js và ngrok**

```bash
# Bash
./scripts/start-demo-auto.sh

# Windows
scripts\start-demo-auto.bat
```

**Đặc điểm:**
- ✅ Tự động start Next.js
- ✅ Tự động start ngrok sau khi Next.js sẵn sàng
- ✅ Auto-detect port

---

## 🎯 Cách sử dụng

### Cách 1: Sử dụng npm script (Khuyến nghị)
```bash
# Tự động detect port
npm run tunnel

# Chỉ định port
npm run tunnel 3002
```

### Cách 2: Chạy trực tiếp script
```bash
# Node.js (cross-platform)
node scripts/start-ngrok.js [port]

# Bash (Linux/Mac/Git Bash)
./scripts/start-ngrok.sh [port]

# Batch (Windows)
scripts\start-ngrok.bat [port]
```

### Cách 3: Start cả Next.js và ngrok
```bash
# Bash
./scripts/start-demo-auto.sh

# Windows
scripts\start-demo-auto.bat
```

---

## 🔧 Yêu cầu

1. **Ngrok đã cài đặt:**
   ```bash
   npm install -g ngrok
   ```

2. **Ngrok đã setup authtoken:**
   ```bash
   ngrok config add-authtoken YOUR_TOKEN
   ```

3. **Next.js đang chạy** (nếu dùng script riêng ngrok)

---

## 📝 Lưu ý

- Scripts sẽ tự động tìm port từ 3000-3005
- Nếu Next.js chạy ở port khác, hãy chỉ định port khi chạy script
- Scripts sẽ tự động dừng ngrok process cũ nếu đang chạy
- URL ngrok sẽ hiển thị trong terminal output

---

## 🐛 Troubleshooting

### Lỗi: "ngrok not found"
```bash
npm install -g ngrok
```

### Lỗi: "Next.js server not found"
Đảm bảo Next.js đang chạy:
```bash
npm run dev
```

### Lỗi: "Port X is not in use"
Kiểm tra port Next.js đang chạy và chỉ định đúng port:
```bash
npm run tunnel 3002
```

### Script không chạy được (Linux/Mac)
```bash
chmod +x scripts/*.sh
```

---

## ✅ Quick Start

1. Start Next.js:
   ```bash
   npm run dev
   ```

2. Start ngrok (terminal mới):
   ```bash
   npm run tunnel
   ```

3. Copy URL từ ngrok output và share!

---

🎉 **Done!** Giờ bạn có thể share demo với team rồi!

