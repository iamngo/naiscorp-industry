'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polygon, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { IndustrialZone, Factory, Cluster, Region, TopologyLevel } from '@/types/database';
import { MapPin, CheckCircle, Leaf, Cpu, Factory as FactoryIcon, Building2, Users } from 'lucide-react';
import Link from 'next/link';
import { mockRegions, getFactoriesByIZId, getClustersByIZId } from '@/lib/mockData';

// Load Leaflet CSS
if (typeof window !== 'undefined') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  if (!document.querySelector(`link[href="${link.href}"]`)) {
    document.head.appendChild(link);
  }
}

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface TopologyMapComponentProps {
  izs: IndustrialZone[];
  factories?: Factory[];
  clusters?: Cluster[];
  regions?: Region[];
  selectedIZ: string | null;
  selectedFactory?: string | null;
  selectedCluster?: string | null;
  level: TopologyLevel;
  onIZSelect: (id: string) => void;
  onFactorySelect?: (id: string) => void;
  onClusterSelect?: (id: string) => void;
  onLevelChange?: (level: TopologyLevel) => void;
  showFlowLines?: boolean;
}

// Region boundaries (simplified - Miền Bắc, Trung, Nam)
const regionBoundaries: Record<string, [number, number][]> = {
  'region-1': [ // Miền Bắc
    [23.0, 102.0],
    [23.0, 107.0],
    [20.0, 107.0],
    [20.0, 102.0],
  ],
  'region-2': [ // Miền Trung
    [20.0, 102.0],
    [20.0, 109.0],
    [15.0, 109.0],
    [15.0, 102.0],
  ],
  'region-3': [ // Miền Nam
    [15.0, 102.0],
    [15.0, 110.0],
    [8.0, 110.0],
    [8.0, 102.0],
  ],
};

