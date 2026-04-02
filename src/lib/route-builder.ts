import { Place, DayPlan, Route } from './types';
import { haversineDistance, estimatedDrivingMinutes } from './distance';

const MAX_DRIVING_KM_PER_DAY = 180; // ~3h at 60km/h
const MIN_STOPS_PER_DAY = 2;
const MAX_STOPS_PER_DAY = 3;

interface BuildRouteOptions {
  places: Place[];
  selectedRegions: string[];
  selectedTypes: string[];
  days: number;
}

/** Filter places by selected regions and types */
function filterPlaces(
  places: Place[],
  regions: string[],
  types: string[]
): Place[] {
  return places.filter((p) => {
    const regionMatch = regions.length === 0 || regions.some((r) => p.region.includes(r));
    const typeMatch = types.length === 0 || types.includes(p.type);
    return regionMatch && typeMatch;
  });
}

/** Sort places north→south (by latitude descending) */
function sortNorthToSouth(places: Place[]): Place[] {
  return [...places].sort((a, b) => b.lat - a.lat);
}

/**
 * Nearest-neighbor with type diversity:
 * pick the closest place that isn't the same type as the last stop
 */
function pickNext(
  current: Place,
  candidates: Place[],
  lastType: string | null
): Place | null {
  if (candidates.length === 0) return null;

  // Prefer different type, sorted by distance
  const sorted = [...candidates].sort(
    (a, b) => haversineDistance(current, a) - haversineDistance(current, b)
  );

  // Try to find a different type first
  if (lastType) {
    const differentType = sorted.find((p) => p.type !== lastType);
    if (differentType) return differentType;
  }

  return sorted[0];
}

export function buildRoute(options: BuildRouteOptions): Route {
  const { places, selectedRegions, selectedTypes, days } = options;

  const filtered = filterPlaces(places, selectedRegions, selectedTypes);
  if (filtered.length === 0) {
    return { days: [], totalStops: 0, totalDays: 0, regions: [], totalDrivingKm: 0 };
  }

  // Sort north to south as initial ordering
  const sorted = sortNorthToSouth(filtered);

  // Total stops we can have
  const targetStops = Math.min(
    days * MAX_STOPS_PER_DAY,
    sorted.length
  );

  // Build route using nearest-neighbor from the northernmost point
  const route: Place[] = [];
  const remaining = [...sorted];

  // Start from the northernmost point
  let current = remaining.shift()!;
  route.push(current);

  while (route.length < targetStops && remaining.length > 0) {
    const lastType = route[route.length - 1].type;
    const next = pickNext(current, remaining, lastType);
    if (!next) break;

    remaining.splice(remaining.indexOf(next), 1);
    route.push(next);
    current = next;
  }

  // Split into days
  const dayPlans: DayPlan[] = [];
  let stopIndex = 0;

  for (let d = 0; d < days && stopIndex < route.length; d++) {
    const dayStops: Place[] = [];
    let dayKm = 0;

    // Add at least MIN_STOPS_PER_DAY, up to MAX_STOPS_PER_DAY
    while (
      dayStops.length < MAX_STOPS_PER_DAY &&
      stopIndex < route.length
    ) {
      const stop = route[stopIndex];

      if (dayStops.length > 0) {
        const lastStop = dayStops[dayStops.length - 1];
        const dist = haversineDistance(lastStop, stop);
        // Check if adding this stop would exceed daily driving limit
        if (dayKm + dist > MAX_DRIVING_KM_PER_DAY && dayStops.length >= MIN_STOPS_PER_DAY) {
          break;
        }
        dayKm += dist;
      }

      dayStops.push(stop);
      stopIndex++;
    }

    if (dayStops.length > 0) {
      dayPlans.push({
        day: d + 1,
        stops: dayStops,
        totalDrivingKm: Math.round(dayKm),
        estimatedDrivingMinutes: Math.round(estimatedDrivingMinutes(dayKm)),
      });
    }
  }

  const allRegions = [...new Set(dayPlans.flatMap((d) => d.stops.map((s) => s.region)))];
  const totalKm = dayPlans.reduce((sum, d) => sum + d.totalDrivingKm, 0);

  return {
    days: dayPlans,
    totalStops: dayPlans.reduce((sum, d) => sum + d.stops.length, 0),
    totalDays: dayPlans.length,
    regions: allRegions,
    totalDrivingKm: totalKm,
  };
}
