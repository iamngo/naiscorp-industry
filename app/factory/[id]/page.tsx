'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Factory, IndustrialZone, Cluster } from '@/types/database';
import { 
  MapPin, CheckCircle, Leaf, Cpu, Factory as FactoryIcon, Phone, Mail, Globe,
  Video, ArrowLeft, Package, Clock, Building2
} from 'lucide-react';
import Link from 'next/link';
import { getIZById, getClusterById } from '@/lib/mockData';
import FactoryClusterMap from '@/components/FactoryClusterMap';
import ConnectionRequestButton from '@/components/ConnectionRequestButton';

export default function FactoryDetailPage() {
  const params = useParams();
  const factoryId = params.id as string;
  const [factory, setFactory] = useState<Factory | null>(null);
  const [iz, setIZ] = useState<IndustrialZone | null>(null);
  const [cluster, setCluster] = useState<Cluster | null>(null);
  const [relatedFactories, setRelatedFactories] = useState<Factory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchFactory = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/factories/${factoryId}`);
        if (!res.ok) {
          if (isMounted) {
            setFactory(null);
          }
          return;
        }

        const data = await res.json();
        const factoryData: Factory | null = data?.data ?? null;

        if (!isMounted) {
          return;
        }

        if (!factoryData) {
          setFactory(null);
          return;
        }

        setFactory(factoryData);
        const izData = getIZById(factoryData.izId);
        if (izData) {
          setIZ(izData);
        }

        if (factoryData.clusterId) {
          const clusterData = getClusterById(factoryData.clusterId);
          if (clusterData) {
            setCluster(clusterData);
          }
        } else {
          setCluster(null);
        }

        try {
          const relatedResponse = await fetch(`/api/factories?izId=${factoryData.izId}`);
          const relatedJson = await relatedResponse.json();
          const relatedList: Factory[] = Array.isArray(relatedJson?.data) ? relatedJson.data : [];

          const filteredRelated = relatedList.filter((item) => {
            if (item.id === factoryData.id) return false;
            if (factoryData.clusterId) {
              return item.clusterId === factoryData.clusterId;
            }
            return !item.clusterId;
          });

          if (isMounted) {
            setRelatedFactories(filteredRelated);
          }
        } catch {
          if (isMounted) {
            setRelatedFactories([]);
          }
        }
      } catch {
        if (isMounted) {
          setFactory(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFactory();

    return () => {
      isMounted = false;
    };
  }, [factoryId]);

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

  if (!factory) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy nhà máy</h1>
          <Link href="/map" className="text-blue-600 hover:underline">
            Quay lại bản đồ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href={factory.izId ? `/iz/${factory.izId}` : '/map'}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <FactoryIcon className="w-8 h-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">{factory.name}</h1>
              </div>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{factory.address}</span>
                {factory.lotNumber && (
                  <span className="ml-2 text-gray-500">• Lô: {factory.lotNumber}</span>
                )}
              </div>
              {iz && (
                <Link
                  href={`/iz/${iz.id}`}
                  className="flex items-center text-blue-600 hover:text-blue-700 mb-2"
                >
                  <Building2 className="w-4 h-4 mr-1" />
                  <span>{iz.name}</span>
                </Link>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-col items-end space-y-2 ml-4">
              {factory.verificationStatus === 'verified' && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span>Đã xác thực</span>
                </div>
              )}
              {factory.verificationStatus === 'pending' && (
                <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>Chờ xác thực</span>
                </div>
              )}
              {factory.digitalTransformation && (
                <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <Cpu className="w-4 h-4" />
                  <span>Chuyển đổi số</span>
                </div>
              )}
              {factory.esgStatus !== 'none' && (
                <div className={`px-3 py-1 rounded-full border ${getESGColor(factory.esgStatus)}`}>
                  <div className="flex items-center space-x-1">
                    <Leaf className="w-4 h-4" />
                    <span>{getESGLabel(factory.esgStatus)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Connection Button */}
          <ConnectionRequestButton
            targetId={factory.id}
            targetRole="factory"
            targetName={factory.name}
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả</h2>
              <p className="text-gray-700 leading-relaxed">{factory.description}</p>
            </div>

            {/* Video */}
            {factory.videoUrl && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Video xác minh
                </h2>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={factory.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Products */}
            {factory.products && factory.products.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Danh sách hàng hoá / Sản phẩm
                </h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {factory.products.map((product, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{product}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cluster Map */}
            {relatedFactories.length > 0 && (
              <div className="mt-6">
                <FactoryClusterMap
                  factories={relatedFactories}
                  cluster={cluster || undefined}
                  izName={iz?.name}
                />
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin</h2>
              <div className="space-y-4">
                {factory.productionCapacity && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Năng lực sản xuất</div>
                    <div className="font-semibold text-gray-900">{factory.productionCapacity}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-gray-600 mb-1">Ngành nghề</div>
                  <div className="flex flex-wrap gap-2">
                    {factory.industries.map((industry, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
                {factory.products && factory.products.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Số sản phẩm</div>
                    <div className="font-semibold text-gray-900">{factory.products.length} sản phẩm</div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Liên hệ</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <a href={`tel:${factory.contactPhone}`} className="text-blue-600 hover:underline">
                    {factory.contactPhone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <a href={`mailto:${factory.contactEmail}`} className="text-blue-600 hover:underline">
                    {factory.contactEmail}
                  </a>
                </div>
                {factory.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <a href={factory.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {factory.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vị trí</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Vĩ độ: {factory.latitude}</div>
                <div>Kinh độ: {factory.longitude}</div>
                <a
                  href={`https://www.google.com/maps?q=${factory.latitude},${factory.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center space-x-1"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Xem trên Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
