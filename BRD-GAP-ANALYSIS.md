# 📊 BRD GAP ANALYSIS - So sánh Implementation vs BRD

## 🔴 PHẦN QUAN TRỌNG THIẾU

### 1. **Factory (Nhà máy)** - CRITICAL ❌
**BRD Requirement:**
- Factory là node trong topology map (Cấp 4)
- Factory nằm trong Cluster, thuộc IZ và Region
- Factory có: tên, lô vị trí, danh sách hàng hoá, video xác minh
- Factory cần đăng ký và được verify (UC01 cho Factory)
- Factory có thể có ESG/DX tags

**Current Status:**
- ❌ Không có Factory schema
- ❌ Không có Factory UI
- ❌ Không có Factory registration
- ❌ Map chỉ hiển thị IZ level, chưa có Factory level

**Action Required:**
- ✅ Add Factory schema
- ⚠️ Add Factory registration form
- ⚠️ Update Map để hỗ trợ Factory nodes
- ⚠️ Add Factory detail page
- ⚠️ Update Admin để quản lý Factory

---

### 2. **Cluster (Cụm công nghiệp)** - CRITICAL ❌
**BRD Requirement:**
- Cluster là cấp 3 trong topology (Region → IZ → Cluster → Factory)
- Cluster chứa nhiều Factory
- Cluster thuộc IZ

**Current Status:**
- ❌ Không có Cluster schema
- ❌ Không có Cluster UI

**Action Required:**
- ✅ Add Cluster schema
- ⚠️ Add Cluster trong IZ detail
- ⚠️ Update Map để hỗ trợ Cluster level

---

### 3. **Topology Map Multi-Level (4 cấp)** - CRITICAL ❌
**BRD Requirement:**
- Cấp 1: Toàn quốc (Region level) - mật độ công nghiệp, vùng trọng điểm
- Cấp 2: Theo khu vực (IZ level) - các KCN trong vùng
- Cấp 3: Theo KCN (Cluster level) - các cụm và nhà máy
- Cấp 4: Cụm/Nhà máy (Factory level) - từng nhà máy cụ thể

**Current Status:**
- ⚠️ Map chỉ có 1 cấp (IZ level)
- ❌ Không có zoom levels
- ❌ Không có Region view
- ❌ Không có Cluster view
- ❌ Không có Factory view

**Action Required:**
- ⚠️ Implement zoom levels trong Map
- ⚠️ Add Region grouping
- ⚠️ Add Cluster visualization
- ⚠️ Add Factory nodes

---

### 4. **Region (Vùng miền)** - IMPORTANT ⚠️
**BRD Requirement:**
- Miền Bắc, Miền Trung, Miền Nam
- Hiển thị tổng số KCN, cụm, nhà máy
- Chỉ số ESG trung bình vùng
- Tổng vốn đầu tư, năng lực sản xuất theo ngành

**Current Status:**
- ❌ Không có Region schema
- ❌ Chỉ filter theo province, không có region grouping

**Action Required:**
- ✅ Add Region schema
- ⚠️ Add Region grouping trong Map
- ⚠️ Add Region stats

---

### 5. **Product thuộc Factory** - IMPORTANT ⚠️
**BRD Requirement:**
- "Danh sách hàng hoá" của Factory
- Factory có thể liệt kê sản phẩm
- IZ có thể liệt kê "danh mục hàng hoá/dịch vụ đang cần mua"

**Current Status:**
- ⚠️ Product chỉ có `supplierId` và `izId` (optional)
- ❌ Không có `factoryId`

**Action Required:**
- ✅ Add `factoryId` to Product schema
- ⚠️ Update Product listing để hiển thị Factory products
- ⚠️ Add IZ product needs (IZ có thể đăng "cần mua")

---

### 6. **Connection Request UI** - IMPORTANT ⚠️
**BRD Requirement:**
- "Gửi yêu cầu kết nối hoặc tin nhắn liên hệ trực tiếp"
- Buyer/Supplier/Investor có thể kết nối với IZ/Factory
- "Liên kết đến các buyer/supplier có tương tác"

**Current Status:**
- ✅ Có ConnectionRequest schema
- ❌ Không có UI để gửi/accept connection
- ❌ Không hiển thị connections trong detail pages

**Action Required:**
- ⚠️ Add "Kết nối" button trong IZ/Factory detail
- ⚠️ Add Connection request modal
- ⚠️ Add Connection list trong detail pages

---

### 7. **Form đăng ký KCN mới** - IMPORTANT ⚠️
**BRD Requirement:**
- UC01: IZ đăng ký và khai báo thông tin
- Upload video xác minh
- Gửi yêu cầu xác minh

**Current Status:**
- ⚠️ Có edit form trong IZ detail page
- ❌ Không có form đăng ký KCN mới riêng biệt

**Action Required:**
- ⚠️ Add IZ registration page/form
- ⚠️ Add video/document upload UI (mock)

---

### 8. **User Role: Factory** - IMPORTANT ⚠️
**BRD Requirement:**
- Factory cần đăng ký và quản lý thông tin riêng
- Factory có thể upload video, khai báo sản phẩm

**Current Status:**
- ❌ Không có 'factory' role trong UserRole

**Action Required:**
- ✅ Add 'factory' to UserRole
- ⚠️ Update authentication để hỗ trợ factory role
- ⚠️ Add factory-specific pages

---

## ✅ PHẦN ĐÃ HOÀN THÀNH

### 1. **Services Hub** ✅
- ✅ Services listing
- ✅ Service registration
- ✅ Service filtering

### 2. **Product Upload Form** ✅
- ✅ Form trong Marketplace
- ✅ Product registration

### 3. **Basic IZ Management** ✅
- ✅ IZ listing
- ✅ IZ detail page
- ✅ IZ edit

### 4. **Investment Portal** ✅
- ✅ Form đầu tư
- ✅ Chatbot simulation
- ✅ Recommendations

### 5. **Marketplace** ✅
- ✅ Product listing
- ✅ RFQ system

### 6. **Admin Dashboard** ✅
- ✅ IZ verification
- ✅ Basic stats

---

## 📋 PRIORITY LIST

### High Priority (Cho MVP Demo):
1. ✅ Factory & Cluster schema - **DONE**
2. ⚠️ Factory registration form
3. ⚠️ Update Map để hiển thị Factory (ít nhất basic)
4. ⚠️ Connection Request UI
5. ⚠️ IZ registration form

### Medium Priority:
6. ⚠️ Multi-level topology map (4 cấp zoom)
7. ⚠️ Region grouping
8. ⚠️ Product có factoryId
9. ⚠️ Admin quản lý Factory

### Low Priority (Post-MVP):
10. ⚠️ Full topology map với zoom levels
11. ⚠️ Factory connections visualization
12. ⚠️ Region stats dashboard

---

## 🎯 NEXT STEPS

1. **Immediate:** Implement Factory registration và basic Factory UI
2. **Short-term:** Update Map để hiển thị Factory nodes
3. **Medium-term:** Implement multi-level topology
4. **Long-term:** Full topology map với zoom/pan/cluster

---

**Last Updated:** 2024-11-06
**Status:** Gap analysis complete, starting implementation

