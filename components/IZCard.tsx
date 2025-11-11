'use client';

import Link from 'next/link';
import { IndustrialZone } from '@/types/database';
import { MapPin, CheckCircle, Leaf, Cpu, Building2, Users, Clock } from 'lucide-react';

interface IZCardProps {
  iz: IndustrialZone;
  language?: 'vi' | 'en';
}

export default function IZCard({ iz, language = 'vi' }: IZCardProps) {
  const t = (vi: string, en: string) => (language === 'vi' ? vi : en);

  const getESGColor = (status: string) => {
    switch (status) {
      case 'all':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'environmental':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'social':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'governance':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return '';
    }
  };

  const getESGLabel = (status: string) => {
    switch (status) {
      case 'all':
        return t('ESG', 'ESG');
      case 'environmental':
        return t('E', 'E');
      case 'social':
        return t('S', 'S');
      case 'governance':
        return t('G', 'G');
      default:
        return '';
    }
  };

  return (
    <Link href={`/iz/${iz.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 border border-gray-200 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{iz.name}</h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{iz.district}, {iz.province}</span>
            </div>
            {iz.owner && (
              <p className="text-xs text-gray-500 mb-2">{t('Chủ đầu tư', 'Developer')}: {iz.owner}</p>
            )}
          </div>
          
          {/* Badges */}
          <div className="flex flex-col items-end space-y-1">
            {iz.verificationStatus === 'verified' && (
              <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                <CheckCircle className="w-3 h-3" />
                <span>{t('Đã xác thực', 'Verified')}</span>
              </div>
            )}
            {iz.verificationStatus === 'pending' && (
              <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                <Clock className="w-3 h-3" />
                <span>{t('Chờ xác thực', 'Pending')}</span>
              </div>
            )}
            {iz.digitalTransformation && (
              <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                <Cpu className="w-3 h-3" />
                <span>{t('Chuyển đổi số', 'Digital Transformation')}</span>
              </div>
            )}
            {iz.esgStatus !== 'none' && (
              <div className={`px-2 py-1 rounded-full border text-xs ${getESGColor(iz.esgStatus)}`}>
                <div className="flex items-center space-x-1">
                  <Leaf className="w-3 h-3" />
                  <span>{getESGLabel(iz.esgStatus)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Industries */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {iz.industries.slice(0, 3).map((industry, idx) => (
              <span
                key={idx}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {industry}
              </span>
            ))}
            {iz.industries.length > 3 && (
              <span className="text-gray-500 text-xs">+{iz.industries.length - 3}</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">{t('Công ty', 'Companies')}</div>
              <div className="text-sm font-semibold text-gray-900">{iz.totalCompanies}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">{t('Lao động', 'Employees')}</div>
              <div className="text-sm font-semibold text-gray-900">
                {(iz.totalEmployees / 1000).toFixed(1)}k
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