function MapController({ 
  selectedIZ, 
  izs, 
  selectedFactory, 
  factories,
  level
}: { 
  selectedIZ: string | null; 
  izs: IndustrialZone[];
  selectedFactory?: string | null;
  factories?: Factory[];
  level: TopologyLevel;
}) {
  const map = useMap();
  
  useEffect(() => {
    if (level === 'factory' && selectedFactory && factories) {
      const factory = factories.find(f => f.id === selectedFactory);
      if (factory) {
        map.setView([factory.latitude, factory.longitude], 15);
      }
    } else if (level === 'cluster' && selectedIZ) {
      const iz = izs.find(i => i.id === selectedIZ);
      if (iz) {
        map.setView([iz.latitude, iz.longitude], 12);
      }
    } else if (level === 'iz' && selectedIZ) {
      const iz = izs.find(i => i.id === selectedIZ);
      if (iz) {
        map.setView([iz.latitude, iz.longitude], 13);
      }
    } else if (level === 'region') {
      // Fit to Vietnam
      map.setView([16.0, 106.0], 6);
    } else if (izs.length > 0) {
      // Fit bounds to show all IZs
      const bounds = izs.map(iz => [iz.latitude, iz.longitude] as [number, number]);
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [selectedIZ, selectedFactory, izs, factories, level, map]);

  return null;
}

export default function TopologyMapComponent(props: TopologyMapComponentProps) {
  const {
    izs,
    factories = [],
    clusters = [],
    regions = mockRegions,
    selectedIZ,
    selectedFactory,
    selectedCluster,
    level,
    onIZSelect,
    onFactorySelect,
    onClusterSelect,
    onLevelChange,
    showFlowLines = false,
  } = props;

  const defaultCenter: [number, number] = [16.0, 106.0];
  const defaultZoom = level === 'region' ? 6 : level === 'iz' ? 7 : level === 'cluster' ? 12 : 15;

  const getESGLabel = (status: string) => {
    switch (status) {
      case 'all': return 'ESG';
      case 'environmental': return 'E';
      case 'social': return 'S';
      case 'governance': return 'G';
      default: return '';
    }
  };

  // Create custom icon for IZ
  const createCustomIcon = (iz: IndustrialZone) => {
    const isSelected = selectedIZ === iz.id;
    const isVerified = iz.verificationStatus === 'verified';
    const color = isSelected ? '#3B82F6' : isVerified ? '#10B981' : '#F59E0B';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: ${isSelected ? '35px' : '30px'};
          height: ${isSelected ? '35px' : '30px'};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <div style="
            transform: rotate(45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: white;
            font-weight: bold;
            font-size: ${isSelected ? '14px' : '12px'};
          ">IZ</div>
        </div>
      `,
      iconSize: isSelected ? [35, 35] : [30, 30],
      iconAnchor: isSelected ? [17.5, 35] : [15, 30],
    });
  };

  // Create custom icon for Factory
  const createFactoryIcon = (factory: Factory) => {
    const isSelected = selectedFactory === factory.id;
    const isVerified = factory.verificationStatus === 'verified';
    const color = isVerified ? '#8B5CF6' : '#F59E0B';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: ${isSelected ? '30px' : '25px'};
          height: ${isSelected ? '30px' : '25px'};
          border-radius: 50%;
          border: ${isSelected ? '3px' : '2px'} solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: white;
            font-weight: bold;
            font-size: ${isSelected ? '12px' : '10px'};
          ">F</div>
        </div>
      `,
      iconSize: isSelected ? [30, 30] : [25, 25],
      iconAnchor: isSelected ? [15, 15] : [12.5, 12.5],
    });
  };

  // Create region polygon
  const createRegionPolygon = (region: Region) => {
    const boundary = regionBoundaries[region.id];
    if (!boundary) return null;

    return (
      <Polygon
        key={region.id}
        positions={boundary}
        pathOptions={{
          color: '#3B82F6',
          fillColor: '#3B82F680',
          fillOpacity: 0.2,
          weight: 2,
        }}
      >
        <Popup>
          <div className="p-2 min-w-[250px]">
            <h3 className="font-bold text-sm mb-2">{region.name}</h3>
            <div className="text-xs space-y-1">
              <div>KCN: {region.totalIZs}</div>
              <div>Cụm: {region.totalClusters}</div>
              <div>Nhà máy: {region.totalFactories}</div>
              <div>ESG trung bình: {region.averageESG}/100</div>
              <div>Vốn đầu tư: {(region.totalInvestment / 1e12).toFixed(1)} nghìn tỷ VND</div>
            </div>
          </div>
        </Popup>
      </Polygon>
    );
  };

  // Create flow line (simple implementation)
  const createFlowLine = (from: [number, number], to: [number, number]) => {
    return L.polyline([from, to], {
      color: '#10B981',
      weight: 2,
      opacity: 0.6,
      dashArray: '5, 10',
    });
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
      key={`map-${level}-${selectedIZ}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController 
        selectedIZ={selectedIZ} 
        izs={izs}
        selectedFactory={selectedFactory}
        factories={factories}
        level={level}
      />

      {/* Region Level - Show Region Boundaries */}
      {level === 'region' && regions && regions.map((region) => createRegionPolygon(region)).filter(Boolean)}

      {/* IZ Markers - Show when level is region, iz, or cluster */}
      {(level === 'region' || level === 'iz' || level === 'cluster') && izs.map((iz) => (
        <Marker
          key={iz.id}
          position={[iz.latitude, iz.longitude]}
          icon={createCustomIcon(iz)}
          eventHandlers={{
            click: () => {
              onIZSelect(iz.id);
              if (onLevelChange && level === 'region') {
                onLevelChange('iz');
              }
            },
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-sm mb-2">{iz.name}</h3>
              <p className="text-xs text-gray-600 mb-2">{iz.district}, {iz.province}</p>
              
              <div className="flex flex-wrap gap-1 mb-2">
                {iz.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                )}
                {iz.digitalTransformation && (
                  <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    <Cpu className="w-3 h-3 mr-1" />
                    Digital
                  </span>
                )}
                {iz.esgStatus !== 'none' && (
                  <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    <Leaf className="w-3 h-3 mr-1" />
                    {getESGLabel(iz.esgStatus)}
                  </span>
                )}
              </div>

              <div className="text-xs mb-2">
                <div>Ngành: {iz.industries.slice(0, 2).join(', ')}</div>
                <div>Công ty: {iz.totalCompanies}</div>
                <div>Lao động: {(iz.totalEmployees / 1000).toFixed(1)}k</div>
              </div>

              <Link
                href={`/iz/${iz.id}`}
                className="text-xs text-blue-600 hover:underline"
              >
                Xem chi tiết →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Factory Markers - Show when level is cluster or factory, or when IZ is selected in iz level */}
      {((level === 'cluster' || level === 'factory') || (level === 'iz' && selectedIZ)) && factories.map((factory) => {
        // Only show factories in selected IZ when in cluster/iz mode
        if ((level === 'cluster' || level === 'iz') && selectedIZ && factory.izId !== selectedIZ) {
          return null;
        }
        
        return (
          <Marker
            key={factory.id}
            position={[factory.latitude, factory.longitude]}
            icon={createFactoryIcon(factory)}
            eventHandlers={{
              click: () => {
                if (onFactorySelect) {
                  onFactorySelect(factory.id);
                }
                if (onLevelChange && level === 'cluster') {
                  onLevelChange('factory');
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-sm mb-2">{factory.name}</h3>
                {factory.lotNumber && (
                  <p className="text-xs text-gray-600 mb-2">Lô: {factory.lotNumber}</p>
                )}
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {factory.verificationStatus === 'verified' && (
                    <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </span>
                  )}
                  {factory.digitalTransformation && (
                    <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <Cpu className="w-3 h-3 mr-1" />
                      Digital
                    </span>
                  )}
                  {factory.esgStatus !== 'none' && (
                    <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      <Leaf className="w-3 h-3 mr-1" />
                      {getESGLabel(factory.esgStatus)}
                    </span>
                  )}
                </div>

                <div className="text-xs mb-2">
                  <div>Ngành: {factory.industries.slice(0, 2).join(', ')}</div>
                  {factory.products && factory.products.length > 0 && (
                    <div>Sản phẩm: {factory.products.length} loại</div>
                  )}
                </div>

                <Link
                  href={`/factory/${factory.id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Xem chi tiết →
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Flow Lines (if enabled) - Simple lines from IZ to Factories */}
      {showFlowLines && level === 'iz' && selectedIZ && (
        <>
          {factories
            .filter(f => f.izId === selectedIZ)
            .map((factory) => {
              const iz = izs.find(i => i.id === factory.izId);
              if (!iz) return null;
              return (
                <Polyline
                  key={`flow-${factory.id}`}
                  positions={[
                    [iz.latitude, iz.longitude] as [number, number],
                    [factory.latitude, factory.longitude] as [number, number],
                  ]}
                  pathOptions={{
                    color: '#10B981',
                    weight: 2,
                    opacity: 0.6,
                    dashArray: '10, 10',
                  }}
                />
              );
            })}
        </>
      )}
    </MapContainer>
  );
}

