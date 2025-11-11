import { IndustrialZone, Factory, Product, Service, Region, Cluster, Consultant, Supplier } from '@/types/database';

// ===== Consultants =====
export const mockConsultants: Consultant[] = [
  {
    id: 'consult-1',
    name: 'Nguyễn Minh Quân',
    title: 'Senior Investment Advisor',
    expertise: ['Điện tử', 'Cơ khí', 'Chuỗi cung ứng'],
    regions: ['Miền Bắc', 'Miền Nam'],
    languages: ['Tiếng Việt', 'English'],
    successRate: 92,
    averageResponseTimeHours: 6,
    email: 'quan.nguyen@naiscorp.vn',
    phone: '0902-123-456',
    avatarUrl: undefined,
    notes: 'Chuyên tư vấn cho các dự án sản xuất điện tử quy mô lớn.',
    currentProjects: ['Dự án mở rộng KCN VSIP Bắc Ninh', 'Liên doanh sản xuất module IoT'],
    availability: [
      { day: 'Thứ 2', slots: ['09:00-10:00', '15:00-16:00'] },
      { day: 'Thứ 4', slots: ['10:00-11:00', '14:00-15:00'] },
      { day: 'Thứ 6', slots: ['09:00-10:00'] },
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'consult-2',
    name: 'Trần Bảo Châu',
    title: 'Industrial Strategy Consultant',
    expertise: ['Logistics', 'Năng lượng', 'Chuyển đổi số'],
    regions: ['Miền Trung', 'Miền Nam'],
    languages: ['Tiếng Việt', 'English', '日本語'],
    successRate: 88,
    averageResponseTimeHours: 8,
    email: 'chau.tran@naiscorp.vn',
    phone: '0903-987-654',
    notes: 'Có kinh nghiệm làm việc với các tập đoàn Nhật Bản và Hàn Quốc.',
    currentProjects: ['Trung tâm logistics SmartPort', 'Triển khai năng lượng xanh tại Đà Nẵng'],
    availability: [
      { day: 'Thứ 3', slots: ['13:30-15:00', '16:00-17:00'] },
      { day: 'Thứ 5', slots: ['09:00-11:00'] },
    ],
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-03-03T00:00:00Z',
  },
  {
    id: 'consult-3',
    name: 'Lê Anh Tuấn',
    title: 'Financial & ESG Advisor',
    expertise: ['ESG', 'Tài chính', 'Chuỗi cung ứng bền vững'],
    regions: ['Miền Bắc', 'Miền Trung'],
    languages: ['Tiếng Việt', 'English'],
    successRate: 95,
    averageResponseTimeHours: 5,
    email: 'tuan.le@naiscorp.vn',
    phone: '0987-654-321',
    notes: 'Phụ trách đánh giá ESG và cấu trúc tài chính cho nhà đầu tư quốc tế.',
    currentProjects: ['Đầu tư ESG cho khu công nghiệp thông minh', 'Tư vấn quỹ đầu tư Singapore'],
    availability: [
      { day: 'Thứ 2', slots: ['14:00-16:00'] },
      { day: 'Thứ 4', slots: ['09:00-11:00'] },
      { day: 'Thứ 6', slots: ['13:00-15:00'] },
    ],
    createdAt: '2024-02-08T00:00:00Z',
    updatedAt: '2024-03-04T00:00:00Z',
  },
];
// ===== Regions (Cấp 1) =====
export const mockRegions: Region[] = [
  {
    id: 'region-1',
    name: 'Miền Bắc',
    description: 'Vùng kinh tế trọng điểm phía Bắc',
    totalIZs: 48,
    totalClusters: 120,
    totalFactories: 520,
    averageESG: 78,
    totalInvestment: 52000000000000,
    industries: ['Điện tử', 'Cơ khí', 'Dệt may', 'Thực phẩm'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'region-2',
    name: 'Miền Trung',
    description: 'Vùng kinh tế trọng điểm miền Trung',
    totalIZs: 32,
    totalClusters: 82,
    totalFactories: 290,
    averageESG: 72,
    totalInvestment: 31000000000000,
    industries: ['Logistics', 'Năng lượng', 'Dệt may'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'region-3',
    name: 'Miền Nam',
    description: 'Vùng kinh tế trọng điểm phía Nam',
    totalIZs: 84,
    totalClusters: 210,
    totalFactories: 860,
    averageESG: 82,
    totalInvestment: 82000000000000,
    industries: ['Điện tử', 'Hóa chất', 'Logistics', 'Thực phẩm'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
];

// ===== Industrial Zones (Cấp 2) =====
export const mockIndustrialZones: IndustrialZone[] = [
  {
    id: 'iz-1',
    userId: 'user-2',
    regionId: 'region-3',
    name: 'Khu Công Nghiệp Đông Nam Á',
    address: 'Đường D1, TP. Thuận An, Bình Dương',
    province: 'Bình Dương',
    district: 'Thuận An',
    latitude: 10.9035,
    longitude: 106.7692,
    area: 850,
    establishedYear: 2015,
    owner: 'Tổng Công ty Becamex IDC',
    industries: ['Điện tử', 'Cơ khí', 'Logistics'],
    description: 'Khu công nghiệp đa ngành trọng điểm phía Nam với hạ tầng hiện đại, đáp ứng tiêu chuẩn quốc tế.',
    verificationStatus: 'verified',
    verifiedAt: '2024-03-01T00:00:00Z',
    verifiedBy: 'user-1',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    esgStatus: 'all',
    digitalTransformation: true,
    contactEmail: 'info@dongnama-iz.vn',
    contactPhone: '0274-1234567',
    website: 'https://dongnama-iz.vn',
    totalCompanies: 120,
    totalEmployees: 48000,
    facilities: ['Hải quan tại chỗ', 'Ký túc xá công nhân', 'Hệ thống xử lý nước thải', 'Trung tâm logistics'],
    clusterIds: ['cluster-1', 'cluster-2'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'iz-2',
    userId: 'user-4',
    regionId: 'region-1',
    name: 'Khu Công Nghiệp VSIP Bắc Ninh',
    address: 'Xã Phù Chẩn, TX. Từ Sơn, Bắc Ninh',
    province: 'Bắc Ninh',
    district: 'Từ Sơn',
    latitude: 21.1125,
    longitude: 105.9758,
    area: 700,
    establishedYear: 2010,
    owner: 'Liên doanh VSIP JV',
    industries: ['Điện tử', 'Dệt may', 'Logistics'],
    description: 'KCN VSIP Bắc Ninh là điểm đến của các tập đoàn công nghệ cao, hạ tầng hoàn chỉnh, gần Hà Nội.',
    verificationStatus: 'verified',
    verifiedAt: '2024-02-10T00:00:00Z',
    verifiedBy: 'user-1',
    esgStatus: 'environmental',
    digitalTransformation: true,
    contactEmail: 'contact@vsipbacninh.vn',
    contactPhone: '0222-7654321',
    website: 'https://vsip.com.vn',
    totalCompanies: 95,
    totalEmployees: 38000,
    facilities: ['Trung tâm logistics', 'Hệ thống xử lý nước thải', 'Khu lưu trú chuyên gia'],
    clusterIds: ['cluster-3'],
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'iz-3',
    userId: 'user-5',
    regionId: 'region-2',
    name: 'Khu Công Nghiệp Hòa Khánh',
    address: 'Quận Liên Chiểu, TP. Đà Nẵng',
    province: 'Đà Nẵng',
    district: 'Liên Chiểu',
    latitude: 16.0903,
    longitude: 108.1504,
    area: 420,
    establishedYear: 2012,
    owner: 'Công ty Phát triển KCN Đà Nẵng',
    industries: ['Logistics', 'Năng lượng', 'Chế biến thực phẩm'],
    description: 'KCN Hòa Khánh nằm gần cảng Liên Chiểu, thuận tiện giao thương quốc tế và khu vực miền Trung.',
    verificationStatus: 'pending',
    esgStatus: 'social',
    digitalTransformation: false,
    contactEmail: 'support@hoakhanh-iz.vn',
    contactPhone: '0236-4567890',
    website: 'https://hoakhanh-iz.vn',
    totalCompanies: 65,
    totalEmployees: 22000,
    facilities: ['Trạm điện 110kV', 'Hệ thống xử lý nước thải', 'Trung tâm đào tạo nhân lực'],
    clusterIds: ['cluster-4'],
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
];

// ===== Clusters (Cấp 3) =====
export const mockClusters: Cluster[] = [
  {
    id: 'cluster-1',
    izId: 'iz-1',
    name: 'Cụm Điện tử & Cơ khí Chính xác',
    description: 'Tập trung các doanh nghiệp điện tử, linh kiện và cơ khí chính xác.',
    area: 52,
    factoryIds: ['factory-1', 'factory-2'],
    industries: ['Điện tử', 'Cơ khí'],
    totalFactories: 12,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'cluster-2',
    izId: 'iz-1',
    name: 'Cụm Hậu cần & Logistics',
    description: 'Kho bãi, trung tâm logistics và doanh nghiệp cung ứng dịch vụ hậu cần.',
    area: 65,
    factoryIds: ['factory-3'],
    industries: ['Logistics'],
    totalFactories: 8,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'cluster-3',
    izId: 'iz-2',
    name: 'Cụm Công nghệ cao Bắc Ninh',
    description: 'Cụm nhà máy công nghệ cao với dây chuyền SMT, bán dẫn và lắp ráp.',
    area: 48,
    factoryIds: ['factory-4'],
    industries: ['Điện tử', 'Công nghệ cao'],
    totalFactories: 10,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
  },
  {
    id: 'cluster-4',
    izId: 'iz-3',
    name: 'Cụm Logistics Đà Nẵng',
    description: 'Cụm hỗ trợ logistics, kho lạnh và dịch vụ năng lượng tái tạo.',
    area: 35,
    factoryIds: ['factory-5'],
    industries: ['Logistics', 'Năng lượng'],
    totalFactories: 6,
    createdAt: '2024-01-22T00:00:00Z',
    updatedAt: '2024-02-12T00:00:00Z',
  },
];

// ===== Factories (Cấp 4) =====
export const mockFactories: Factory[] = [
  {
    id: 'factory-1',
    userId: 'user-21',
    izId: 'iz-1',
    clusterId: 'cluster-1',
    name: 'Nhà máy Linh kiện Điện tử ABC',
    lotNumber: 'Lô A-12',
    address: 'Lô A-12, KCN Đông Nam Á, Bình Dương',
    latitude: 10.905,
    longitude: 106.77,
    industries: ['Điện tử'],
    description: 'Sản xuất PCB, module IoT và linh kiện cho thiết bị gia dụng.',
    verificationStatus: 'verified',
    verifiedAt: '2024-02-01T00:00:00Z',
    verifiedBy: 'user-1',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    esgStatus: 'environmental',
    digitalTransformation: true,
    contactEmail: 'contact@abc-electronics.vn',
    contactPhone: '0274-1111111',
    website: 'https://abc-electronics.vn',
    productionCapacity: '10 triệu PCB/năm',
    products: ['PCB', 'Module IoT', 'Bộ nguồn'],
    linkedBuyerIds: ['buyer-1', 'buyer-2'],
    linkedSupplierIds: ['supp-1', 'supp-2'],
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: 'factory-2',
    userId: 'user-22',
    izId: 'iz-1',
    clusterId: 'cluster-1',
    name: 'Nhà máy Cơ khí Chính xác Mekong',
    lotNumber: 'Lô A-15',
    address: 'Lô A-15, KCN Đông Nam Á, Bình Dương',
    latitude: 10.902,
    longitude: 106.772,
    industries: ['Cơ khí'],
    description: 'Gia công chi tiết cơ khí chính xác cho ngành ô tô và xe máy.',
    verificationStatus: 'pending',
    esgStatus: 'social',
    digitalTransformation: false,
    contactEmail: 'info@mekong-precision.vn',
    contactPhone: '0274-2222222',
    productionCapacity: '500.000 bộ linh kiện/năm',
    products: ['Vỏ hộp số', 'Trục cam', 'Linh kiện CNC'],
    createdAt: '2024-01-28T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
  },
  {
    id: 'factory-3',
    userId: 'user-23',
    izId: 'iz-1',
    clusterId: 'cluster-2',
    name: 'Trung tâm Logistics SmartPort',
    lotNumber: 'Lô B-03',
    address: 'Lô B-03, KCN Đông Nam Á, Bình Dương',
    latitude: 10.899,
    longitude: 106.765,
    industries: ['Logistics'],
    description: 'Kho thông minh, quản lý bằng IoT và hệ thống WMS tích hợp.',
    verificationStatus: 'verified',
    verifiedAt: '2024-02-15T00:00:00Z',
    verifiedBy: 'user-1',
    esgStatus: 'governance',
    digitalTransformation: true,
    contactEmail: 'hello@smartport.vn',
    contactPhone: '0274-3333333',
    website: 'https://smartport.vn',
    productionCapacity: '2.5 triệu đơn hàng/năm',
    products: ['Dịch vụ kho bãi', 'Cross-docking', '3PL'],
    createdAt: '2024-01-30T00:00:00Z',
    updatedAt: '2024-03-02T00:00:00Z',
  },
  {
    id: 'factory-4',
    userId: 'user-24',
    izId: 'iz-2',
    clusterId: 'cluster-3',
    name: 'Nhà máy Bán dẫn TechFuture',
    lotNumber: 'Lô C-05',
    address: 'Lô C-05, KCN VSIP Bắc Ninh',
    latitude: 21.114,
    longitude: 105.978,
    industries: ['Điện tử', 'Công nghệ cao'],
    description: 'Dây chuyền SMT và đóng gói chip bán dẫn cho thiết bị viễn thông.',
    verificationStatus: 'verified',
    verifiedAt: '2024-03-05T00:00:00Z',
    verifiedBy: 'user-1',
    esgStatus: 'all',
    digitalTransformation: true,
    contactEmail: 'contact@techfuture.vn',
    contactPhone: '0222-8888888',
    website: 'https://techfuture.vn',
    productionCapacity: '5 triệu chip/năm',
    products: ['Chip viễn thông', 'Module 5G', 'Bảng mạch cao cấp'],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-05T00:00:00Z',
  },
  {
    id: 'factory-5',
    userId: 'user-25',
    izId: 'iz-3',
    clusterId: 'cluster-4',
    name: 'Nhà máy Năng lượng Xanh Pacific',
    lotNumber: 'Lô D-09',
    address: 'Lô D-09, KCN Hòa Khánh, Đà Nẵng',
    latitude: 16.092,
    longitude: 108.154,
    industries: ['Năng lượng', 'Logistics'],
    description: 'Sản xuất thiết bị năng lượng tái tạo và cung cấp dịch vụ kho lạnh.',
    verificationStatus: 'pending',
    esgStatus: 'environmental',
    digitalTransformation: false,
    contactEmail: 'info@pacificgreen.vn',
    contactPhone: '0236-9999999',
    productionCapacity: '120 MW thiết bị/năm',
    products: ['Module năng lượng mặt trời', 'Thiết bị lưu trữ', 'Dịch vụ kho lạnh'],
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-25T00:00:00Z',
  },
];

// ===== Suppliers =====
export const mockSuppliers: Supplier[] = [
  {
    id: 'supp-1',
    userId: 'user-31',
    companyName: 'Công ty Dệt May Hòa Bình',
    businessLicense: '0301234567',
    industries: ['Dệt may'],
    services: ['training', 'consumables'],
    products: ['Vải Cotton 100%', 'Vải Denim cao cấp'],
    verificationStatus: 'verified',
    verifiedAt: '2024-02-15T00:00:00Z',
    verifiedBy: 'user-1',
    isStrategicPartner: true,
    rating: 4.7,
    reviewCount: 124,
    regions: ['Miền Nam'],
    responseTimeHours: 1.8,
    onTimeDeliveryRate: 98,
    establishedYear: 2008,
    factoryArea: 32000,
    annualExportRevenueUSD: 18000000,
    languages: ['vi', 'en', 'ja'],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    description:
      'Nhà cung ứng vải xuất khẩu với hệ thống nhuộm – hoàn tất đạt chuẩn OEKO-TEX, chuyên phối hợp cùng các nhà máy may FOB tại Bình Dương.',
    contactEmail: 'sales@hoabinh-textile.vn',
    contactPhone: '028-555-8888',
    website: 'https://hoabinh-textile.vn',
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-03-04T00:00:00Z',
  },
  {
    id: 'supp-2',
    userId: 'user-32',
    companyName: 'LogiHub Việt Nam',
    industries: ['Logistics', 'Kho bãi'],
    services: ['logistics', 'event'],
    products: ['Dịch vụ kho bãi 3PL', 'Giải pháp fulfillment xuyên biên giới'],
    verificationStatus: 'verified',
    verifiedAt: '2024-03-02T00:00:00Z',
    verifiedBy: 'user-1',
    isStrategicPartner: false,
    rating: 4.5,
    reviewCount: 87,
    regions: ['Miền Nam', 'Miền Bắc'],
    responseTimeHours: 2.5,
    onTimeDeliveryRate: 95,
    establishedYear: 2015,
    factoryArea: 45000,
    annualExportRevenueUSD: 12500000,
    languages: ['vi', 'en'],
    videoUrl: 'https://www.youtube.com/watch?v=5NV6Rdv1a3I',
    description:
      'Đơn vị logistics 3PL với mạng lưới kho tại VSIP, ICD Sóng Thần và hệ thống quản lý WMS tích hợp API với các sàn TMĐT.',
    contactEmail: 'hello@logihub.vn',
    contactPhone: '028-6666-9090',
    website: 'https://logihub.vn',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    businessLicense: '0315567788',
  },
  {
    id: 'supp-3',
    userId: 'user-33',
    companyName: 'GreenTech Energy',
    industries: ['Năng lượng', 'Tư vấn'],
    services: ['energy', 'training'],
    products: ['Tư vấn chuyển đổi năng lượng xanh'],
    verificationStatus: 'pending',
    isStrategicPartner: false,
    rating: 4.3,
    reviewCount: 42,
    regions: ['Miền Trung'],
    responseTimeHours: 3.2,
    onTimeDeliveryRate: 92,
    establishedYear: 2017,
    factoryArea: 12000,
    annualExportRevenueUSD: 6500000,
    languages: ['vi', 'en'],
    videoUrl: 'https://www.youtube.com/watch?v=QH2-TGUlwu4',
    description:
      'Đội ngũ kỹ sư triển khai giải pháp năng lượng tái tạo, lưu trữ và tối ưu chi phí điện cho các nhà máy công nghiệp.',
    contactEmail: 'contact@greentech.vn',
    contactPhone: '024-7788-8899',
    website: 'https://greentech.vn',
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-26T00:00:00Z',
  },
];

// ===== Products (Marketplace) =====
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    supplierId: 'supp-1',
    name: 'Vải Cotton 100%',
    category: 'Dệt may',
    description: 'Vải cotton chất lượng cao, phù hợp may quần áo xuất khẩu. Độ dày 200gsm.',
    price: 45000,
    unit: 'mét',
    minOrder: 1000,
    images: ['https://images.unsplash.com/photo-1585129368862-e8afe4974243?w=400'],
    certifications: ['ISO 9001', 'OEKO-TEX'],
    verificationStatus: 'verified',
    verifiedAt: '2024-02-18T00:00:00Z',
    verifiedBy: 'user-1',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-18T00:00:00Z',
    rating: 4.6,
  },
  {
    id: 'prod-2',
    factoryId: 'factory-1',
    izId: 'iz-1',
    name: 'Module IoT SmartHome',
    category: 'Điện tử',
    description: 'Module IoT cho nhà thông minh, hỗ trợ Zigbee, WiFi và Matter.',
    price: 180000,
    unit: 'bộ',
    minOrder: 500,
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'],
    verificationStatus: 'verified',
    verifiedAt: '2024-03-01T00:00:00Z',
    verifiedBy: 'user-1',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    rating: 4.9,
  },
  {
    id: 'prod-3',
    supplierId: 'supp-2',
    name: 'Dịch vụ kho bãi 3PL',
    category: 'Logistics',
    description: 'Giải pháp 3PL toàn diện: lưu kho, phân phối, cross-docking, fulfillment.',
    price: 3500000,
    unit: 'container',
    minOrder: 5,
    images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c0dbc9?w=400'],
    verificationStatus: 'pending',
    createdAt: '2024-02-25T00:00:00Z',
    updatedAt: '2024-02-25T00:00:00Z',
    rating: 4.2,
  },
];

export const mockBuyerLeads = [
  {
    id: 'buyer-1',
    company: 'Công ty Thương mại Bắc Ninh',
    industries: ['Điện tử', 'Cơ khí'],
    opportunities: 3,
    stage: 'Đàm phán',
    value: 2300000,
    lastContact: '2025-11-09T04:15:00Z',
  },
  {
    id: 'buyer-2',
    company: 'Tập đoàn Thực phẩm Mekong',
    industries: ['Thực phẩm'],
    opportunities: 2,
    stage: 'Đang quan tâm',
    value: 750000,
    lastContact: '2025-11-08T16:00:00Z',
  },
  {
    id: 'buyer-3',
    company: 'Công ty Ô tô Việt Đức',
    industries: ['Logistics', 'Cơ khí'],
    opportunities: 4,
    stage: 'Đã ký',
    value: 4500000,
    lastContact: '2025-11-07T09:30:00Z',
  },
] as const;

export const mockInvestorDeals = [
  {
    id: 'investor-1',
    fundName: 'ASEAN Growth Fund',
    focus: ['Điện tử', 'Năng lượng'],
    budget: '$25M',
    status: 'Đánh giá',
    owner: 'Nguyễn Văn Khánh',
  },
  {
    id: 'investor-2',
    fundName: 'Pacific Manufacturing Partners',
    focus: ['Cơ khí', 'Logistics'],
    budget: '$40M',
    status: 'Hẹn gặp',
    owner: 'Trần Lan Hương',
  },
  {
    id: 'investor-3',
    fundName: 'Green Transition Capital',
    focus: ['Năng lượng', 'ESG'],
    budget: '$60M',
    status: 'Ký NDA',
    owner: 'Phạm Quốc Anh',
  },
] as const;

export const mockReportHighlights = [
  { title: 'Leads mới tuần này', value: 18, change: '+12%' },
  { title: 'RFQ đang mở', value: 9, change: '+4%' },
  { title: 'Cuộc gọi tư vấn đã đặt', value: 7, change: '+2' },
] as const;

// ===== Services (Industrial Services Hub) =====
export const mockServices: Service[] = [
  {
    id: 'svc-1',
    supplierId: 'supp-1',
    serviceType: 'recruitment',
    title: 'Dịch vụ tuyển dụng nhân sự kỹ thuật',
    description: 'Cung cấp nhân sự kỹ thuật, quản lý sản xuất cho các KCN phía Nam.',
    izIds: ['iz-1', 'iz-3'],
    priceRange: {
      min: 8000000,
      max: 15000000,
      unit: 'tháng',
    },
    verificationStatus: 'verified',
    verifiedBy: 'user-1',
    isStrategicPartner: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-02T00:00:00Z',
  },
  {
    id: 'svc-2',
    supplierId: 'supp-2',
    serviceType: 'logistics',
    title: 'Giải pháp Logistics Chuỗi lạnh',
    description: 'Dịch vụ vận chuyển và lưu kho lạnh cho ngành thực phẩm và dược phẩm.',
    izIds: ['iz-1', 'iz-2'],
    priceRange: {
      min: 1000000,
      max: 5000000,
      unit: 'container',
    },
    verificationStatus: 'verified',
    verifiedBy: 'user-1',
    isStrategicPartner: false,
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
  },
  {
    id: 'svc-3',
    supplierId: 'supp-3',
    serviceType: 'energy',
    title: 'Tư vấn chuyển đổi năng lượng xanh',
    description: 'Thiết kế, tích hợp hệ thống năng lượng tái tạo cho các nhà máy trong KCN.',
    izIds: ['iz-3'],
    priceRange: {
      min: 30000000,
      max: 120000000,
      unit: 'dự án',
    },
    verificationStatus: 'pending',
    isStrategicPartner: false,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-26T00:00:00Z',
  },
];

// ===== Helper Functions =====
export const getIZById = (id: string): IndustrialZone | undefined => {
  return mockIndustrialZones.find((iz) => iz.id === id);
};

export const getVerifiedIZs = (): IndustrialZone[] => {
  return mockIndustrialZones.filter((iz) => iz.verificationStatus === 'verified');
};

export const getClustersByIZId = (izId: string): Cluster[] => {
  return mockClusters.filter((cluster) => cluster.izId === izId);
};

export const getClusterById = (id: string): Cluster | undefined => {
  return mockClusters.find((cluster) => cluster.id === id);
};

export const getFactoriesByIZId = (izId: string): Factory[] => {
  return mockFactories.filter((factory) => factory.izId === izId);
};

export const getFactoryById = (id: string): Factory | undefined => {
  return mockFactories.find((factory) => factory.id === id);
};

export const getSupplierById = (id: string): Supplier | undefined => {
  return mockSuppliers.find((supplier) => supplier.id === id);
};

export const getSuppliers = (): Supplier[] => {
  return mockSuppliers;
};

export const getProductsBySupplierId = (supplierId: string): Product[] => {
  return mockProducts.filter((product) => product.supplierId === supplierId);
};

export const getServicesByType = (serviceType: string): Service[] => {
  if (serviceType === 'all') return mockServices;
  return mockServices.filter((service) => service.serviceType === serviceType);
};

export const getServiceById = (id: string): Service | undefined => {
  return mockServices.find((service) => service.id === id);
};

export const getConsultantById = (id: string): Consultant | undefined => {
  return mockConsultants.find((consultant) => consultant.id === id);
};

export const getConsultantsByIndustry = (industry: string, region?: string): Consultant[] => {
  const normalizedIndustry = industry.toLowerCase();
  return mockConsultants.filter((consultant) => {
    const matchIndustry =
      normalizedIndustry === '' ||
      consultant.expertise.some((item) => item.toLowerCase().includes(normalizedIndustry));
    const matchRegion = !region || consultant.regions.includes(region);
    return matchIndustry && matchRegion;
  });
};
