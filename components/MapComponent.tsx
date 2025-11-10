'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { IndustrialZone, Factory } from '@/types/database';
import { MapPin, CheckCircle, Leaf, Cpu, Factory as FactoryIcon } from 'lucide-react';
import Link from 'next/link';

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

interface MapComponentProps {
  izs: IndustrialZone[];
  selectedIZ: string | null;
  onIZSelect: (id: string) => void;
  factories?: Factory[];
  showFactories?: boolean;
}

function MapController({ selectedIZ, izs }: { selectedIZ: string | null; izs: IndustrialZone[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedIZ) {
      const iz = izs.find(i => i.id === selectedIZ);
      if (iz) {
        map.setView([iz.latitude, iz.longitude], 13);
      }
    } else if (izs.length > 0) {
      // Fit bounds to show all IZs
      const bounds = izs.map(iz => [iz.latitude, iz.longitude] as [number, number]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedIZ, izs, map]);

  return null;
}

export default function MapComponent({ izs, selectedIZ, onIZSelect, factories = [], showFactories = false }: MapComponentProps) {
  // Default center: Vietnam
  const defaultCenter: [number, number] = [16.0, 106.0];
  const defaultZoom = 6;

  const getESGLabel = (status: string) => {
    switch (status) {
      case 'all':
        return 'ESG';
      case 'environmental':
        return 'E';
      case 'social':
        return 'S';
      case 'governance':
        return 'G';
      default:
        return '';
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
          width: 30px;
          height: 30px;
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
            font-size: 12px;
          ">IZ</div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  // Create custom icon for Factory
  const createFactoryIcon = (factory: Factory) => {
    const isVerified = factory.verificationStatus === 'verified';
    const color = isVerified ? '#8B5CF6' : '#F59E0B';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 2px solid white;
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
            font-size: 10px;
          ">F</div>
        </div>
      `,
      iconSize: [25, 25],
      iconAnchor: [12.5, 12.5],
    });
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController selectedIZ={selectedIZ} izs={izs} />

      {izs.map((iz) => (
        <Marker
          key={iz.id}
          position={[iz.latitude, iz.longitude]}
          icon={createCustomIcon(iz)}
          eventHandlers={{
            click: () => onIZSelect(iz.id),
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

      {/* Factory Markers */}
      {showFactories && factories.map((factory) => (
        <Marker
          key={factory.id}
          position={[factory.latitude, factory.longitude]}
          icon={createFactoryIcon(factory)}
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
      ))}
    </MapContainer>
  );
}

