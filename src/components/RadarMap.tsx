import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { HazardReport, UserLocation } from '../types/hazard';
import { speakText } from '../services/audioRadar';

interface RadarMapProps {
  userLocation: UserLocation;
  hazards: HazardReport[];
  onSelectHazard?: (hazard: HazardReport) => void;
  radarRadiusMeters?: number;
}

export const RadarMap: React.FC<RadarMapProps> = ({
  userLocation,
  hazards,
  onSelectHazard,
  radarRadiusMeters = 50
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 17,
        zoomControl: false // Minimal clean view
      });

      // Clean OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      // Add Zoom control at bottom right (away from top header)
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map markers and user position
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;

    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. User Position Marker + Radar Pulse
    const userHtml = `
      <div style="position: relative;">
        <div class="gps-pulse-ring"></div>
        <div class="user-marker-pin" title="ตำแหน่งของคุณ"></div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'user-marker-wrapper',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
    userMarker.bindTooltip('ตำแหน่งปัจจุบันของคุณ (เรดาร์นำทาง)', { permanent: false });
    userMarker.addTo(markersGroup);

    // Draw Radar Radius Circle on Map (Soft Blue)
    L.circle([userLocation.lat, userLocation.lng], {
      radius: radarRadiusMeters,
      color: '#0284C7',
      fillColor: '#38BDF8',
      fillOpacity: 0.12,
      weight: 2,
      dashArray: '5, 8'
    }).addTo(markersGroup);

    // 2. Draw Hazard Pins (Text Pills only - No icons/emojis)
    hazards.forEach((hazard) => {
      const severityClass = hazard.severity.toLowerCase();
      const badgeHtml = `
        <div class="hazard-text-badge ${severityClass}">
          ${hazard.severityNameTh} • ${hazard.categoryNameTh}
        </div>
      `;

      const hazardIcon = L.divIcon({
        html: badgeHtml,
        className: 'custom-hazard-pin-wrapper',
        iconSize: [120, 30],
        iconAnchor: [60, 15]
      });

      const marker = L.marker([hazard.lat, hazard.lng], { icon: hazardIcon });

      const popupContent = document.createElement('div');
      popupContent.style.padding = '4px';
      popupContent.innerHTML = `
        <div style="font-family: var(--font-main); color: #0F172A;">
          <div style="font-size: 0.75rem; font-weight: 700; color: #0284C7; margin-bottom: 2px;">
            ${hazard.categoryNameTh} (${hazard.severityNameTh})
          </div>
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">
            ${hazard.title}
          </div>
          <div style="font-size: 0.85rem; color: #475569; margin-bottom: 8px;">
            ${hazard.locationName} - ${hazard.description}
          </div>
          <button id="btn-read-${hazard.id}" style="
            background: #0284C7;
            color: #FFFFFF;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 0.8rem;
            font-weight: 700;
            cursor: pointer;
            width: 100%;
          ">
            ฟังเสียงรายละเอียดภาษาไทย
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-read-${hazard.id}`);
        if (btn) {
          btn.onclick = () => {
            speakText(`จุดเสี่ยง ${hazard.categoryNameTh} ระดับความเสี่ยง ${hazard.severityNameTh} สถานที่ ${hazard.locationName} รายละเอียด ${hazard.description}`);
          };
        }
        if (onSelectHazard) {
          onSelectHazard(hazard);
        }
      });

      marker.addTo(markersGroup);
    });

    map.panTo([userLocation.lat, userLocation.lng], { animate: true });
  }, [userLocation, hazards, radarRadiusMeters, onSelectHazard]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
