'use client';

import { useState, useEffect } from 'react';
import { Service, ServiceType } from '@/types/database';
import { Search, Filter, Plus, Briefcase, Users, Truck, Zap, GraduationCap, Building2, Mail, Phone, CheckCircle, Clock, X } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    // Fetch services from API (mock for now)
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const serviceTypes: { value: ServiceType; label: string; icon: any }[] = [
    { value: 'recruitment', label: 'Tuyển dụng', icon: Users },
    { value: 'training', label: 'Đào tạo', icon: GraduationCap },
    { value: 'logistics', label: 'Logistics', icon: Truck },
    { value: 'energy', label: 'Năng lượng', icon: Zap },
    { value: 'crm', label: 'CRM', icon: Building2 },
    { value: 'cdp', label: 'CDP', icon: Building2 },
    { value: 'event', label: 'Sự kiện', icon: Briefcase },
    { value: 'consumables', label: 'Vật tư tiêu hao', icon: Briefcase },
    { value: 'other', label: 'Khác', icon: Briefcase },
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || service.serviceType === selectedType;

    return matchesSearch && matchesType;
  });

  const getServiceTypeLabel = (type: ServiceType): string => {
    return serviceTypes.find(st => st.value === type)?.label || type;
  };

  const formatPrice = (min: number, max: number, unit: string) => {
    if (min === max) {
      return `${(min / 1000000).toFixed(1)}M ${unit}`;
    }
    return `${(min / 1000000).toFixed(1)}M - ${(max / 1000000).toFixed(1)}M ${unit}`;
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
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Industrial Services Hub
            </h1>
            <button
              onClick={() => setShowRegisterModal(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Đăng ký dịch vụ</span>
            </button>
          </div>
          <p className="text-gray-600">
            Tìm kiếm và đăng ký các dịch vụ công nghiệp: Tuyển dụng, Đào tạo, Logistics, Năng lượng, CRM/CDP và nhiều hơn nữa
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm dịch vụ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Service Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tất cả loại dịch vụ</option>
                {serviceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-sm text-gray-600">
          Tìm thấy {filteredServices.length} dịch vụ
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const TypeIcon = serviceTypes.find(st => st.value === service.serviceType)?.icon || Briefcase;
              
              return (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden flex flex-col"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {service.verificationStatus === 'verified' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Đã xác thực
                          </span>
                        )}
                        {service.verificationStatus === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Chờ xác thực
                          </span>
                        )}
                        {service.isStrategicPartner && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Đối tác chiến lược
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{service.title}</h3>
                    
                    {/* Type */}
                    <div className="mb-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {getServiceTypeLabel(service.serviceType)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                      {service.description}
                    </p>

                    {/* Price */}
                    {service.priceRange && (
                      <div className="mb-4 pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Giá:</div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(service.priceRange.min, service.priceRange.max, service.priceRange.unit)}
                        </div>
                      </div>
                    )}

                    {/* IZ Count */}
                    {service.izIds && service.izIds.length > 0 && (
                      <div className="text-xs text-gray-500 mb-4">
                        Đang phục vụ {service.izIds.length} khu công nghiệp
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <button
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Liên hệ
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Không tìm thấy dịch vụ nào</p>
            <p className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}

        {/* Register Service Modal */}
        {showRegisterModal && (
          <RegisterServiceModal
            onClose={() => setShowRegisterModal(false)}
            onSuccess={() => {
              setShowRegisterModal(false);
              // Refresh services
              fetch('/api/services')
                .then(res => res.json())
                .then(data => setServices(data.data || []));
            }}
          />
        )}
      </div>
    </div>
  );
}

// Register Service Modal Component
function RegisterServiceModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    serviceType: 'recruitment' as ServiceType,
    title: '',
    description: '',
    priceMin: '',
    priceMax: '',
    priceUnit: 'dự án',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock API call
    setTimeout(() => {
      alert('Đã đăng ký dịch vụ thành công! (Mock data)');
      setIsSubmitting(false);
      onSuccess();
    }, 1000);
  };

  const serviceTypes: { value: ServiceType; label: string }[] = [
    { value: 'recruitment', label: 'Tuyển dụng' },
    { value: 'training', label: 'Đào tạo' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'energy', label: 'Năng lượng' },
    { value: 'crm', label: 'CRM' },
    { value: 'cdp', label: 'CDP' },
    { value: 'event', label: 'Sự kiện' },
    { value: 'consumables', label: 'Vật tư tiêu hao' },
    { value: 'other', label: 'Khác' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Đăng ký Dịch vụ Công nghiệp</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại dịch vụ *
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as ServiceType })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {serviceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên dịch vụ *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ví dụ: Dịch vụ Tuyển dụng Lao động"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mô tả chi tiết về dịch vụ..."
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá tối thiểu (VND)
              </label>
              <input
                type="number"
                value={formData.priceMin}
                onChange={(e) => setFormData({ ...formData, priceMin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="500000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá tối đa (VND)
              </label>
              <input
                type="number"
                value={formData.priceMax}
                onChange={(e) => setFormData({ ...formData, priceMax: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị
              </label>
              <input
                type="text"
                value={formData.priceUnit}
                onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="dự án"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

