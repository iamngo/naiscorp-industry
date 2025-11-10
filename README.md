# Vietnam Industrial Supply Chain

Nền tảng số toàn diện cho hệ sinh thái khu công nghiệp Việt Nam - Kết nối Khu công nghiệp, Supplier, Buyer và Investor.

## 📋 Tổng quan dự án

**Tên dự án**: Vietnam Industrial Supply Chain  
**Version**: 1.0  
**MVP Demo**: 24/11/2024

### Mục tiêu tổng thể

Xây dựng nền tảng số toàn diện cho hệ sinh thái khu công nghiệp Việt Nam, kết nối 4 nhóm đối tượng chính:
- **Khu công nghiệp (IZ)**
- **Supplier (nhà cung ứng)**
- **Buyer (người mua B2B)**
- **Investor (nhà đầu tư)**

## 🎯 Các Module chính

### 1. Industrial Map (Topology Map)
- Bản đồ topology thể hiện toàn bộ KCN Việt Nam
- Hệ thống xác minh (Verified, ESG, Digital Transformation)
- Tìm kiếm và lọc theo vùng, ngành, tag
- **Use Cases**: UC01, UC02, UC03, UC04, UC08

### 2. Investment Planning Portal
- Form nhập thông tin đầu tư (vốn, ngành, địa điểm)
- Chatbot AI tư vấn tự động
- Đề xuất kế hoạch đầu tư và danh sách KCN phù hợp
- **Use Cases**: UC04, UC06

### 3. B2B e-Marketplace
- Sàn giao dịch công nghiệp B2B
- Đăng sản phẩm và RFQ (Yêu cầu báo giá)
- Thanh toán và phí nền tảng
- **Use Cases**: UC04, UC05

### 4. Industrial Services Hub
- Tuyển dụng & đào tạo
- CRM / CDP
- Logistic, năng lượng, tiêu hao
- Quản lý sự kiện
- **Use Cases**: UC07, UC08

### 5. Admin Dashboard
- Quản trị và duyệt KCN, Supplier, Buyer, Investor
- Thống kê và báo cáo
- Gắn tag Verified, ESG, DX
- **Use Cases**: UC02, UC08

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Map**: Leaflet + React-Leaflet
- **Icons**: Lucide React

### Backend
- **API**: Next.js API Routes
- **Authentication**: Mock (JWT ready)
- **Database**: Mock data (ready for PostgreSQL/MongoDB)

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Chạy production
npm start
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

## 🔐 Tài khoản Demo

### Admin
- Email: `admin@naiscorp.vn`
- Password: `admin123`

### IZ (Khu công nghiệp)
- Email: `dongnama@iz.vn`
- Password: `iz123`

### Supplier
- Email: `vatai@supplier.vn`
- Password: `supplier123`

## 📁 Cấu trúc Project

```
naiscorp-industry/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/              # Authentication
│   │   └── industrial-zones/  # IZ CRUD
│   ├── admin/                 # Admin Dashboard
│   ├── iz/[id]/              # IZ Detail Page
│   ├── map/                   # Topology Map
│   ├── marketplace/           # B2B Marketplace
│   ├── investor/              # Investment Portal
│   ├── login/                 # Login Page
│   ├── layout.tsx             # Root Layout
│   ├── page.tsx               # Landing Page
│   └── globals.css
├── components/
│   ├── Navigation.tsx         # Main Navigation
│   ├── IZCard.tsx             # IZ Card Component
│   └── MapComponent.tsx       # Leaflet Map Component
├── lib/
│   ├── auth.ts                # Authentication utilities
│   └── mockData.ts            # Mock data
├── types/
│   └── database.ts            # TypeScript types & schema
└── README.md
```

## 📊 Database Schema

Xem file `types/database.ts` để xem chi tiết schema:
- `User` - Người dùng (Admin, IZ, Supplier, Buyer, Investor)
- `IndustrialZone` - Khu công nghiệp
- `Supplier` - Nhà cung cấp
- `Buyer` - Người mua B2B
- `Investor` - Nhà đầu tư
- `Product` - Sản phẩm
- `RFQ` - Yêu cầu báo giá
- `Service` - Dịch vụ công nghiệp
- `InvestmentPlan` - Kế hoạch đầu tư
- `ConnectionRequest` - Yêu cầu kết nối
- `Event` - Sự kiện
- `AdminLog` - Log hoạt động admin

## 🎯 Use Cases đã implement

### Module 1: Industrial Map
- ✅ **UC01**: Đăng ký & khai báo thông tin KCN
- ✅ **UC02**: Xác minh & gắn tag (Verified / ESG / DX)
- ✅ **UC03**: Hiển thị bản đồ topology
- ✅ **UC04**: Tìm kiếm & Kết nối
- ✅ **UC08**: Quản trị & thống kê nội dung

### Module 2: Investment Planning Portal
- ✅ **UC06**: Nhập kế hoạch đầu tư & Chatbot tư vấn
- ✅ **UC04**: Tìm kiếm & Kết nối (Investor)

### Module 3: B2B e-Marketplace
- ✅ **UC05**: Đăng sản phẩm & RFQ
- ✅ **UC04**: Tìm kiếm & Kết nối (Buyer/Supplier)

### Module 4: Industrial Services Hub
- ✅ **UC07**: Đăng ký dịch vụ công nghiệp
- ✅ **UC08**: Quản trị & Duyệt nội dung dịch vụ

## 🚀 Features đã hoàn thành

### Authentication & Authorization
- ✅ Login/Logout system
- ✅ Role-based access (Admin, IZ, Supplier, Buyer, Investor)
- ✅ Protected routes

### Industrial Map
- ✅ Topology map với Leaflet
- ✅ Filter theo tỉnh/thành, trạng thái, ESG
- ✅ Search KCN
- ✅ IZ detail page với CRUD
- ✅ Verification system (Pending, Verified, Rejected)

### Investment Portal
- ✅ Form nhập thông tin đầu tư
- ✅ AI Chatbot simulation
- ✅ Đề xuất KCN phù hợp
- ✅ Download PDF plan (mock)

### B2B Marketplace
- ✅ Product listing
- ✅ Search & filter
- ✅ RFQ system (Yêu cầu báo giá)
- ✅ Product verification

### Admin Dashboard
- ✅ Thống kê tổng quan
- ✅ Duyệt/từ chối KCN
- ✅ Filter và quản lý
- ✅ Xem chi tiết KCN

## 📝 Lưu ý

1. **Mock Data**: Tất cả data hiện tại là mock, sẽ mất khi refresh
2. **Authentication**: Mock authentication, chưa dùng JWT thật
3. **Database**: Chưa có database thật, cần tích hợp PostgreSQL/MongoDB
4. **File Upload**: Chưa implement upload video/file thật
5. **Payment**: Chưa tích hợp payment gateway
6. **AI Chatbot**: Simulation, chưa dùng AI thật

## 🎯 MVP Demo Checklist

- ✅ Bản đồ topology với 5-10 KCN mẫu
- ✅ Hệ thống tag và xác minh hoạt động
- ✅ Chatbot có thể xử lý form đầu tư cơ bản
- ✅ Có luồng RFQ mô phỏng
- ✅ Admin dashboard quản trị
- ✅ Authentication & Authorization
- ✅ Responsive design

## 📅 Timeline

- **MVP Demo**: 24/11/2024
- **Production**: TBD

## 📄 License

Private project - Naiscorp Industry

## 👥 Contributors

- Development Team

---

**Version**: 1.0  
**Last Updated**: 2024-11-24
