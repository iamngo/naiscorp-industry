'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  mockFactories,
  mockProducts,
  mockServices,
  mockSuppliers,
  mockReportHighlights,
  mockBuyerLeads,
  mockInvestorDeals,
} from '@/lib/mockData';
import {
  Shield,
  CheckCircle,
  Clock,
  X,
  Building2,
  Filter,
  Users,
  Briefcase,
  BarChart3,
  FileText,
  UserCircle,
  Mail,
  Phone,
  Globe,
  Link2,
  Package,
} from 'lucide-react';
import { IndustrialZone, Factory, Product, Service, Supplier, ESGStatus } from '@/types/database';

export default function AdminDashboard() {
  const [izs, setIZs] = useState<IndustrialZone[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [products, setProducts] = useState<Product[]>(() => mockProducts.map(product => ({ ...product })));
  const [services, setServices] = useState<Service[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => mockSuppliers.map((supplier) => ({ ...supplier })));
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [activeTab, setActiveTab] = useState<
    'iz' | 'factory' | 'services' | 'products' | 'supplier' | 'buyer' | 'investor' | 'users' | 'content' | 'reports'
  >('iz');

  type BuyerLead = {
    id: string;
    company: string;
    industries: string[];
    opportunities: number;
    stage: 'Đang quan tâm' | 'Đàm phán' | 'Đã ký';
    lastContact: string;
  };

  type InvestorPipeline = {
    id: string;
    fundName: string;
    focus: string[];
    budget: string;
    status: 'Đánh giá' | 'Hẹn gặp' | 'Ký NDA';
    owner: string;
  };

  type UserAccount = {
    id: string;
    fullName: string;
    role: string;
    lastLogin: string;
    status: 'active' | 'invited';
  };

  type ContentItem = {
    id: string;
    title: string;
    type: 'Bài viết' | 'Banner' | 'Sự kiện';
    owner: string;
    status: 'pending' | 'scheduled' | 'published';
    scheduledAt?: string;
  };

  const [buyerLeads] = useState<BuyerLead[]>(() =>
    mockBuyerLeads.map((lead) => ({
      id: lead.id,
      company: lead.company,
      industries: [...lead.industries],
      opportunities: lead.opportunities,
      stage: lead.stage,
      value: lead.value,
      lastContact: lead.lastContact,
    })),
  );

  const [investorDeals] = useState<InvestorPipeline[]>(() =>
    mockInvestorDeals.map((deal) => ({
      id: deal.id,
      fundName: deal.fundName,
      focus: [...deal.focus],
      budget: deal.budget,
      status: deal.status,
      owner: deal.owner,
    })),
  );

  const [userAccounts] = useState<UserAccount[]>([
    {
      id: 'user-1',
      fullName: 'Admin System',
      role: 'Admin',
      lastLogin: '11/10/2025 10:24',
      status: 'active',
    },
    {
      id: 'user-2',
      fullName: 'Nguyễn Tấn Tài',
      role: 'Verifier',
      lastLogin: '11/09/2025 21:05',
      status: 'active',
    },
    {
      id: 'user-3',
      fullName: 'Lê Quỳnh Trang',
      role: 'Content Editor',
      lastLogin: '11/08/2025 08:11',
      status: 'invited',
    },
  ]);

  const [contentQueue] = useState<ContentItem[]>([
    {
      id: 'content-1',
      title: 'Báo cáo xu hướng chuỗi cung ứng miền Bắc 2025',
      type: 'Bài viết',
      owner: 'Marketing',
      status: 'pending',
    },
    {
      id: 'content-2',
      title: 'Banner chiến dịch ESG Summit',
      type: 'Banner',
      owner: 'Design',
      status: 'scheduled',
      scheduledAt: '2025-11-15',
    },
    {
      id: 'content-3',
      title: 'Sự kiện kết nối nhà đầu tư Nhật Bản',
      type: 'Sự kiện',
      owner: 'Events',
      status: 'published',
    },
  ]);

  const esgOptions: { value: ESGStatus; label: string }[] = [
    { value: 'none', label: 'Không' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'social', label: 'Social' },
    { value: 'governance', label: 'Governance' },
    { value: 'all', label: 'ESG toàn diện' },
  ];

  const fetchIZs = useCallback(async () => {
    const response = await fetch('/api/industrial-zones', {
      cache: 'no-store',
    }).catch(() => null);
    if (!response || !response.ok) {
      return [];
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : [];
  }, []);

  const fetchFactories = useCallback(async () => {
    const response = await fetch('/api/factories', {
      cache: 'no-store',
    }).catch(() => null);
    if (!response || !response.ok) {
      return mockFactories;
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : mockFactories;
  }, []);

  const fetchServices = useCallback(async () => {
    const response = await fetch('/api/services', {
      cache: 'no-store',
    }).catch(() => null);
    if (!response || !response.ok) {
      return mockServices;
    }
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : mockServices;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadDashboardData = async () => {
      if (!cancelled) {
        setLoading(true);
      }

      try {
        const [izData, factoryData, serviceData] = await Promise.all([
          fetchIZs(),
          fetchFactories(),
          fetchServices(),
        ]);

        if (cancelled) return;

        setIZs(izData);
        setFactories(factoryData);
        setServices(serviceData);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      cancelled = true;
    };
  }, [fetchFactories, fetchIZs, fetchServices]);

  const handleVerify = async (izId: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/industrial-zones/${izId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIZs(prev =>
          prev.map(iz => (iz.id === izId && data?.data ? data.data : iz)),
        );
        const latestIZs = await fetchIZs();
        setIZs(latestIZs);
        alert(`Đã ${status === 'verified' ? 'xác thực' : 'từ chối'} khu công nghiệp (mock data)`);
      }
    } catch {
      alert('Có lỗi xảy ra');
    }
  };

  const handleVerifyFactory = async (factoryId: string, status: 'verified' | 'rejected') => {
    try {
      console.log('[AdminDashboard] verify factory', { factoryId, status });
      const res = await fetch(`/api/factories/${factoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        }),
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}));
        console.error('[AdminDashboard] verify factory failed', {
          statusCode: res.status,
          errorPayload,
        });
        alert('Có lỗi xảy ra khi cập nhật trạng thái nhà máy');
        return;
      }

      const data = await res.json();
      console.log('[AdminDashboard] verify factory success', data);
      setFactories(prev =>
        prev.map(f => (f.id === factoryId && data?.data ? data.data : f)),
      );
      const latestFactories = await fetchFactories();
      console.log('[AdminDashboard] factories reloaded after verify', latestFactories);
      setFactories(latestFactories);
      alert(`Đã ${status === 'verified' ? 'xác thực' : 'từ chối'} nhà máy (mock data)`);
    } catch (error) {
      console.error('[AdminDashboard] verify factory exception', error);
      alert('Có lỗi xảy ra');
    }
  };

  const filteredIZs = izs.filter(iz => {
    if (filter === 'pending') return iz.verificationStatus === 'pending';
    if (filter === 'verified') return iz.verificationStatus === 'verified';
    return true;
  });

  const handleVerifyProduct = async (productId: string, status: 'verified' | 'rejected') => {
    try {
      // Mock update
      setProducts(products.map(p => 
        p.id === productId 
          ? { ...p, verificationStatus: status, verifiedBy: 'user-1', verifiedAt: new Date().toISOString() }
          : p
      ));
      alert(`Đã ${status === 'verified' ? 'xác thực' : 'từ chối'} sản phẩm (mock data)`);
    } catch {
      alert('Có lỗi xảy ra');
    }
  };

  const handleVerifyService = async (serviceId: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedBy: 'user-1',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setServices(prev =>
          prev.map(s => (s.id === serviceId && data?.data ? data.data : s)),
        );
        const latestServices = await fetchServices();
        setServices(latestServices);
        alert(`Đã ${status === 'verified' ? 'xác thực' : 'từ chối'} dịch vụ (mock data)`);
      }
    } catch {
      alert('Có lỗi xảy ra');
    }
  };

  const handleUpdateServiceBadge = async (serviceId: string, isStrategic: boolean) => {
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isStrategicPartner: isStrategic,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setServices(prev =>
          prev.map(s => (s.id === serviceId && data?.data ? data.data : s)),
        );
        const latestServices = await fetchServices();
        setServices(latestServices);
      }
    } catch {
      alert('Có lỗi xảy ra');
    }
  };

  const handleUpdateIZEsg = async (izId: string, esgStatus: ESGStatus) => {
    try {
      const res = await fetch(`/api/industrial-zones/${izId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ esgStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setIZs((prev) => prev.map((iz) => (iz.id === izId && data?.data ? data.data : iz)));
      }
    } catch (error) {
      console.error('[AdminDashboard] update IZ ESG failed', error);
      alert('Không thể cập nhật ESG cho KCN.');
    }
  };

  const handleToggleIZDX = async (izId: string, digitalTransformation: boolean) => {
    try {
      const res = await fetch(`/api/industrial-zones/${izId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digitalTransformation }),
      });
      if (res.ok) {
        const data = await res.json();
        setIZs((prev) => prev.map((iz) => (iz.id === izId && data?.data ? data.data : iz)));
      }
    } catch (error) {
      console.error('[AdminDashboard] toggle IZ DX failed', error);
      alert('Không thể cập nhật trạng thái chuyển đổi số cho KCN.');
    }
  };

  const handleUpdateFactoryESG = async (factoryId: string, esgStatus: ESGStatus) => {
    try {
      const res = await fetch(`/api/factories/${factoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ esgStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setFactories((prev) => prev.map((factory) => (factory.id === factoryId && data?.data ? data.data : factory)));
      }
    } catch (error) {
      console.error('[AdminDashboard] update factory ESG failed', error);
      alert('Không thể cập nhật ESG cho nhà máy.');
    }
  };

  const handleToggleFactoryDX = async (factoryId: string, digitalTransformation: boolean) => {
    try {
      const res = await fetch(`/api/factories/${factoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ digitalTransformation }),
      });
      if (res.ok) {
        const data = await res.json();
        setFactories((prev) => prev.map((factory) => (factory.id === factoryId && data?.data ? data.data : factory)));
      }
    } catch (error) {
      console.error('[AdminDashboard] toggle factory DX failed', error);
      alert('Không thể cập nhật trạng thái chuyển đổi số cho nhà máy.');
    }
  };

  const handleUpdateSupplierStatus = (supplierId: string, status: 'verified' | 'pending') => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === supplierId
          ? {
              ...supplier,
              verificationStatus: status,
              verifiedAt: status === 'verified' ? new Date().toISOString() : supplier.verifiedAt,
            }
          : supplier,
      ),
    );
    alert(`Cập nhật trạng thái nhà cung cấp thành công (mock data)`);
  };

  const handleToggleSupplierStrategic = (supplierId: string) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === supplierId ? { ...supplier, isStrategicPartner: !supplier.isStrategicPartner } : supplier,
      ),
    );
  };

  const stats = {
    total: izs.length,
    verified: izs.filter(iz => iz.verificationStatus === 'verified').length,
    pending: izs.filter(iz => iz.verificationStatus === 'pending').length,
    rejected: izs.filter(iz => iz.verificationStatus === 'rejected').length,
    totalFactories: factories.length,
    verifiedFactories: factories.filter(f => f.verificationStatus === 'verified').length,
    pendingFactories: factories.filter(f => f.verificationStatus === 'pending').length,
    totalProducts: products.length,
    pendingProducts: products.filter(p => p.verificationStatus === 'pending').length,
    totalServices: services.length,
    pendingServices: services.filter(s => s.verificationStatus === 'pending').length,
  };

  const supplierStatsSnapshot = {
    total: suppliers.length,
    verified: suppliers.filter((supplier) => supplier.verificationStatus === 'verified').length,
    pending: suppliers.filter((supplier) => supplier.verificationStatus === 'pending').length,
    strategic: suppliers.filter((supplier) => supplier.isStrategicPartner).length,
  };

  const contentStats = {
    pending: contentQueue.filter((item) => item.status === 'pending').length,
    scheduled: contentQueue.filter((item) => item.status === 'scheduled').length,
    published: contentQueue.filter((item) => item.status === 'published').length,
  };

  const dashboardTrends = mockReportHighlights;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-gray-600">
            Quản trị và thống kê hệ thống Vietnam Industrial Supply Chain
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/admin/connections"
              className="inline-flex items-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:border-blue-400 hover:text-blue-700"
            >
              <Link2 className="w-4 h-4" />
              <span>Inbox kết nối</span>
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center space-x-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Package className="w-4 h-4" />
              <span>Xem Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('iz')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'iz'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Khu Công nghiệp ({stats.total})
            </button>
            <button
              onClick={() => setActiveTab('factory')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'factory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nhà máy ({stats.totalFactories})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sản phẩm ({stats.totalProducts})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'services'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Dịch vụ ({stats.totalServices})
            </button>
            <button
              onClick={() => setActiveTab('supplier')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'supplier'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nhà cung cấp ({supplierStatsSnapshot.total})
            </button>
            <button
              onClick={() => setActiveTab('buyer')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'buyer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Buyer Leads ({buyerLeads.length})
            </button>
            <button
              onClick={() => setActiveTab('investor')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'investor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nhà đầu tư ({investorDeals.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Người dùng ({userAccounts.length})
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Nội dung ({contentQueue.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reports
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng KCN</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã xác thực</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chờ xác thực</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã từ chối</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nhà cung cấp</p>
                <p className="text-2xl font-bold text-gray-900">{supplierStatsSnapshot.total}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đối tác chiến lược</p>
                <p className="text-2xl font-bold text-purple-600">{supplierStatsSnapshot.strategic}</p>
              </div>
              <Briefcase className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sản phẩm chờ duyệt</p>
                <p className="text-2xl font-bold text-blue-600">{stats.pendingProducts}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nội dung chờ duyệt</p>
                <p className="text-2xl font-bold text-amber-600">{contentStats.pending}</p>
              </div>
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Filter */}
        {activeTab === 'iz' && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center space-x-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tất cả ({stats.total})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Chờ xác thực ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('verified')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'verified'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Đã xác thực ({stats.verified})
              </button>
            </div>
          </div>
        )}

        {activeTab === 'iz' && (
          <>
            {/* IZ List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Danh sách Khu Công Nghiệp</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên KCN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tỉnh/Thành
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ESG
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DX
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredIZs.map((iz) => (
                      <tr key={iz.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{iz.name}</div>
                          <div className="text-sm text-gray-500">{iz.owner}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{iz.province}</div>
                          <div className="text-sm text-gray-500">{iz.district}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {iz.verificationStatus === 'verified' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã xác thực
                            </span>
                          )}
                          {iz.verificationStatus === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Chờ xác thực
                            </span>
                          )}
                          {iz.verificationStatus === 'rejected' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="w-3 h-3 mr-1" />
                              Đã từ chối
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <select
                            value={iz.esgStatus}
                            onChange={(e) => handleUpdateIZEsg(iz.id, e.target.value as ESGStatus)}
                            className="rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                          >
                            {esgOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleToggleIZDX(iz.id, !iz.digitalTransformation)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              iz.digitalTransformation
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {iz.digitalTransformation ? 'Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {iz.verificationStatus === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerify(iz.id, 'verified')}
                                className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Duyệt</span>
                              </button>
                              <button
                                onClick={() => handleVerify(iz.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                              >
                                <X className="w-4 h-4" />
                                <span>Từ chối</span>
                              </button>
                            </div>
                          )}
                          <a
                            href={`/iz/${iz.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Xem chi tiết
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'factory' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả ({stats.totalFactories})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Chờ xác thực ({stats.pendingFactories})
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'verified'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đã xác thực ({stats.verifiedFactories})
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Danh sách Nhà máy</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên nhà máy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        KCN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Lô
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ESG
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DX
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {factories
                      .filter(f => {
                        if (filter === 'pending') return f.verificationStatus === 'pending';
                        if (filter === 'verified') return f.verificationStatus === 'verified';
                        return true;
                      })
                      .map((factory) => (
                      <tr key={factory.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{factory.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">IZ-{factory.izId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{factory.lotNumber || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {factory.verificationStatus === 'verified' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã xác thực
                            </span>
                          )}
                          {factory.verificationStatus === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Chờ xác thực
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <select
                            value={factory.esgStatus}
                            onChange={(e) => handleUpdateFactoryESG(factory.id, e.target.value as ESGStatus)}
                            className="rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
                          >
                            {esgOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleToggleFactoryDX(factory.id, !factory.digitalTransformation)}
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              factory.digitalTransformation
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {factory.digitalTransformation ? 'Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col space-y-1">
                            {factory.verificationStatus === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleVerifyFactory(factory.id, 'verified')}
                                  className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Duyệt</span>
                                </button>
                                <button
                                  onClick={() => handleVerifyFactory(factory.id, 'rejected')}
                                  className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                                >
                                  <X className="w-4 h-4" />
                                  <span>Từ chối</span>
                                </button>
                              </div>
                            )}
                            <a
                              href={`/factory/${factory.id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Xem chi tiết
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'products' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả ({stats.totalProducts})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Chờ duyệt ({stats.pendingProducts})
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'verified'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đã duyệt ({stats.totalProducts - stats.pendingProducts})
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Danh sách Sản phẩm</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên sản phẩm
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Danh mục
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products
                      .filter(p => {
                        if (filter === 'pending') return p.verificationStatus === 'pending';
                        if (filter === 'verified') return p.verificationStatus === 'verified';
                        return true;
                      })
                      .map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}/{product.unit}
                          </div>
                          <div className="text-xs text-gray-500">Min: {product.minOrder} {product.unit}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.verificationStatus === 'verified' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã duyệt
                            </span>
                          )}
                          {product.verificationStatus === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Chờ duyệt
                            </span>
                          )}
                          {product.verificationStatus === 'rejected' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="w-3 h-3 mr-1" />
                              Đã từ chối
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {product.verificationStatus === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleVerifyProduct(product.id, 'verified')}
                                className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Duyệt</span>
                              </button>
                              <button
                                onClick={() => handleVerifyProduct(product.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                              >
                                <X className="w-4 h-4" />
                                <span>Từ chối</span>
                              </button>
                            </div>
                          )}
                          <a
                            href={`/marketplace`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Xem chi tiết
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'services' && (
          <>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Tất cả ({stats.totalServices})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Chờ duyệt ({stats.pendingServices})
                </button>
                <button
                  onClick={() => setFilter('verified')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    filter === 'verified'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Đã duyệt ({stats.totalServices - stats.pendingServices})
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Danh sách Dịch vụ</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên dịch vụ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đối tác chiến lược
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services
                      .filter(s => {
                        if (filter === 'pending') return s.verificationStatus === 'pending';
                        if (filter === 'verified') return s.verificationStatus === 'verified';
                        return true;
                      })
                      .map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{service.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{service.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {service.serviceType === 'recruitment' ? 'Tuyển dụng' :
                             service.serviceType === 'training' ? 'Đào tạo' :
                             service.serviceType === 'logistics' ? 'Logistics' :
                             service.serviceType === 'energy' ? 'Năng lượng' :
                             service.serviceType === 'crm' ? 'CRM' :
                             service.serviceType === 'cdp' ? 'CDP' :
                             service.serviceType === 'event' ? 'Sự kiện' :
                             service.serviceType === 'consumables' ? 'Vật tư tiêu hao' : 'Khác'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {service.verificationStatus === 'verified' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Đã duyệt
                            </span>
                          )}
                          {service.verificationStatus === 'pending' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Chờ duyệt
                            </span>
                          )}
                          {service.verificationStatus === 'rejected' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <X className="w-3 h-3 mr-1" />
                              Đã từ chối
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {service.isStrategicPartner ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              ✓ Đối tác chiến lược
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-col space-y-1">
                            {service.verificationStatus === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleVerifyService(service.id, 'verified')}
                                  className="text-green-600 hover:text-green-900 flex items-center space-x-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Duyệt</span>
                                </button>
                                <button
                                  onClick={() => handleVerifyService(service.id, 'rejected')}
                                  className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                                >
                                  <X className="w-4 h-4" />
                                  <span>Từ chối</span>
                                </button>
                              </div>
                            )}
                            {service.verificationStatus === 'verified' && (
                              <button
                                onClick={() => handleUpdateServiceBadge(service.id, !service.isStrategicPartner)}
                                className={`text-xs px-2 py-1 rounded ${
                                  service.isStrategicPartner
                                    ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {service.isStrategicPartner ? 'Bỏ badge' : 'Gắn badge'}
                              </button>
                            )}
                            <a
                              href={`/services`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Xem chi tiết
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'supplier' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Quản lý Nhà cung cấp</h2>
              <p className="text-sm text-gray-500 mt-1">
                Theo dõi trạng thái xác thực và gắn badge chiến lược cho đối tác trọng điểm.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nhà cung cấp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngành chính
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {suppliers.map((supplier) => (
                    <tr key={supplier.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">{supplier.companyName}</div>
                        <div className="text-xs text-gray-500">Sản phẩm nổi bật: {supplier.products.slice(0, 2).join(', ')}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {supplier.industries.map((industry) => (
                            <span
                              key={industry}
                              className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700"
                            >
                              {industry}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {supplier.verificationStatus === 'verified' ? (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            <CheckCircle className="w-3 h-3" />
                            <span>Đã xác thực</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                            <Clock className="w-3 h-3" />
                            <span>Chờ xác thực</span>
                          </span>
                        )}
                        {supplier.isStrategicPartner && (
                          <div className="mt-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-[11px] font-medium text-purple-700 inline-flex items-center space-x-1">
                            <Briefcase className="w-3 h-3" />
                            <span>Strategic Partner</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex flex-col space-y-1">
                          <span className="inline-flex items-center space-x-1">
                            <Phone className="w-3 h-3 text-blue-500" />
                            <span>{supplier.contactPhone}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1">
                            <Mail className="w-3 h-3 text-blue-500" />
                            <span>{supplier.contactEmail}</span>
                          </span>
                          {supplier.website && (
                            <span className="inline-flex items-center space-x-1">
                              <Globe className="w-3 h-3 text-blue-500" />
                              <span>{supplier.website}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-1">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdateSupplierStatus(supplier.id, 'verified')}
                            className="text-green-600 hover:text-green-900"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleUpdateSupplierStatus(supplier.id, 'pending')}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            Chờ
                          </button>
                        </div>
                        <button
                          onClick={() => handleToggleSupplierStrategic(supplier.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            supplier.isStrategicPartner
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {supplier.isStrategicPartner ? 'Bỏ badge' : 'Gắn badge'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'buyer' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pipeline Buyer Leads</h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {buyerLeads.map((lead) => (
                <div key={lead.id} className="rounded-lg border border-gray-100 p-4 hover:border-blue-200 hover:shadow transition">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{lead.company}</h3>
                      <p className="text-xs text-gray-500">Ngành quan tâm: {lead.industries.join(', ')}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                        lead.stage === 'Đã ký'
                          ? 'bg-green-100 text-green-700'
                          : lead.stage === 'Đàm phán'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {lead.stage}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span>Cơ hội mở: <strong>{lead.opportunities}</strong></span>
                    <span>Lần liên hệ cuối: {lead.lastContact}</span>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    Giá trị pipeline: {(lead.value / 1_000_000).toFixed(1)}M USD
                  </div>
                  <div className="mt-3 text-right">
                    <button className="text-sm text-blue-600 hover:text-blue-700">Xem chi tiết lead →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'investor' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pipeline Nhà đầu tư</h2>
            <div className="space-y-4">
              {investorDeals.map((deal) => (
                <div key={deal.id} className="rounded-lg border border-gray-100 p-4 hover:border-emerald-200 hover:shadow transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{deal.fundName}</h3>
                      <p className="text-xs text-gray-500">Focus: {deal.focus.join(', ')}</p>
                    </div>
                    <span className="text-sm font-semibold text-emerald-600">{deal.budget}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span>Owner: {deal.owner}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                        deal.status === 'Ký NDA'
                          ? 'bg-green-100 text-green-700'
                          : deal.status === 'Hẹn gặp'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {deal.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Quản lý người dùng & phân quyền</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lần đăng nhập gần nhất
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userAccounts.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <UserCircle className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.lastLogin}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.status === 'active' ? (
                          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                            Đã mời
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Content queue</h2>
            <div className="space-y-4">
              {contentQueue.map((item) => (
                <div key={item.id} className="rounded-lg border border-gray-100 p-4 hover:border-amber-200 hover:shadow transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-xs text-gray-500">Loại nội dung: {item.type}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : item.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <span>Owner: {item.owner}</span>
                    {item.scheduledAt && <span>Dự kiến: {item.scheduledAt}</span>}
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button className="rounded bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100">
                      Xem nội dung
                    </button>
                    <button className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200">
                      Phê duyệt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Báo cáo nhanh</h2>
              <p className="text-sm text-gray-500">
                Tóm tắt hoạt động toàn hệ thống trong tuần. Các biểu đồ chi tiết sẽ được kết nối với BI trong giai đoạn tiếp theo.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {dashboardTrends.map((item) => (
                <div key={item.title} className="rounded-lg border border-gray-100 p-4">
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{item.value}</p>
                  <p className="text-xs text-green-600">{item.change}</p>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Biểu đồ phân bổ Verification</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>KCN đã xác thực</span>
                      <span>{stats.verified}</span>
                    </div>
                    <div className="h-2 rounded-full bg-blue-100">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${stats.total ? (stats.verified / stats.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Supplier chiến lược</span>
                      <span>{supplierStatsSnapshot.strategic}</span>
                    </div>
                    <div className="h-2 rounded-full bg-purple-100">
                      <div
                        className="h-2 rounded-full bg-purple-500"
                        style={{ width: `${supplierStatsSnapshot.total ? (supplierStatsSnapshot.strategic / supplierStatsSnapshot.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-gray-100 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Kênh nguồn Leads</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between">
                    <span>Marketplace RFQ</span>
                    <span>45%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Investment Portal</span>
                    <span>35%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sự kiện & hội thảo</span>
                    <span>14%</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Khác</span>
                    <span>6%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

