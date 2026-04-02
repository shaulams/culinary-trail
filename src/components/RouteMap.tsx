'use client';

import { useEffect, useState } from 'react';
import { Route, DAY_COLORS } from '@/lib/types';

interface RouteMapProps {
  route: Route;
}

export default function RouteMap({ route }: RouteMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const [mapId] = useState(`map-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const initMap = async () => {
      const L = (await import('leaflet')).default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const container = document.getElementById(mapId);
      if (!container) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((container as any)._leaflet_id) return;

      const map = L.map(mapId).setView([31.5, 35.0], 8);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      const allPoints: [number, number][] = [];

      route.days.forEach((day) => {
        const color = DAY_COLORS[(day.day - 1) % DAY_COLORS.length];
        const points: [number, number][] = [];

        day.stops.forEach((stop, i) => {
          const point: [number, number] = [stop.lat, stop.lng];
          points.push(point);
          allPoints.push(point);

          const icon = L.divIcon({
            html: `<div style="
              background-color: ${color};
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 13px;
              border: 2px solid #fbf9f4;
              box-shadow: 0 2px 8px rgba(160,63,48,0.15);
              font-family: 'Alef', sans-serif;
            ">${i + 1}</div>`,
            className: '',
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          L.marker(point, { icon })
            .addTo(map)
            .bindPopup(
              `<div style="direction:rtl;text-align:right;font-family:'Alef',sans-serif;">
                <strong>${stop.name}</strong><br/>
                <small>${stop.type} · ${stop.region}</small><br/>
                <small>${stop.description.slice(0, 100)}${stop.description.length > 100 ? '...' : ''}</small>
              </div>`,
              { maxWidth: 250 }
            );
        });

        if (points.length > 1) {
          L.polyline(points, {
            color,
            weight: 3,
            opacity: 0.7,
            dashArray: '8, 8',
          }).addTo(map);
        }
      });

      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds, { padding: [30, 30] });
      }

      setMapReady(true);
    };

    if (route.days.length > 0) {
      initMap();
    }
  }, [route, mapId]);

  return (
    <div className="relative">
      <div
        id={mapId}
        className="w-full h-full min-h-[400px] overflow-hidden"
        style={{ zIndex: 0 }}
      />
      {!mapReady && route.days.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
          <p className="text-on-surface-variant">טוען מפה...</p>
        </div>
      )}
    </div>
  );
}
