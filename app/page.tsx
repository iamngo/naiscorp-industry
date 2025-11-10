'use client';

import Link from 'next/link';
import { mockIndustrialZones, getVerifiedIZs } from '@/lib/mockData';
import { MapPin, ShoppingBag, Briefcase, Users, CheckCircle, TrendingUp, ArrowRight, Building2, Shield } from 'lucide-react';

export default function Home() {
  const verifiedIZs = getVerifiedIZs().slice(0, 6);
  const totalIZs = mockIndustrialZones.length;
  const verifiedCount = getVerifiedIZs().length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Vietnam Industrial Supply Chain
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Nền tảng số toàn diện kết nối Khu công nghiệp, Supplier, Buyer và Investor
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/map"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <MapPin className="w-5 h-5" />
                <span>Bản đồ Topology</span>
              </Link>
              <Link
                href="/marketplace"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors flex items-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>B2B Marketplace</span>
              </Link>
              <Link
                href="/investor"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Briefcase className="w-5 h-5" />
                <span>Tư vấn Đầu tư</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{totalIZs}+</div>
              <div className="text-gray-600">Khu công nghiệp</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{verifiedCount}</div>
              <div className="text-gray-600">Đã xác thực</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">25K</div>
              <div className="text-gray-600">Khách hàng mục tiêu</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4</div>
              <div className="text-gray-600">Nhóm đối tượng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Các Module Chính
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Industrial Map</h3>
              <p className="text-gray-600">
                Bản đồ topology thể hiện toàn bộ KCN Việt Nam với hệ thống xác minh và tag ESG/DX
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Verification System</h3>
              <p className="text-gray-600">
                Xác minh KCN qua video/chứng từ, gắn tag Verified, ESG, Digital Transformation
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Investment Portal</h3>
              <p className="text-gray-600">
                Chatbot AI tư vấn, đề xuất kế hoạch đầu tư phù hợp dựa trên vốn và ngành nghề
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">B2B Marketplace</h3>
              <p className="text-gray-600">
                Sàn giao dịch công nghiệp với RFQ, thanh toán và phí nền tảng
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Link href="/services" className="block">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Services Hub</h3>
              <p className="text-gray-600">
                Tuyển dụng, đào tạo, CRM/CDP, logistic, năng lượng và các dịch vụ khác
              </p>
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Admin Dashboard</h3>
              <p className="text-gray-600">
                Quản trị, duyệt, thống kê và báo cáo toàn bộ hệ thống
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng tham gia hệ sinh thái?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Đăng ký ngay để kết nối với các đối tác trong chuỗi cung ứng công nghiệp
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/investor"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Tư vấn đầu tư
            </Link>
            <Link
              href="/marketplace"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              Khám phá Marketplace
            </Link>
            <Link
              href="/factory/register"
              className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-400 transition-colors"
            >
              Đăng ký Nhà máy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
