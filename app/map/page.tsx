'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Search, Filter, MapPin, CheckCircle, Clock, Factory as FactoryIcon, Plus, Layers, ZoomIn, ZoomOut, Network, Building2 } from 'lucide-react';
import IZCard from '@/components/IZCard';
import { IndustrialZone, Factory, Cluster, Region, TopologyLevel } from '@/types/database';
import { getFactoriesByIZId, mockFactories, mockClusters, mockRegions } from '@/lib/mockData';
import Link from 'next/link';

// Dynamic import để tránh SSR issues với Leaflet
const TopologyMapComponent = dynamic(() => import('@/components/TopologyMapComponent'), {
  ssr: false,
});

export default function MapPage() {
  const [izs, setIZs] = useState<IndustrialZone[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [regions] = useState<Region[]>(mockRegions);
  const [selectedIZ, setSelectedIZ] = useState<string | null>(null);
  const [selectedFactory, setSelectedFactory] = useState<string | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [topologyLevel, setTopologyLevel] = useState<TopologyLevel>('region');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [selectedESG, setSelectedESG] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showFlowLines, setShowFlowLines] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch IZs from API
    fetch('/api/industrial-zones')
      .then(res => res.json())
      .then(data => {
        setIZs(data.data || []);
        
        // Load all factories
        setFactories(mockFactories);
        
        // Load all clusters
        setClusters(mockClusters);
        
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Get unique provinces
  const provinces = Array.from(new Set(izs.map(iz => iz.province)));

  // Filter IZs
  const filteredIZs = izs.filter(iz => {
    const matchesSearch = iz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iz.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iz.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      iz.industries.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesProvince = selectedProvince === 'all' || iz.province === selectedProvince;
    
    const matchesVerification = selectedVerification === 'all' || 
      (selectedVerification === 'verified' && iz.verificationStatus === 'verified') ||
      (selectedVerification === 'pending' && iz.verificationStatus === 'pending');

    const matchesESG = selectedESG === 'all' || 
      (selectedESG !== 'none' && (iz.esgStatus === selectedESG || iz.esgStatus === 'all'));

    const matchesRegion = selectedRegion === 'all' || iz.regionId === selectedRegion;

    return matchesSearch && matchesProvince && matchesVerification && matchesESG && matchesRegion;
  });

  const handleIZSelect = (id: string) => {
    setSelectedIZ(id);
    setSelectedFactory(null);
    setSelectedCluster(null);
    if (topologyLevel === 'region') {
      setTopologyLevel('iz');
    }
  };

  const handleFactorySelect = (id: string) => {
    setSelectedFactory(id);
    const factory = factories.find(f => f.id === id);
    if (factory) {
      setSelectedIZ(factory.izId);
    }
  };

  const handleClusterSelect = (id: string) => {
    setSelectedCluster(id);
    const cluster = clusters.find(c => c.id === id);
    if (cluster) {
      setSelectedIZ(cluster.izId);
      setTopologyLevel('cluster');
    }
  };

  const handleLevelChange = (level: TopologyLevel) => {
    setTopologyLevel(level);
    if (level === 'region') {
      setSelectedIZ(null);
      setSelectedFactory(null);
      setSelectedCluster(null);
    } else if (level === 'iz') {
      setSelectedFactory(null);
      setSelectedCluster(null);
    } else if (level === 'cluster') {
      setSelectedFactory(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bản đồ Topology Khu Công Nghiệp Việt Nam
              </h1>
              <p className="text-gray-600">
                Khám phá các khu công nghiệp trên bản đồ topology, tìm kiếm nguồn cung cầu xung quanh
              </p>
            </div>
            <div className="flex space-x-2">
              <Link
                href="/iz/register"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Đăng ký KCN</span>
              </Link>
              <Link
                href="/factory/register"
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FactoryIcon className="w-5 h-5" />
                <span>Đăng ký Nhà máy</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Topology Level Selector */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Cấp độ bản đồ:</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleLevelChange('region')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  topologyLevel === 'region'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Cấp 1: Vùng miền</span>
              </button>
              <button
                onClick={() => handleLevelChange('iz')}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  topologyLevel === 'iz'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Cấp 2: KCN</span>
              </button>
              <button
                onClick={() => {
                  if (selectedIZ) {
                    handleLevelChange('cluster');
                  } else {
                    alert('Vui lòng chọn một KCN trước');
                  }
                }}
                disabled={!selectedIZ}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  topologyLevel === 'cluster'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${!selectedIZ ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Layers className="w-4 h-4" />
                <span>Cấp 3: Cụm</span>
              </button>
              <button
                onClick={() => {
                  if (selectedFactory) {
                    handleLevelChange('factory');
                  } else {
                    alert('Vui lòng chọn một nhà máy trước');
                  }
                }}
                disabled={!selectedFactory}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  topologyLevel === 'factory'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${!selectedFactory ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FactoryIcon className="w-4 h-4" />
                <span>Cấp 4: Nhà máy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm khu công nghiệp..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Province Filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tất cả tỉnh/thành</option>
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedVerification}
                onChange={(e) => setSelectedVerification(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="verified">Đã xác thực</option>
                <option value="pending">Chờ xác thực</option>
              </select>
            </div>

            {/* ESG Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedESG}
                onChange={(e) => setSelectedESG(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Tất cả ESG</option>
                <option value="none">Không có ESG</option>
                <option value="environmental">Environmental</option>
                <option value="social">Social</option>
                <option value="governance">Governance</option>
                <option value="all">Tất cả ESG</option>
              </select>
            </div>

            {/* Region Filter */}
            {topologyLevel === 'region' && (
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Tất cả vùng miền</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Show Flow Lines Toggle */}
            <div className="relative flex items-center">
              <button
                type="button"
                onClick={() => setShowFlowLines(!showFlowLines)}
                className={`w-full px-4 py-2 rounded-lg border transition-colors flex items-center justify-center space-x-2 ${
                  showFlowLines
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
                }`}
              >
                <Network className="w-4 h-4" />
                <span>{showFlowLines ? 'Ẩn' : 'Hiện'} Tuyến đường</span>
              </button>
            </div>
          </div>
        </div>

        {/* Map and List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '600px' }}>
            <TopologyMapComponent
              izs={filteredIZs}
              factories={factories}
              clusters={clusters}
              regions={regions}
              selectedIZ={selectedIZ}
              selectedFactory={selectedFactory}
              selectedCluster={selectedCluster}
              level={topologyLevel}
              onIZSelect={handleIZSelect}
              onFactorySelect={handleFactorySelect}
              onClusterSelect={handleClusterSelect}
              onLevelChange={handleLevelChange}
              showFlowLines={showFlowLines}
            />
          </div>

          {/* IZ List */}
          <div className="space-y-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <div className="text-sm text-gray-600 mb-2 flex items-center justify-between">
              <span>
                Tìm thấy {filteredIZs.length} khu công nghiệp
                {topologyLevel === 'cluster' || topologyLevel === 'factory' ? `, ${factories.filter(f => !selectedIZ || f.izId === selectedIZ).length} nhà máy` : ''}
                {topologyLevel === 'region' && ` (${regions.length} vùng miền)`}
              </span>
              <div className="flex items-center space-x-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Đã xác thực</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Chờ xác thực</span>
                </div>
                {(topologyLevel === 'factory' || topologyLevel === 'cluster') && (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Nhà máy</span>
                  </div>
                )}
              </div>
            </div>
            {filteredIZs.length > 0 ? (
              filteredIZs.map((iz) => (
                <div
                  key={iz.id}
                  onClick={() => setSelectedIZ(iz.id)}
                  className={`cursor-pointer transition-all ${
                    selectedIZ === iz.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <IZCard iz={iz} />
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                Không tìm thấy khu công nghiệp nào
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

