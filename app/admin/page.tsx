'use client';

import { useState, useEffect } from 'react';
import { mockIndustrialZones, getVerifiedIZs, mockFactories, mockProducts, mockServices } from '@/lib/mockData';
import { Shield, CheckCircle, Clock, X, TrendingUp, Users, Building2, BarChart3, Filter, Factory as FactoryIcon, Package, Briefcase } from 'lucide-react';
import { IndustrialZone, Factory, Product, Service } from '@/types/database';

export default function AdminDashboard() {
  const [izs, setIZs] = useState<IndustrialZone[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [activeTab, setActiveTab] = useState<'iz' | 'factory' | 'services' | 'products'>('iz');

  useEffect(() => {
    fetch('/api/industrial-zones')
      .then(res => res.json())
      .then(data => {
        setIZs(data.data || []);
      })
      .catch(() => {});

    // Load factories
    fetch('/api/factories')
      .then(res => res.json())
      .then(data => {
        setFactories(data.data || []);
      })
      .catch(() => {});

    // Load products
    setProducts(mockProducts);

    // Load services
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.data || []);
      })
      .catch(() => {
        setServices(mockServices);
      });

    setLoading(false);
  }, []);

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
        setIZs(izs.map(iz => iz.id === izId ? data.data : iz));
        alert(`Đã ${status === 'verified' ? 'xác thực' : 'từ chối'} khu công nghiệp (mock data)`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const handleVerifyFactory = async (factoryId: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/factories/${factoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationStatus: status,
          verifiedAt: status === 'verified' ? new Date().toISOString() : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFactories(factories.map(f => f.id === factoryId ? data.data : f));
        alert(`Đã ${status === 'verified' ? 'xác thực' : 'từ chối'} nhà máy (mock data)`);
      }
    } catch (error) {
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
    } catch (error) {
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
        setServices(services.map(s => s.id === serviceId ? data.data : s));
        alert(`Đã ${status === 'verified' ? 'xác thực' : 'từ chối'} dịch vụ (mock data)`);
      }
    } catch (error) {
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
        setServices(services.map(s => s.id === serviceId ? data.data : s));
      }
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
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
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex space-x-4">
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

        {/* Filter */}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {iz.esgStatus !== 'none' ? (
                            <span className="text-sm text-green-600">✓</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {iz.digitalTransformation ? (
                            <span className="text-sm text-blue-600">✓</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {factory.esgStatus !== 'none' ? (
                            <span className="text-sm text-green-600">✓</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {factory.digitalTransformation ? (
                            <span className="text-sm text-blue-600">✓</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
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
      </div>
    </div>
  );
}

