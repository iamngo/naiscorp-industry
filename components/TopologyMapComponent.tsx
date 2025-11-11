'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon, Polyline, CircleMarker, Tooltip, Pane } from 'react-leaflet';
import L from 'leaflet';
import { IndustrialZone, Factory, Cluster, Region, TopologyLevel } from '@/types/database';
import { CheckCircle, Leaf, Cpu, Network } from 'lucide-react';
import Link from 'next/link';
import { mockRegions } from '@/lib/mockData';

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

  const createClusterIcon = (cluster: Cluster) => {
    const isSelected = selectedCluster === cluster.id;
    const size = isSelected ? 34 : 28;
    const border = isSelected ? 3 : 2;

    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background: linear-gradient(135deg, #0ea5e9, #6366f1);
          width: ${size}px;
          height: ${size}px;
          border-radius: 14px;
          border: ${border}px solid rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 18px rgba(79, 70, 229, 0.35);
          color: #fff;
          font-weight: 700;
          font-size: ${isSelected ? '12px' : '11px'};
        ">
          C
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
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

  const regionCenters = useMemo(() => {
    return regions.reduce<Record<string, [number, number]>>((acc, region) => {
      const boundary = regionBoundaries[region.id];
      if (!boundary) return acc;
      const latSum = boundary.reduce((sum, point) => sum + point[0], 0);
      const lngSum = boundary.reduce((sum, point) => sum + point[1], 0);
      acc[region.id] = [latSum / boundary.length, lngSum / boundary.length];
      return acc;
    }, {});
  }, [regions]);

  const clustersByIZ = useMemo(() => {
    return clusters.reduce<Record<string, Cluster[]>>((acc, cluster) => {
      if (!acc[cluster.izId]) {
        acc[cluster.izId] = [];
      }
      acc[cluster.izId].push(cluster);
      return acc;
    }, {});
  }, [clusters]);

  const clusterPositions = useMemo(() => {
    const positions = new Map<string, [number, number]>();

    clusters.forEach((cluster) => {
      const iz = izs.find((item) => item.id === cluster.izId);
      if (!iz) return;
      const siblings = clustersByIZ[cluster.izId];
      const index = siblings.findIndex((item) => item.id === cluster.id);
      const angle = (index / Math.max(siblings.length, 1)) * Math.PI * 2;
      const radius = 0.04; // degrees ~4-5km
      const lat = iz.latitude + Math.sin(angle) * radius;
      const lng = iz.longitude + Math.cos(angle) * radius;
      positions.set(cluster.id, [lat, lng]);
    });

    return positions;
  }, [clusters, clustersByIZ, izs]);

  const flowLines = useMemo(() => {
    const lines: Array<{
      id: string;
      points: [number, number][];
      color: string;
      weight: number;
      dashArray?: string;
    }> = [];

    if (!showFlowLines) {
      return lines;
    }

    // Region -> IZ lines
    izs.forEach((iz) => {
      if (!iz.regionId) return;
      const regionCenter = regionCenters[iz.regionId];
      if (!regionCenter) return;
      lines.push({
        id: `region-${iz.regionId}-iz-${iz.id}`,
        points: [regionCenter, [iz.latitude, iz.longitude]],
        color: '#38bdf8',
        weight: 2,
        dashArray: '10 10',
      });
    });

    // IZ -> Cluster lines
    clusters.forEach((cluster) => {
      const iz = izs.find((item) => item.id === cluster.izId);
      if (!iz) return;
      const clusterPosition = clusterPositions.get(cluster.id);
      if (!clusterPosition) return;

      lines.push({
        id: `iz-${cluster.izId}-cluster-${cluster.id}`,
        points: [
          [iz.latitude, iz.longitude],
          clusterPosition,
        ],
        color: '#818cf8',
        weight: 2.5,
      });
    });

    // Cluster/IZ -> Factory lines
    factories.forEach((factory) => {
      const iz = izs.find((item) => item.id === factory.izId);
      if (!iz) return;
      if (factory.clusterId) {
        const clusterPosition = clusterPositions.get(factory.clusterId);
        if (clusterPosition) {
          lines.push({
            id: `cluster-${factory.clusterId}-factory-${factory.id}`,
            points: [clusterPosition, [factory.latitude, factory.longitude]],
            color: '#fb923c',
            weight: 1.6,
          });
          return;
        }
      }

      lines.push({
        id: `iz-${factory.izId}-factory-${factory.id}`,
        points: [
          [iz.latitude, iz.longitude],
          [factory.latitude, factory.longitude],
        ],
        color: '#facc15',
        weight: 1.4,
        dashArray: '6 6',
      });
    });

    return lines;
  }, [clusters, clusterPositions, factories, izs, regionCenters, showFlowLines]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{
        height: '100%',
        width: '100%',
        background: '#f8fafc',
      }}
      scrollWheelZoom={true}
      key={`map-${level}-${selectedIZ}`}
      className="topology-map-container"
    >
      <Pane name="topology-background" style={{ zIndex: 50 }}>
        <div className="topology-grid-overlay" />
      </Pane>
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        opacity={0.55}
      />
      
      <MapController 
        selectedIZ={selectedIZ} 
        izs={izs}
        selectedFactory={selectedFactory}
        factories={factories}
        level={level}
      />

      {/* Draw topology flow lines */}
      {flowLines.map(line => (
        <Polyline
          key={line.id}
          positions={line.points}
          pathOptions={{
            color: line.color,
            weight: line.weight,
            opacity: 0.6,
            dashArray: line.dashArray,
          }}
        />
      ))}

      {/* Region Level - Show Region Boundaries and centroids */}
      {level === 'region' && regions.map((region) => createRegionPolygon(region)).filter(Boolean)}
      {level === 'region' && regions.map(region => {
        const center = regionCenters[region.id];
        if (!center) return null;
        return (
          <CircleMarker
            key={`${region.id}-center`}
            center={center}
            radius={20}
            pathOptions={{
              color: '#38bdf8',
              fillColor: '#38bdf8',
              fillOpacity: 0.12,
              weight: 2,
            }}
          >
            <Tooltip direction="center" permanent className="!bg-transparent !border-0 !shadow-none">
              <div className="rounded-xl bg-sky-500 text-white px-3 py-1 text-xs font-semibold shadow-lg">
                {region.name}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}

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
            <div className="p-2 min-w-[220px]">
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

              <div className="text-xs mb-2 space-y-1">
                <div>Ngành: {iz.industries.slice(0, 2).join(', ')}</div>
                <div>Doanh nghiệp: {iz.totalCompanies}</div>
                <div>Lực lượng lao động: {(iz.totalEmployees / 1000).toFixed(1)}k</div>
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

      {/* Cluster markers */}
      {(level === 'cluster' || level === 'factory' || (selectedIZ && level === 'iz')) && clusters.map((cluster) => {
        if (selectedIZ && cluster.izId !== selectedIZ) return null;
        const position = clusterPositions.get(cluster.id);
        if (!position) return null;

        const iz = izs.find((item) => item.id === cluster.izId);
        if (!iz) return null;

        return (
          <Marker
            key={cluster.id}
            position={position}
            icon={createClusterIcon(cluster)}
            eventHandlers={{
              click: () => {
                if (onClusterSelect) {
                  onClusterSelect(cluster.id);
                }
                if (onLevelChange && level === 'iz') {
                  onLevelChange('cluster');
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <h3 className="font-bold text-sm mb-2">{cluster.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{cluster.description}</p>
                <div className="text-xs space-y-1 mb-2">
                  <div>Thuộc KCN: <strong>{iz.name}</strong></div>
                  <div>Ngành trọng tâm: {cluster.industries.join(', ')}</div>
                  <div>Nhà máy đang hoạt động: {cluster.totalFactories}</div>
                </div>
                <div className="inline-flex items-center space-x-1 rounded-lg bg-indigo-50 text-indigo-600 px-2 py-1 text-xs">
                  <Network className="w-3 h-3" />
                  <span>Hub kết nối cụm</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Factory Markers */}
      {((level === 'cluster' || level === 'factory') || (level === 'iz' && selectedIZ)) && factories.map((factory) => {
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
              <div className="p-2 min-w-[220px]">
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

                <div className="text-xs mb-2 space-y-1">
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
    </MapContainer>
  );
}

