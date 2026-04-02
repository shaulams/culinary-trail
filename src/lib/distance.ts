import { Place } from './types';

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Haversine distance between two points in km */
export function haversineDistance(a: Place, b: Place): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** Estimated driving time in minutes (avg 60 km/h with 1.3x winding factor) */
export function estimatedDrivingMinutes(distKm: number): number {
  const windingFactor = 1.3;
  return (distKm * windingFactor) / 60 * 60; // (km * factor) / speed * 60min
}
