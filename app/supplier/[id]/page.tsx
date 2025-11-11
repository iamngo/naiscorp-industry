'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Award,
  Phone,
  Mail,
  Globe,
  Package,
  Building2,
  Layers,
  MessageSquare,
  Star,
} from 'lucide-react';
import type { Supplier, Product, Service } from '@/types/database';
import {
  getSupplierById,
  getProductsBySupplierId,
  mockServices,
} from '@/lib/mockData';

export default function SupplierProfilePage() {
  const params = useParams();
  const router = useRouter();
  const supplierId = params?.id as string | undefined;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supplierId) {
      return;
    }

    setLoading(true);
    const supplierData = getSupplierById(supplierId) ?? null;
    const supplierProducts = getProductsBySupplierId(supplierId);
    const supplierServices = mockServices.filter((service) => service.supplierId === supplierId);

    setSupplier(supplierData);
    setProducts(supplierProducts);
    setServices(supplierServices);
    setLoading(false);
  }, [supplierId]);

  const uniqueCertifications = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap((product) => product.certifications ?? []),
        ),
      ),
    [products],
  );

  const verifiedProducts = products.filter((product) => product.verificationStatus === 'verified').length;

  const formatPrice = (price: number, unit: string) => {
    const formatted = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);
    return `${formatted}/${unit}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải hồ sơ nhà cung cấp...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Không tìm thấy nhà cung cấp</h1>
          <button
            onClick={() => router.push('/marketplace')}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Marketplace</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại Marketplace
        </Link>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{supplier.companyName}</h1>
                  <p className="text-sm text-gray-500">
                    Nhà cung cấp chiến lược cho hệ sinh thái Vietnam Industrial Supply Chain
                  </p>
                  {supplier.rating && (
                    <div className="mt-2 inline-flex items-center space-x-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>
                        {supplier.rating.toFixed(1)} / 5.0
                        {supplier.reviewCount ? ` • ${supplier.reviewCount} đánh giá` : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {supplier.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    <span>Đã xác thực</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                    <Clock className="w-3 h-3" />
                    <span>Chờ xác thực</span>
                  </span>
                )}
                {supplier.isStrategicPartner && (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    <Layers className="w-3 h-3" />
                    <span>Đối tác chiến lược</span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={() => router.push('/marketplace')}
              >
                <Package className="w-4 h-4" />
                <span>Xem sản phẩm</span>
              </button>
              <button
                className="inline-flex items-center space-x-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-blue-600 hover:border-blue-400 hover:text-blue-700"
                onClick={() => window.location.href = supplier.contactEmail ? `mailto:${supplier.contactEmail}` : 'mailto:contact@naiscorp.vn'}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Trao đổi nhanh</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tổng quan nhà cung cấp</h2>
              <p className="text-sm leading-relaxed text-gray-700 mb-4">{supplier.description}</p>

              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-900 mb-2">Ngành chuyên môn</p>
                  <div className="flex flex-wrap gap-2">
                    {supplier.industries.map((industry) => (
                      <span
                        key={industry}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 mb-2">Dịch vụ cung cấp</p>
                  <div className="flex flex-wrap gap-2">
                    {supplier.services.map((service) => (
                      <span
                        key={service}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                {supplier.regions && supplier.regions.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Khu vực phục vụ</p>
                    <div className="flex flex-wrap gap-2">
                      {supplier.regions.map((region) => (
                        <span
                          key={region}
                          className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {uniqueCertifications.length > 0 && (
                <div className="mt-6">
                  <p className="font-medium text-gray-900 mb-2">Chứng nhận nổi bật</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueCertifications.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center space-x-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                      >
                        <Award className="w-3 h-3" />
                        <span>{cert}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product portfolio */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Danh mục sản phẩm</h2>
                <span className="text-sm text-gray-500">
                  {products.length} sản phẩm • {verifiedProducts} đã xác thực
                </span>
              </div>
              {products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-lg border border-gray-100 p-4 hover:border-blue-200 hover:shadow-md transition"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-xs text-gray-500">Danh mục: {product.category}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-blue-600 font-medium">
                          <span>{formatPrice(product.price, product.unit)}</span>
                          <span className="text-xs text-gray-400">| MOQ: {product.minOrder.toLocaleString()}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{product.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Nhà cung cấp chưa đăng sản phẩm nào.</p>
              )}
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dịch vụ hỗ trợ KCN/Factory</h2>
              {services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="rounded-lg border border-gray-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <span className="text-xs uppercase text-gray-400">{service.serviceType}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                      {service.priceRange && (
                        <div className="text-xs text-blue-600">
                          Giá tham khảo: {(service.priceRange.min / 1_000_000).toFixed(1)}M -{' '}
                          {(service.priceRange.max / 1_000_000).toFixed(1)}M {service.priceRange.unit}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Nhà cung cấp chưa công bố dịch vụ hỗ trợ chính thức. Vui lòng liên hệ để nhận tư vấn chi tiết.
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <a href={`tel:${supplier.contactPhone}`} className="text-blue-600 hover:underline">
                    {supplier.contactPhone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <a href={`mailto:${supplier.contactEmail}`} className="text-blue-600 hover:underline">
                    {supplier.contactEmail}
                  </a>
                </div>
                {supplier.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-500" />
                    <a
                      href={supplier.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {supplier.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chỉ số nhanh</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <span>Sản phẩm đang chào bán</span>
                  <span className="font-semibold text-gray-900">{products.length}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Sản phẩm đã xác thực</span>
                  <span className="font-semibold text-gray-900">{verifiedProducts}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Dịch vụ cung cấp</span>
                  <span className="font-semibold text-gray-900">{services.length}</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-2">Cần kết nối nhanh?</h2>
              <p className="text-sm text-blue-100">
                Đội ngũ tư vấn của chúng tôi sẵn sàng hỗ trợ xây dựng lộ trình hợp tác với nhà cung cấp này.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  className="w-full rounded-lg bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20 transition"
                  onClick={() => window.location.href = 'mailto:connect@naiscorp.vn'}
                >
                  Gửi yêu cầu giới thiệu
                </button>
                <button
                  className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
                  onClick={() => router.push('/investor')}
                >
                  Đặt lịch tư vấn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

