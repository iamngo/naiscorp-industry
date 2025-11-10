'use client';

import { IndustrialZone, Factory, Cluster } from '@/types/database';
import { Building2, Factory as FactoryIcon, MapPin } from 'lucide-react';
import Link from 'next/link';

interface IZLayoutMapProps {
  iz: IndustrialZone;
  factories: Factory[];
  clusters: Cluster[];
}

export default function IZLayoutMap({ iz, factories, clusters }: IZLayoutMapProps) {
  // Simple grid layout representation
  // In real app, this would be an interactive SVG or Canvas map
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Bản đồ Layout KCN</h2>
      <div className="relative bg-gray-100 rounded-lg p-6" style={{ minHeight: '400px' }}>
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-4 z-10">
          <h3 className="font-semibold text-sm mb-2">Chú thích</h3>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Khu công nghiệp</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Cụm công nghiệp</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Nhà máy (Verified)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Nhà máy (Pending)</span>
            </div>
          </div>
        </div>

        {/* Simplified Grid Layout */}
        <div className="grid grid-cols-4 gap-4">
          {/* IZ Center */}
          <div className="col-span-2 row-span-2 bg-blue-500 rounded-lg p-4 flex items-center justify-center text-white font-semibold">
            <div className="text-center">
              <Building2 className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">{iz.name}</div>
            </div>
          </div>

          {/* Clusters */}
          {clusters.map((cluster, idx) => (
            <div
              key={cluster.id}
              className="bg-purple-400 rounded-lg p-3 border-2 border-purple-600"
            >
              <div className="text-white text-xs font-semibold mb-2">{cluster.name}</div>
              <div className="grid grid-cols-2 gap-1">
                {factories
                  .filter(f => f.clusterId === cluster.id)
                  .slice(0, 4)
                  .map((factory) => (
                    <Link
                      key={factory.id}
                      href={`/factory/${factory.id}`}
                      className={`p-2 rounded text-xs text-white text-center ${
                        factory.verificationStatus === 'verified' ? 'bg-green-600' : 'bg-yellow-600'
                      } hover:opacity-80`}
                      title={factory.name}
                    >
                      <FactoryIcon className="w-3 h-3 mx-auto mb-1" />
                      {factory.lotNumber || `F${idx + 1}`}
                    </Link>
                  ))}
              </div>
            </div>
          ))}

          {/* Factories without cluster */}
          {factories
            .filter(f => !f.clusterId || !clusters.find(c => c.id === f.clusterId))
            .slice(0, 4)
            .map((factory) => (
              <Link
                key={factory.id}
                href={`/factory/${factory.id}`}
                className={`p-3 rounded-lg text-center ${
                  factory.verificationStatus === 'verified' ? 'bg-green-500' : 'bg-yellow-500'
                } text-white hover:opacity-80`}
              >
                <FactoryIcon className="w-4 h-4 mx-auto mb-1" />
                <div className="text-xs font-semibold">{factory.lotNumber || 'Factory'}</div>
                <div className="text-xs opacity-80">{factory.name.substring(0, 15)}...</div>
              </Link>
            ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        * Bản đồ layout đơn giản. Trong production sẽ có bản đồ chi tiết với tọa độ thực tế.
      </p>
    </div>
  );
}

