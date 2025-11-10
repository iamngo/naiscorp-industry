'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { IndustrialZone, Factory, Cluster } from '@/types/database';
import { 
  MapPin, CheckCircle, Leaf, Cpu, Building2, Users, Phone, Mail, Globe,
  Calendar, Video, ArrowLeft, Edit, Trash2, Plus, Clock, Shield, Factory as FactoryIcon, Package, Link as LinkIcon
} from 'lucide-react';
import Link from 'next/link';
import { getFactoriesByIZId, getClustersByIZId } from '@/lib/mockData';
import ConnectionRequestButton from '@/components/ConnectionRequestButton';
import IZLayoutMap from '@/components/IZLayoutMap';

export default function IZDetailPage() {
  const params = useParams();
  const router = useRouter();
  const izId = params.id as string;
  const [iz, setIZ] = useState<IndustrialZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<IndustrialZone> | null>(null);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);

  useEffect(() => {
    fetch(`/api/industrial-zones/${izId}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setIZ(data.data);
          setEditData(data.data);
          
          // Load factories and clusters
          const izFactories = getFactoriesByIZId(izId);
          const izClusters = getClustersByIZId(izId);
          setFactories(izFactories);
          setClusters(izClusters);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [izId]);

  const handleSave = async () => {
    if (!editData) return;
    
    try {
      const res = await fetch(`/api/industrial-zones/${izId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        const data = await res.json();
        setIZ(data.data);
        setIsEditing(false);
        alert('Đã lưu thay đổi (mock data)');
      }
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xóa khu công nghiệp này?')) return;

    try {
      const res = await fetch(`/api/industrial-zones/${izId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        alert('Đã xóa (mock data)');
        router.push('/map');
      }
    } catch (error) {
      alert('Có lỗi xảy ra');
    }
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

  if (!iz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy khu công nghiệp</h1>
          <Link href="/map" className="text-blue-600 hover:underline">
            Quay lại bản đồ
          </Link>
        </div>
      </div>
    );
  }

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
        return 'ESG';
      case 'environmental':
        return 'Environmental';
      case 'social':
        return 'Social';
      case 'governance':
        return 'Governance';
      default:
        return '';
    }
  };

  const displayData = isEditing && editData ? { ...iz, ...editData } : iz;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/map"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại bản đồ
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData?.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="text-3xl font-bold text-gray-900 w-full border border-gray-300 rounded px-3 py-2 mb-2"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayData.name}</h1>
              )}
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{displayData.address}, {displayData.district}, {displayData.province}</span>
              </div>
              {displayData.owner && (
                <p className="text-gray-600 mb-2">Chủ đầu tư: {displayData.owner}</p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end space-y-2 ml-4">
              {displayData.verificationStatus === 'verified' && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span>Đã xác thực</span>
                </div>
              )}
              {displayData.verificationStatus === 'pending' && (
                <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>Chờ xác thực</span>
                </div>
              )}
              {displayData.digitalTransformation && (
                <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <Cpu className="w-4 h-4" />
                  <span>Chuyển đổi số</span>
                </div>
              )}
              {displayData.esgStatus !== 'none' && (
                <div className={`px-3 py-1 rounded-full border ${getESGColor(displayData.esgStatus)}`}>
                  <div className="flex items-center space-x-1">
                    <Leaf className="w-4 h-4" />
                    <span>{getESGLabel(displayData.esgStatus)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <ConnectionRequestButton
              targetId={iz.userId}
              targetRole="iz"
              targetName={iz.name}
            />
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData(iz);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Hủy
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả</h2>
              {isEditing ? (
                <textarea
                  value={editData?.description || ''}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 min-h-[100px]"
                  rows={4}
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{displayData.description}</p>
              )}
            </div>

            {/* Video */}
            {displayData.videoUrl && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Video xác minh
                </h2>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={displayData.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Thống kê</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Công ty</span>
                  </div>
                  <span className="font-semibold text-gray-900">{displayData.totalCompanies}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">Lao động</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {displayData.totalEmployees.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Diện tích</span>
                  <span className="font-semibold text-gray-900">{displayData.area} ha</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Thành lập</span>
                  <span className="font-semibold text-gray-900">{displayData.establishedYear}</span>
                </div>
              </div>
            </div>

            {/* Industries */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ngành nghề</h2>
              <div className="flex flex-wrap gap-2">
                {displayData.industries.map((industry, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tiện ích</h2>
              <div className="flex flex-wrap gap-2">
                {displayData.facilities.map((facility, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Liên hệ</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <a href={`tel:${displayData.contactPhone}`} className="text-blue-600 hover:underline">
                    {displayData.contactPhone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <a href={`mailto:${displayData.contactEmail}`} className="text-blue-600 hover:underline">
                    {displayData.contactEmail}
                  </a>
                </div>
                {displayData.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <a href={displayData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {displayData.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Layout Map Section */}
          {iz && (
            <div className="mt-6">
              <IZLayoutMap iz={iz} factories={factories} clusters={clusters} />
            </div>
          )}

          {/* Clusters Section */}
          {clusters.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cụm Công nghiệp</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {clusters.map((cluster) => (
                  <div key={cluster.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{cluster.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{cluster.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {cluster.totalFactories} nhà máy
                      </span>
                      <span className="text-gray-600">
                        {cluster.area} ha
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cluster.industries.map((industry, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Factories Section */}
          {factories.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Nhà máy</h2>
                <Link
                  href={`/factory/register?izId=${izId}`}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Đăng ký nhà máy</span>
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {factories.map((factory) => (
                  <Link
                    key={factory.id}
                    href={`/factory/${factory.id}`}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <FactoryIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{factory.name}</h3>
                      </div>
                      {factory.verificationStatus === 'verified' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    {factory.lotNumber && (
                      <p className="text-sm text-gray-600 mb-2">Lô: {factory.lotNumber}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{factory.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {factory.industries.map((industry, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                    {factory.products && factory.products.length > 0 && (
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <Package className="w-3 h-3 mr-1" />
                        <span>{factory.products.length} sản phẩm</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

