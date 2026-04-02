'use client';

import { useEffect, useState, useCallback } from 'react';
import { Route, DAY_COLORS } from '@/lib/types';

interface RouteMapProps {
  route: Route;
  animated?: boolean;
}

export default function RouteMap({ route, animated = false }: RouteMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const [mapId] = useState(`map-${Math.random().toString(36).slice(2)}`);

  const initMap = useCallback(async () => {
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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const shouldAnimate = animated && !prefersReducedMotion;

    let globalDelay = 0;

    route.days.forEach((day) => {
      const color = DAY_COLORS[(day.day - 1) % DAY_COLORS.length];
      const points: [number, number][] = [];

      day.stops.forEach((stop, i) => {
        const point: [number, number] = [stop.lat, stop.lng];
        points.push(point);
        allPoints.push(point);

        const delay = globalDelay;
        globalDelay += shouldAnimate ? 300 : 0;

        const createMarker = () => {
          const icon = L.divIcon({
            html: `<div class="${shouldAnimate ? 'marker-bounce' : ''}" style="
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
        };

        if (shouldAnimate) {
          setTimeout(createMarker, delay);
        } else {
          createMarker();
        }
      });

      if (points.length > 1) {
        const createPolyline = () => {
          if (shouldAnimate) {
            // Animated polyline with dash-offset
            const polyline = L.polyline(points, {
              color,
              weight: 3,
              opacity: 0.7,
              dashArray: '8, 8',
              className: 'animated-polyline',
            }).addTo(map);
            
            // Calculate total length for animation
            const el = polyline.getElement();
            if (el) {
              const path = el as SVGElement;
              const pathEl = path.querySelector('path');
              if (pathEl) {
                const length = pathEl.getTotalLength();
                pathEl.style.strokeDasharray = `${length}`;
                pathEl.style.strokeDashoffset = `${length}`;
                pathEl.style.transition = `stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)`;
                requestAnimationFrame(() => {
                  pathEl.style.strokeDashoffset = '0';
                });
              }
            }
          } else {
            L.polyline(points, {
              color,
              weight: 3,
              opacity: 0.7,
              dashArray: '8, 8',
            }).addTo(map);
          }
        };

        if (shouldAnimate) {
          setTimeout(createPolyline, globalDelay);
          globalDelay += 200;
        } else {
          createPolyline();
        }
      }
    });

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    setMapReady(true);
  }, [route, mapId, animated]);

  useEffect(() => {
    if (route.days.length > 0) {
      initMap();
    }
  }, [route, initMap]);

  return (
    <div className="relative">
      <div
        id={mapId}
        className="w-full h-full min-h-[400px] overflow-hidden"
        style={{ zIndex: 0 }}
      />
      {!mapReady && route.days.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-container-high skeleton-shimmer">
          <span className="material-symbols-outlined text-4xl text-outline/30">map</span>
        </div>
      )}
    </div>
  );
}
