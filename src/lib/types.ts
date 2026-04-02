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

export const PLACE_TYPE_ICON: Record<PlaceType, string> = {
  'מסעדה/בר': 'restaurant',
  'אוכל רחוב': 'lunch_dining',
  'מאפייה': 'bakery_dining',
  'חלבנות/גבינות': 'chess',
  'יקב/מזקקה': 'wine_bar',
  'יצרן/חקלאי': 'agriculture',
  'שף/ארוחת טעימות': 'skillet',
  'שוק': 'storefront',
};

export const PLACE_TYPE_LABEL: Record<PlaceType, string> = {
  'מסעדה/בר': 'מסעדה',
  'אוכל רחוב': 'אוכל רחוב',
  'מאפייה': 'מאפייה',
  'חלבנות/גבינות': 'מחלבה',
  'יקב/מזקקה': 'יקב',
  'יצרן/חקלאי': 'חקלאי',
  'שף/ארוחת טעימות': 'שף/טעימות',
  'שוק': 'שוק',
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

// Day colors for map polylines — Stitch palette
export const DAY_COLORS = [
  '#9d3d2e', // primary terracotta
  '#56642b', // secondary herb green
  '#51652a', // tertiary olive
  '#bd5444', // primary container
  '#6a7e40', // tertiary container
  '#89726d', // outline
  '#a03f30', // surface tint
];
