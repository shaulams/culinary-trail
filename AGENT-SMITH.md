# Israel Culinary Trail — Agent Brief

## Overview
An interactive web app that builds personalized culinary tours across Israel. The user selects regions, number of days, and food preferences — the app generates an optimized route with driving times, photos, and links to source articles.

Based on a curated database of 104 culinary destinations extracted from food journalist Ronit Vered's column in Haaretz (Israel's leading newspaper), spanning 2017–2026.

## Repository
Create a new GitHub repo: `shaulams/culinary-trail` (public).

## Data
- **Source file:** `data/places.json` — 104 places, ready to use
- **Place types (8):** restaurant, street-food, bakery, dairy/cheese, winery/distillery, producer/farmer, chef/tasting, market
- **Regions (19):** Golan Heights, Upper Galilee, Western Galilee, Lower Galilee, Jezreel Valley, Haifa, Carmel Coast, Hefer Valley, Sharon, Tel Aviv, Gush Dan, Jerusalem Hills, Jerusalem, Elah Valley, Shephelah, Jordan Valley, Western Negev, Eastern Negev, Southern Arava

### Place schema
```json
{
  "name": "מייקיז פיצה",
  "type": "אוכל רחוב",
  "region": "עמק יזרעאל",
  "description": "מייקי סנאו מכין בעפולה פיצה מחומרי גלם מקומיים בלבד",
  "articleTitle": "מייקיז פיצה עפולה: פיצה מיוחדת ומצוינת",
  "articleUrl": "https://www.haaretz.co.il/food/dining/...",
  "date": "2026-03-05",
  "lat": 32.6087,
  "lng": 35.2894,
  "mapsLink": "https://www.google.com/maps/search/?api=1&query=32.6087,35.2894"
}
```

**Note:** All place names, descriptions, and article titles are in Hebrew. The UI must be Hebrew RTL. Only this brief and code comments should be in English.

## Features

### User Input (Hebrew UI, RTL)
1. **Region selector** — interactive map or checkboxes. User picks regions of interest.
2. **Days** — slider, 1–7 days
3. **Culinary focus** — checkboxes: restaurants, producers/farmers, dairies, wineries, bakeries, street food, markets, all
4. **"Build my tour" button**

### Route Builder Algorithm
1. Filter places by selected regions + types
2. Compute distance matrix (Haversine from lat/lng; optionally Google Directions API for real drive times)
3. Build optimal route:
   - 2–3 stops per day (morning, lunch, evening; optional "on the way" stop)
   - Max ~3 hours driving per day
   - Variety: avoid consecutive stops of same type (e.g. not two dairies in a row)
   - Logical direction: north→south or south→north, no zigzagging
4. Display route on map with driving lines

### Route Display
- Map with numbered stops and route lines
- Day cards, each containing:
  - Stop cards with image (og:image from article URL), name, short description, type badge
  - Driving time between stops
  - Link to full Haaretz article
- Summary: total days, stops, regions, driving time
- "Export to PDF" button
- "Share" button (WhatsApp / copy link)

### PDF Export
- Styled cover page with title and summary
- One page per day with photos and links
- Light background, readable font size, proper Hebrew RTL
- See example: `examples/sample-6-day-route.pdf`

## Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, RTL-first (`dir="rtl"`)
- **Map:** Google Maps JavaScript API or Mapbox GL
- **Data:** Static JSON import (no database for MVP)
- **PDF:** html2canvas + jsPDF (client-side) or Puppeteer (server-side)
- **Deploy:** Vercel

## Suggested File Structure
```
culinary-trail/
├── data/
│   └── places.json              # Place database (provided)
├── src/
│   ├── app/
│   │   ├── layout.tsx           # RTL layout, Hebrew font
│   │   ├── page.tsx             # Home — parameter selection
│   │   └── route/
│   │       └── page.tsx         # Route display
│   ├── components/
│   │   ├── RegionSelector.tsx   # Map or checkbox region picker
│   │   ├── DaysSlider.tsx       # 1-7 day slider
│   │   ├── TypeFilter.tsx       # Culinary type checkboxes
│   │   ├── RouteMap.tsx         # Google Maps with route
│   │   ├── DayCard.tsx          # Single day container
│   │   └── StopCard.tsx         # Single stop with image
│   ├── lib/
│   │   ├── route-builder.ts    # Core routing algorithm
│   │   ├── distance.ts         # Haversine + optional Directions API
│   │   └── types.ts            # TypeScript interfaces
│   └── styles/
│       └── globals.css
├── public/
├── examples/
│   └── sample-6-day-route.pdf  # Reference output
├── AGENT-SMITH.md
├── package.json
└── README.md
```

## Constraints
- **Hebrew only** — all UI text in Hebrew, full RTL layout
- **Mobile-first** — most users will be on phones
- **Performance** — dataset is small (104 records), everything should be instant
- **Accessibility** — good color contrast, readable text sizes
- **Images** — extract og:image from articleUrl at build time or runtime; fallback to a placeholder if unavailable

## Out of Scope (MVP)
- Authentication / user accounts
- Saving routes to DB
- Reviews / ratings
- Table reservations
- Price data
- Real-time availability / opening hours

## API Keys Required
- Google Maps JavaScript API (for map display)
- Google Directions API (optional — for precise drive times; Haversine works for MVP)

## Reference
- **Google Sheet with full data:** https://docs.google.com/spreadsheets/d/1Ta7x1vFKJlIuo_OoHOz1DpX66PH_gV60uYDJl-6MbnM/edit
- **Sample 6-day route** built manually: see "מסלולים" tab in the sheet and `examples/sample-6-day-route.pdf`
- **Source articles:** Ronit Vered, "פינת אוכל" column, Haaretz (2007–present, our data covers 2017–2026)
