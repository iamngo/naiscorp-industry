'use client';

import { Factory, Cluster } from '@/types/database';
import { Factory as FactoryIcon, MapPin, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface FactoryClusterMapProps {
  factories: Factory[];
  cluster?: Cluster;
  izName?: string;
}

export default function FactoryClusterMap({ factories, cluster, izName }: FactoryClusterMapProps) {
  // Simplified grid layout for factory lots
  // In real app, this would use actual coordinates and SVG/Canvas
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {cluster ? `Bản đồ Cụm: ${cluster.name}` : 'Bản đồ Nhà máy'}
      </h2>
      {izName && (
        <p className="text-sm text-gray-600 mb-4">Khu công nghiệp: {izName}</p>
      )}
      
      {/* Legend */}
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Nhà máy đã xác thực</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Nhà máy chờ xác thực</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Cụm công nghiệp</span>
        </div>
      </div>

      {/* Factory Grid Layout */}
      <div className="bg-gray-100 rounded-lg p-6" style={{ minHeight: '300px' }}>
        {cluster && (
          <div className="mb-4 p-3 bg-purple-400 rounded-lg border-2 border-purple-600">
            <div className="text-white font-semibold mb-2">{cluster.name}</div>
            <div className="text-white text-xs">
              Diện tích: {cluster.area} ha | {cluster.totalFactories} nhà máy
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {factories.map((factory) => (
            <Link
              key={factory.id}
              href={`/factory/${factory.id}`}
              className={`p-3 rounded-lg border-2 transition-all hover:shadow-lg ${
                factory.verificationStatus === 'verified'
                  ? 'bg-green-500 border-green-600 text-white'
                  : 'bg-yellow-500 border-yellow-600 text-white'
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <FactoryIcon className="w-6 h-6 mb-1" />
                <div className="text-xs font-semibold mb-1">
                  {factory.lotNumber || `F${factory.id.slice(-1)}`}
                </div>
                <div className="text-xs opacity-90 line-clamp-2">
                  {factory.name.substring(0, 20)}...
                </div>
                <div className="mt-2 flex items-center justify-center space-x-1">
                  {factory.verificationStatus === 'verified' && (
                    <CheckCircle className="w-3 h-3" />
                  )}
                  {factory.verificationStatus === 'pending' && (
                    <Clock className="w-3 h-3" />
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-4">
        * Bản đồ layout đơn giản. Trong production sẽ có bản đồ chi tiết với tọa độ và lot numbers thực tế.
      </p>
    </div>
  );
}

