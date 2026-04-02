export interface Place {
  name: string;
  type: PlaceType;
  region: string;
  description: string;
  articleTitle: string;
  articleUrl: string;
  date: string;
  lat: number;
  lng: number;
  mapsLink: string;
}

export type PlaceType =
  | 'מסעדה/בר'
  | 'אוכל רחוב'
  | 'מאפייה'
  | 'חלבנות/גבינות'
  | 'יקב/מזקקה'
  | 'יצרן/חקלאי'
  | 'שף/ארוחת טעימות'
  | 'שוק';

export interface DayPlan {
  day: number;
  stops: Place[];
  totalDrivingKm: number;
  estimatedDrivingMinutes: number;
}

export interface Route {
  days: DayPlan[];
  totalStops: number;
  totalDays: number;
  regions: string[];
  totalDrivingKm: number;
}

export const PLACE_TYPES: PlaceType[] = [
  'מסעדה/בר',
  'אוכל רחוב',
  'מאפייה',
  'חלבנות/גבינות',
  'יקב/מזקקה',
  'יצרן/חקלאי',
  'שף/ארוחת טעימות',
  'שוק',
];

export const PLACE_TYPE_EMOJI: Record<PlaceType, string> = {
  'מסעדה/בר': '🍽️',
  'אוכל רחוב': '🥙',
  'מאפייה': '🥖',
  'חלבנות/גבינות': '🧀',
  'יקב/מזקקה': '🍷',
  'יצרן/חקלאי': '🌾',
  'שף/ארוחת טעימות': '👨‍🍳',
  'שוק': '🏪',
};

export interface RegionGroup {
  label: string;
  regions: string[];
}

export const REGION_GROUPS: RegionGroup[] = [
  {
    label: 'צפון',
    regions: [
      'רמת הגולן',
      'גליל עליון',
      'גליל מערבי',
      'גליל תחתון',
      'עמק יזרעאל',
      'חיפה',
      'חוף הכרמל',
    ],
  },
  {
    label: 'מרכז',
    regions: [
      'עמק חפר',
      'השרון',
      'תל אביב',
      'גוש דן',
      'בקעת הירדן',
    ],
  },
  {
    label: 'דרום',
    regions: [
      'גבעות ירושלים',
      'ירושלים',
      'עמק האלה',
      'השפלה',
      'נגב מערבי',
      'נגב מזרחי',
      'ערבה דרומית',
    ],
  },
];

export const ALL_REGIONS = REGION_GROUPS.flatMap((g) => g.regions);

// Day colors for map polylines
export const DAY_COLORS = [
  '#6B8E23', // olive
  '#CD853F', // peru/terracotta
  '#2E8B57', // sea green
  '#B8860B', // dark goldenrod
  '#8B4513', // saddle brown
  '#556B2F', // dark olive green
  '#A0522D', // sienna
];
