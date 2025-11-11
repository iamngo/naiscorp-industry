// Database Schema theo BRD

export type UserRole = 'admin' | 'iz' | 'factory' | 'supplier' | 'buyer' | 'investor';
export type TopologyLevel = 'region' | 'iz' | 'cluster' | 'factory';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export type ESGStatus = 'none' | 'environmental' | 'social' | 'governance' | 'all';

export type InvestmentType = 'new' | 'acquisition' | 'partnership';

export type RFQStatus = 'pending' | 'responded' | 'closed' | 'cancelled';

export type ServiceType = 'recruitment' | 'training' | 'logistics' | 'energy' | 'crm' | 'cdp' | 'event' | 'consumables' | 'other';

// User Base
export interface User {
  id: string;
  email: string;
  passwordHash: string; // bcrypt hashed
  role: UserRole;
  fullName: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// Region (Vùng miền - Cấp 1 trong topology)
export interface Region {
  id: string;
  name: string; // VD: Miền Bắc, Miền Trung, Miền Nam
  description?: string;
  totalIZs: number;
  totalClusters: number;
  totalFactories: number;
  averageESG: number; // 0-100
  totalInvestment: number;
  industries: string[]; // Ngành chính của vùng
  createdAt: string;
  updatedAt: string;
}

// Cluster (Cụm công nghiệp - Cấp 3 trong topology)
export interface Cluster {
  id: string;
  izId: string; // Thuộc KCN nào
  name: string;
  description?: string;
  area: number; // hectares
  factoryIds: string[]; // Danh sách nhà máy trong cụm
  industries: string[]; // Ngành nghề của cụm
  totalFactories: number;
  createdAt: string;
  updatedAt: string;
}

// Industrial Zone (IZ) - Cấp 2 trong topology
export interface IndustrialZone {
  id: string;
  userId: string; // Owner/Admin của IZ
  regionId?: string; // Thuộc vùng nào (Miền Bắc/Trung/Nam)
  name: string;
  address: string;
  province: string;
  district: string;
  latitude: number;
  longitude: number;
  area: number; // hectares
  establishedYear: number;
  owner: string; // Chủ đầu tư
  industries: string[]; // Ngành nghề chính
  description: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string; // Admin ID
  videoUrl?: string; // Video xác minh
  documentUrls?: string[]; // Chứng từ
  esgStatus: ESGStatus;
  digitalTransformation: boolean;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  layoutMapUrl?: string;
  layoutMapDescription?: string;
  totalCompanies: number;
  totalEmployees: number;
  facilities: string[]; // Tiện ích
  clusterIds?: string[]; // Danh sách cụm công nghiệp
  createdAt: string;
  updatedAt: string;
}

// Factory (Nhà máy - Cấp 4 trong topology)
export interface Factory {
  id: string;
  userId: string; // Owner của nhà máy
  izId: string; // Thuộc KCN nào
  clusterId?: string; // Thuộc cụm nào (optional)
  name: string;
  lotNumber?: string; // Số lô trong KCN
  address: string;
  latitude: number;
  longitude: number;
  industries: string[]; // Ngành nghề sản xuất
  description: string;
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  videoUrl?: string; // Video xác minh (upload hoặc link YouTube/Cloudflare Stream)
  documentUrls?: string[]; // Chứng từ
  esgStatus: ESGStatus;
  digitalTransformation: boolean;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  productionCapacity?: string; // Năng lực sản xuất
  products: string[]; // Danh sách hàng hoá/sản phẩm
  linkedBuyerIds?: string[]; // Các buyer có tương tác
  linkedSupplierIds?: string[]; // Các supplier có tương tác
  createdAt: string;
  updatedAt: string;
}

// Supplier
export interface Supplier {
  id: string;
  userId: string;
  companyName: string;
  businessLicense?: string;
  industries: string[]; // Ngành cung ứng
  services: ServiceType[]; // Dịch vụ cung cấp
  products: string[]; // Sản phẩm cung cấp
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  isStrategicPartner: boolean; // Badge đối tác chiến lược
  description: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviewCount?: number;
  regions?: string[];
  headquarters?: string;
  responseTimeHours?: number;
  onTimeDeliveryRate?: number;
  establishedYear?: number;
  factoryArea?: number;
  annualExportRevenueUSD?: number;
  languages?: string[];
  videoUrl?: string;
  certifications?: string[];
  responseRate?: number;
  lastActiveAt?: string;
}

// Buyer
export interface Buyer {
  id: string;
  userId: string;
  companyName: string;
  industries: string[]; // Ngành mua hàng
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

// Investor
export interface Investor {
  id: string;
  userId: string;
  companyName?: string;
  investmentBudget: number;
  preferredIndustries: string[];
  preferredLocations: string[];
  investmentType: InvestmentType;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultantAvailability {
  day: string; // Ví dụ: Thứ 2, Thứ 3
  slots: string[]; // Các khung giờ có thể hẹn
}

export interface Consultant {
  id: string;
  name: string;
  title: string;
  expertise: string[]; // Các lĩnh vực tư vấn chính
  regions: string[]; // Vùng miền phụ trách
  languages: string[]; // Ngôn ngữ hỗ trợ
  successRate: number; // % thành công các dự án
  averageResponseTimeHours: number;
  email: string;
  phone: string;
  avatarUrl?: string;
  notes?: string;
  currentProjects?: string[];
  availability: ConsultantAvailability[];
  createdAt: string;
  updatedAt: string;
}

// Product (B2B Marketplace)
export interface Product {
  id: string;
  supplierId?: string; // Nếu từ Supplier
  factoryId?: string; // Nếu từ Factory (theo BRD: danh sách hàng hoá của Factory)
  izId?: string; // Nếu sản phẩm từ IZ (KCN có thể liệt kê danh mục hàng hoá/dịch vụ đang cần mua)
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  minOrder: number;
  images: string[];
  certifications?: string[]; // Chứng nhận
  verificationStatus: VerificationStatus;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  viewCount?: number;
  responseRate?: number;
  leadCount?: number;
  mediaUrls?: string[];
}

// RFQ (Request for Quotation)
export interface RFQ {
  id: string;
  buyerId: string;
  supplierId?: string; // Nếu gửi cho supplier cụ thể
  productId?: string; // Nếu liên quan đến sản phẩm
  title: string;
  description: string;
  quantity: number;
  unit: string;
  budget?: number;
  deadline: string; // Yêu cầu báo giá trước ngày
  status: RFQStatus;
  response?: {
    supplierId: string;
    quotedPrice: number;
    message: string;
    respondedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Service (Industrial Services Hub)
export interface Service {
  id: string;
  supplierId: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  izIds?: string[]; // IZ đang sử dụng dịch vụ này
  priceRange?: {
    min: number;
    max: number;
    unit: string;
  };
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  isStrategicPartner: boolean;
  avgResponseHours?: number;
  activeContracts?: number;
  satisfactionScore?: number; // 0-100
  lastEvaluationAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Investment Plan
export interface InvestmentPlan {
  id: string;
  investorId: string;
  budget: number;
  investmentType: InvestmentType;
  preferredIndustries: string[];
  preferredLocations: string[];
  chatbotResponses?: {
    question: string;
    answer: string;
  }[];
  recommendations: {
    izIds: string[];
    supplierIds: string[];
    rationale: string;
  };
  planDocument?: string; // PDF URL
  status: 'draft' | 'submitted' | 'reviewed' | 'closed';
  advisorId?: string; // Tư vấn viên follow up
  createdAt: string;
  updatedAt: string;
}

// Connection Request
export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromRole: UserRole;
  toUserId: string;
  toRole: UserRole;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Event
export interface Event {
  id: string;
  izId: string;
  title: string;
  description: string;
  eventType: 'golf' | 'exhibition' | 'seminar' | 'meeting' | 'other';
  startDate: string;
  endDate: string;
  location: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Admin Activity Log
export interface AdminLog {
  id: string;
  adminId: string;
  action: string; // 'verify_iz', 'approve_product', etc.
  entityType: string; // 'industrial_zone', 'supplier', etc.
  entityId: string;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface BuyerLead {
  id: string;
  company: string;
  industries: string[];
  opportunities: number;
  stage: string;
  value: number;
  lastContact: string;
  notes?: string[];
}

export interface InvestorDeal {
  id: string;
  fundName: string;
  focus: string[];
  budget: string;
  status: string;
  owner: string;
  notes?: string[];
}

export interface ReportHighlight {
  title: string;
  value: number;
  change: string;
}

export interface ContentHistoryEntry {
  version: number;
  updatedAt: string;
  updatedBy: string;
  notes?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'news' | 'banner' | 'event' | 'page';
  owner: string;
  status: 'pending' | 'scheduled' | 'published';
  scheduledAt?: string;
  version: number;
  history: ContentHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

