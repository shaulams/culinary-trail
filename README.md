# 🍽️ שביל הטעמים של ישראל — Israel Culinary Trail

An interactive Hebrew RTL web app for building personalized culinary tours across Israel, based on 104 curated destinations from food journalist Ronit Vered's column in Haaretz.

## Features

- **Region Selection** — Pick regions grouped by North, Center, South
- **Day Planning** — Choose 1–7 days for your trip
- **Culinary Type Filters** — Restaurants, bakeries, wineries, markets, and more
- **Smart Route Builder** — Nearest-neighbor algorithm with type diversity, north→south routing
- **Interactive Map** — Leaflet/OpenStreetMap with numbered markers and day-colored routes
- **PDF Export** — Download your route as a PDF
- **WhatsApp Sharing** — Share your route with friends

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — Earth tones, RTL-first
- **Leaflet + react-leaflet** — Free map tiles
- **jsPDF** — Client-side PDF generation
- **Hebrew RTL** — Full right-to-left layout with CSS logical properties

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: Google Sheets Integration

Copy `.env.local.example` to `.env.local` and add your Google Sheets API key to fetch live data from the spreadsheet.

## Data

The app includes 104 places in `src/data/places.json` (also in `data/places.json`). Each place has:
- Name, type, region, description (all in Hebrew)
- Article URL (Haaretz)
- GPS coordinates
- Google Maps link

### Place Types
| Type | Hebrew |
|------|--------|
| Restaurant/Bar | מסעדה/בר |
| Street Food | אוכל רחוב |
| Bakery | מאפייה |
| Dairy/Cheese | חלבנות/גבינות |
| Winery/Distillery | יקב/מזקקה |
| Producer/Farmer | יצרן/חקלאי |
| Chef/Tasting | שף/ארוחת טעימות |
| Market | שוק |

## License

MIT
