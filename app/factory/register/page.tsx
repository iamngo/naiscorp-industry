'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Factory, IndustrialZone } from '@/types/database';
import { 
  Building2, MapPin, Factory as FactoryIcon, Video, FileText, 
  ArrowLeft, CheckCircle, Clock, Leaf, Cpu, Save
} from 'lucide-react';
import Link from 'next/link';
import { mockIndustrialZones, getClustersByIZId } from '@/lib/mockData';

export default function FactoryRegisterPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const izIdFromQuery = searchParams.get('izId');
  
  const [formData, setFormData] = useState({
    izId: izIdFromQuery || '',
    clusterId: '',
    name: '',
    lotNumber: '',
    address: '',
    latitude: '',
    longitude: '',
    industries: [] as string[],
    description: '',
    videoUrl: '',
    productionCapacity: '',
    products: [] as string[],
    contactEmail: '',
    contactPhone: '',
    website: '',
    esgStatus: 'none' as const,
    digitalTransformation: false,
  });
  
  const [availableIZs] = useState<IndustrialZone[]>(mockIndustrialZones);
  const [availableClusters, setAvailableClusters] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productInput, setProductInput] = useState('');

  const industries = ['Điện tử', 'Cơ khí', 'Dệt may', 'Hóa chất', 'Thực phẩm', 'Vật liệu xây dựng', 'Khác'];
  const esgOptions = [
    { value: 'none', label: 'Không có' },
    { value: 'environmental', label: 'Environmental' },
    { value: 'social', label: 'Social' },
    { value: 'governance', label: 'Governance' },
    { value: 'all', label: 'Tất cả ESG' },
  ];

  useEffect(() => {
    if (formData.izId) {
      const clusters = getClustersByIZId(formData.izId);
      setAvailableClusters(clusters);
    }
  }, [formData.izId]);

  const handleIndustryToggle = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter(i => i !== industry)
        : [...prev.industries, industry],
    }));
  };

  const handleAddProduct = () => {
    if (productInput.trim()) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, productInput.trim()],
      }));
      setProductInput('');
    }
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/factories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude) || 0,
          longitude: parseFloat(formData.longitude) || 0,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Đã đăng ký nhà máy thành công! Hồ sơ đang chờ xác minh. (Mock data)');
        router.push(`/factory/${data.data.id}`);
      } else {
        alert('Có lỗi xảy ra khi đăng ký');
      }
    } catch (error) {
      alert('Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedIZ = availableIZs.find(iz => iz.id === formData.izId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href={formData.izId ? `/iz/${formData.izId}` : '/map'}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <FactoryIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Đăng ký Nhà máy</h1>
              <p className="text-gray-600">Khai báo thông tin nhà máy để được hiển thị trên bản đồ topology</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2" />
              Thông tin cơ bản
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khu công nghiệp * <span className="text-gray-500">(Chọn KCN mà nhà máy thuộc về)</span>
                </label>
                <select
                  value={formData.izId}
                  onChange={(e) => {
                    setFormData({ ...formData, izId: e.target.value, clusterId: '' });
                    setAvailableClusters([]);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Chọn Khu công nghiệp</option>
                  {availableIZs.map((iz) => (
                    <option key={iz.id} value={iz.id}>
                      {iz.name} - {iz.province}
                    </option>
                  ))}
                </select>
              </div>

              {formData.izId && availableClusters.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cụm công nghiệp <span className="text-gray-500">(Optional)</span>
                  </label>
                  <select
                    value={formData.clusterId}
                    onChange={(e) => setFormData({ ...formData, clusterId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Không thuộc cụm nào</option>
                    {availableClusters.map((cluster) => (
                      <option key={cluster.id} value={cluster.id}>
                        {cluster.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên nhà máy *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ví dụ: Nhà máy Sản xuất Linh kiện Điện tử ABC"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lô trong KCN
                  </label>
                  <input
                    type="text"
                    value={formData.lotNumber}
                    onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ví dụ: Lô A-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Địa chỉ nhà máy"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vĩ độ (Latitude) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="10.8930"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kinh độ (Longitude) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="106.7695"
                    required
                  />
                </div>
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
                  placeholder="Mô tả về nhà máy, năng lực sản xuất, sản phẩm..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Industries */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ngành nghề sản xuất *</h2>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => handleIndustryToggle(industry)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    formData.industries.includes(industry)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Danh sách hàng hoá / Sản phẩm</h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={productInput}
                  onChange={(e) => setProductInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddProduct();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tên sản phẩm và nhấn Enter"
                />
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
              {formData.products.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.products.map((product, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {product}
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Production & Contact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Năng lực & Liên hệ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năng lực sản xuất
                </label>
                <input
                  type="text"
                  value={formData.productionCapacity}
                  onChange={(e) => setFormData({ ...formData, productionCapacity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ví dụ: 10 triệu linh kiện/năm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email liên hệ *
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Xác minh
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video xác minh (URL YouTube hoặc Cloudflare Stream)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Upload video hoặc cung cấp link YouTube/Cloudflare Stream để xác minh nhà máy
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái ESG
                </label>
                <select
                  value={formData.esgStatus}
                  onChange={(e) => setFormData({ ...formData, esgStatus: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {esgOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="digitalTransformation"
                  checked={formData.digitalTransformation}
                  onChange={(e) => setFormData({ ...formData, digitalTransformation: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="digitalTransformation" className="ml-2 text-sm font-medium text-gray-700">
                  Chuyển đổi số (Digital Transformation)
                </label>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Gửi yêu cầu xác minh</span>
                </>
              )}
            </button>
            <Link
              href={formData.izId ? `/iz/${formData.izId}` : '/map'}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

