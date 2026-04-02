import { Place } from './types';
import placesJson from '@/data/places.json';

const SHEET_ID = '1Ta7x1vFKJlIuo_OoHOz1DpX66PH_gV60uYDJl-6MbnM';
const TAB_NAME = 'מקומות';

function parseLatLng(mapsLink: string): { lat: number; lng: number } | null {
  try {
    const url = new URL(mapsLink);
    const query = url.searchParams.get('query');
    if (!query) return null;
    const [lat, lng] = query.split(',').map(Number);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

function sheetRowToPlace(row: string[]): Place | null {
  const [date, type, name, region, subtitle, title, articleUrl, mapsLink] = row;
  if (!name || !mapsLink) return null;
  const coords = parseLatLng(mapsLink);
  if (!coords) return null;
  return {
    name: name.trim(),
    type: (type?.trim() || 'מסעדה/בר') as Place['type'],
    region: region?.trim() || '',
    description: subtitle?.trim() || '',
    articleTitle: title?.trim() || name.trim(),
    articleUrl: articleUrl?.trim() || '',
    date: date?.trim() || '',
    lat: coords.lat,
    lng: coords.lng,
    mapsLink: mapsLink.trim(),
  };
}

async function fetchFromGoogleSheets(): Promise<Place[] | null> {
  const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!apiKey) return null;

  try {
    const encodedTab = encodeURIComponent(TAB_NAME);
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodedTab}?key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const rows = (data.values || []).slice(1); // skip header
    const places = rows.map(sheetRowToPlace).filter(Boolean) as Place[];
    return places.length > 0 ? places : null;
  } catch {
    return null;
  }
}

function loadFallbackPlaces(): Place[] {
  return (placesJson as Place[]).filter((p) => p.lat && p.lng);
}

export async function getPlaces(): Promise<Place[]> {
  const sheetPlaces = await fetchFromGoogleSheets();
  if (sheetPlaces && sheetPlaces.length > 0) return sheetPlaces;
  return loadFallbackPlaces();
}

export function getUniqueRegions(places: Place[]): string[] {
  return [...new Set(places.map((p) => p.region))].filter(Boolean);
}

export function getUniqueTypes(places: Place[]): string[] {
  return [...new Set(places.map((p) => p.type))].filter(Boolean);
}
