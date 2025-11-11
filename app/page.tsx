'use client';

import Link from 'next/link';
import { mockIndustrialZones, getVerifiedIZs } from '@/lib/mockData';
import { MapPin, ShoppingBag, Briefcase, Users, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const verifiedIZs = getVerifiedIZs().slice(0, 6);
  const totalIZs = mockIndustrialZones.length;
  const verifiedCount = getVerifiedIZs().length;
  const { language } = useLanguage();
  const t = (vi: string, en: string) => (language === 'vi' ? vi : en);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('Vietnam Industrial Supply Chain', 'Vietnam Industrial Supply Chain')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {t(
                'Nền tảng số toàn diện kết nối Khu công nghiệp, Supplier, Buyer và Investor',
                'Digital platform connecting Industrial Zones, Suppliers, Buyers and Investors',
              )}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/map"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <MapPin className="w-5 h-5" />
                <span>{t('Bản đồ Topology', 'Topology map')}</span>
              </Link>
              <Link
                href="/marketplace"
                className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors flex items-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{t('B2B Marketplace', 'B2B Marketplace')}</span>
              </Link>
              <Link
                href="/investor"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Briefcase className="w-5 h-5" />
                <span>{t('Tư vấn Đầu tư', 'Investment advisory')}</span>
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
              <div className="text-gray-600">{t('Khu công nghiệp', 'Industrial zones')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{verifiedCount}</div>
              <div className="text-gray-600">{t('Đã xác thực', 'Verified')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">25K</div>
              <div className="text-gray-600">{t('Khách hàng mục tiêu', 'Target buyers')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4</div>
              <div className="text-gray-600">{t('Nhóm đối tượng', 'Key user groups')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {t('Nền tảng phục vụ hệ sinh thái công nghiệp', 'Platform modules for the industrial ecosystem')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('Bản đồ topology', 'Industrial topology map')}
              </h3>
              <p className="text-gray-600">
                {t(
                  'Hiển thị toàn bộ mạng lưới KCN Việt Nam, tích hợp xác minh và tag ESG/DX',
                  'Visualise the national IZ network with verification and ESG/DX tagging',
                )}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('Hệ thống xác minh', 'Verification system')}
              </h3>
              <p className="text-gray-600">
                {t(
                  'Xác minh KCN bằng video/chứng từ, gắn tag Verified/ESG/Chuyển đổi số',
                  'Verify IZ via media evidence and tag them as Verified/ESG/Digital Transformation',
                )}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('Portal đầu tư', 'Investment portal')}
              </h3>
              <p className="text-gray-600">
                {t(
                  'Chatbot AI hỗ trợ lập kế hoạch đầu tư theo ngân sách và ngành trọng điểm',
                  'AI advisor that generates investment plans based on budget and key industries',
                )}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('Sàn giao dịch B2B', 'B2B marketplace')}
              </h3>
              <p className="text-gray-600">
                {t(
                  'RFQ, thanh toán, quản lý hợp đồng và phí nền tảng cho doanh nghiệp công nghiệp',
                  'Industrial RFQ, payment, contract and platform fee management',
                )}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('Trung tâm dịch vụ', 'Services hub')}
              </h3>
              <p className="text-gray-600">
                {t(
                  'Tuyển dụng, đào tạo, CRM/CDP, logistics, năng lượng và các dịch vụ hỗ trợ doanh nghiệp',
                  'Recruitment, training, CRM/CDP, logistics, energy and other enterprise services',
                )}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                {t('Trung tâm quản trị', 'Admin dashboard')}
              </h3>
              <p className="text-gray-600">
                {t(
                  'Quản trị, phê duyệt, thống kê và báo cáo cho toàn bộ hệ thống',
                  'Central admin for approvals, analytics and reporting',
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('Sẵn sàng tham gia hệ sinh thái?', 'Ready to join the ecosystem?')}
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            {t(
              'Đăng ký ngay để kết nối với các đối tác trong chuỗi cung ứng công nghiệp',
              'Register now to connect with partners across the industrial supply chain',
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/investor"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              {t('Tư vấn đầu tư', 'Investment advisory')}
            </Link>
            <Link
              href="/marketplace"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors"
            >
              {t('Khám phá Marketplace', 'Explore marketplace')}
            </Link>
            <Link
              href="/factory/register"
              className="bg-purple-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-400 transition-colors"
            >
              {t('Đăng ký Nhà máy', 'Register factory')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
