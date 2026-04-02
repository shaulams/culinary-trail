'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { Place, Route as RouteType, DayPlan } from '@/lib/types';
import { buildRoute } from '@/lib/route-builder';
import placesJson from '@/data/places.json';

/* ─── Color Palette ─── */
const C = {
  brown: '#5D4E37',
  venueName: '#2D2D2D',
  body: '#444444',
  muted: '#888888',
  amber: '#C4A35A',
  yearBadge: '#F5C518',
  ruleLight: '#E0E0E0',
} as const;

/* ─── Helpers ─── */
function formatDriving(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}:${String(m).padStart(2, '0')}`;
}

function getTimeLabel(index: number, total: number): string {
  if (total <= 1) return 'על הדרך';
  if (index === 0) return 'בוקר';
  if (index === total - 1) return 'ערב';
  if (index === 1 && total >= 3) return 'צהריים';
  return 'על הדרך';
}

function extractYear(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  const match = dateStr.match(/(\d{4})/);
  return match ? match[1] : null;
}

function getUniqueRegions(day: DayPlan): string[] {
  const seen = new Set<string>();
  const regions: string[] = [];
  for (const s of day.stops) {
    if (!seen.has(s.region)) {
      seen.add(s.region);
      regions.push(s.region);
    }
  }
  return regions;
}

function getPlaceholderColor(name: string): string {
  const colors = ['#D4A574', '#8B9E6B', '#A0887E', '#7B9CB5', '#C4A35A', '#B57E6B'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

/* ─── Components ─── */

function CoverPage({ route }: { route: RouteType }) {
  const foodTypes = 'מסעדות · מגבנות · יקבים · חוות · מאפיות · אוכל רחוב';

  return (
    <div className="pdf-page pdf-cover">
      <div className="cover-content">
        <h1 className="cover-title">שביל ישראל הקולינרי</h1>
        <p className="cover-subtitle">מסלול טעימות מהגולן לערבה</p>
        <p className="cover-credit">בהשראת הכתבות של רונית ורד, הארץ</p>

        <div className="cover-stats">
          <p className="cover-stats-line">
            {route.totalDays} ימים · {route.totalStops} עצירות · {route.regions.length} אזורים
          </p>
          <p className="cover-food-types">{foodTypes}</p>
          <p className="cover-season">עונה מומלצת: אוקטובר—נובמבר</p>
        </div>
      </div>
    </div>
  );
}

function StopEntry({ stop, index, total }: { stop: Place; index: number; total: number }) {
  const timeLabel = getTimeLabel(index, total);
  const year = extractYear(stop.date);
  const bgColor = getPlaceholderColor(stop.name);

  return (
    <div className="stop-entry">
      <div className="stop-text">
        <p className="stop-time-label">● {timeLabel}</p>
        <h3 className="stop-venue-name">{stop.name}</h3>
        <div className="stop-dotted-underline" />
        <p className="stop-location">{stop.region}</p>
        <p className="stop-description">{stop.description}</p>
      </div>
      <div className="stop-image-col">
        <div className="stop-image-wrapper">
          <div
            className="stop-image-placeholder"
            style={{ backgroundColor: bgColor }}
          >
            <span className="stop-image-text">{stop.name}</span>
          </div>
          {year && (
            <div className="stop-year-badge">
              כה משנת {year}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DayPage({ day, route, pageNumber }: { day: DayPlan; route: RouteType; pageNumber: number }) {
  const regions = getUniqueRegions(day);
  const isLastDay = day.day === route.totalDays;
  const drivingFormatted = formatDriving(day.estimatedDrivingMinutes);

  // Find a lodging location from the last stop's region
  const lastStop = day.stops[day.stops.length - 1];
  const lodgingLocation = lastStop?.region || '';

  return (
    <div className="pdf-page pdf-day-page">
      <div className="day-content">
        {/* Day Header */}
        <h2 className="day-header">
          יום {day.day} — {regions.join(' + ')}
        </h2>

        {/* Driving Time */}
        <p className="day-driving">⏱ {drivingFormatted} שעות נסיעה</p>

        {/* Amber Horizontal Rule */}
        <hr className="day-amber-rule" />

        {/* Stop Entries */}
        <div className="day-stops">
          {day.stops.map((stop, i) => (
            <StopEntry key={stop.name} stop={stop} index={i} total={day.stops.length} />
          ))}
        </div>
      </div>

      {/* Page Footer */}
      <div className="day-footer">
        <hr className="footer-rule" />
        <div className="footer-content">
          <span className="footer-lodging">
            {isLastDay ? 'סיום הטיול' : `● לינה: ${lodgingLocation}`}
          </span>
          <span className="footer-driving">⏱ סה״כ נסיעה: {drivingFormatted}</span>
        </div>
        <p className="footer-page-number">עמוד {pageNumber}</p>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

function PdfContent() {
  const searchParams = useSearchParams();
  const [route, setRoute] = useState<RouteType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const regions = searchParams.get('regions')?.split(',').filter(Boolean) || [];
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const days = Number(searchParams.get('days')) || 3;

    const places = (placesJson as Place[]).filter((p) => p.lat && p.lng);
    const result = buildRoute({ places, selectedRegions: regions, selectedTypes: types, days });
    setRoute(result);
    setLoading(false);
  }, [searchParams]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">טוען...</p>
      </div>
    );
  }

  if (!route) return null;

  return (
    <>
      {/* Print Styles - injected inline for isolation */}
      <style>{`
        /* ─── Screen-only UI ─── */
        .pdf-toolbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: #1b1c19;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 12px 24px;
          font-family: 'Alef', sans-serif;
        }
        .pdf-toolbar button {
          background: #C4A35A;
          color: #1b1c19;
          border: none;
          padding: 10px 28px;
          border-radius: 999px;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          font-family: 'Alef', sans-serif;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pdf-toolbar button:hover {
          background: #d4b46a;
        }
        .pdf-toolbar .toolbar-info {
          font-size: 14px;
          opacity: 0.7;
        }

        .pdf-screen-wrapper {
          padding-top: 64px;
          background: #f0ece8;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          padding-bottom: 48px;
        }

        /* ─── PDF Page Base ─── */
        .pdf-page {
          width: 210mm;
          min-height: 297mm;
          background: #FFFFFF;
          box-sizing: border-box;
          font-family: 'Alef', sans-serif;
          direction: rtl;
          position: relative;
          overflow: hidden;
        }

        /* Screen shadow */
        @media screen {
          .pdf-page {
            box-shadow: 0 4px 24px rgba(0,0,0,0.12);
            margin: 0 auto;
          }
        }

        /* ─── Cover Page ─── */
        .pdf-cover {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cover-content {
          text-align: center;
          width: 62%;
          margin: 0 auto;
        }
        .cover-title {
          font-size: 48pt;
          font-weight: bold;
          color: ${C.brown};
          margin: 0;
          line-height: 1.2;
        }
        .cover-subtitle {
          font-size: 19pt;
          color: ${C.brown};
          margin-top: 80px;
          font-weight: normal;
        }
        .cover-credit {
          font-size: 15pt;
          color: #777777;
          margin-top: 12px;
          font-weight: normal;
        }
        .cover-stats {
          margin-top: 60px;
        }
        .cover-stats-line {
          font-size: 14pt;
          color: ${C.brown};
          margin: 0;
        }
        .cover-food-types {
          font-size: 13pt;
          color: ${C.body};
          margin-top: 10px;
        }
        .cover-season {
          font-size: 12pt;
          color: ${C.muted};
          margin-top: 10px;
        }

        /* ─── Day Pages ─── */
        .pdf-day-page {
          display: flex;
          flex-direction: column;
          padding: 28mm 22mm 20mm 22mm;
        }
        .day-content {
          flex: 1;
        }
        .day-header {
          font-size: 32pt;
          font-weight: bold;
          color: ${C.brown};
          text-align: center;
          margin: 0;
          line-height: 1.3;
        }
        .day-driving {
          font-size: 12pt;
          color: ${C.muted};
          text-align: center;
          margin-top: 8px;
          margin-bottom: 0;
        }
        .day-amber-rule {
          border: none;
          height: 1.5px;
          background: ${C.amber};
          margin: 25px 0;
        }

        /* ─── Stop Entries ─── */
        .day-stops {
          display: flex;
          flex-direction: column;
          gap: 55px;
        }
        .stop-entry {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .stop-text {
          flex: 1;
          text-align: center;
        }
        .stop-time-label {
          font-size: 12pt;
          color: #333333;
          margin: 0 0 6px 0;
        }
        .stop-venue-name {
          font-size: 24pt;
          font-weight: bold;
          color: ${C.venueName};
          margin: 0 0 6px 0;
          line-height: 1.3;
        }
        .stop-dotted-underline {
          width: 120px;
          height: 0;
          border-bottom: 2px dotted ${C.amber};
          margin: 0 auto 8px auto;
        }
        .stop-location {
          font-size: 12pt;
          color: ${C.muted};
          margin: 0 0 8px 0;
        }
        .stop-description {
          font-size: 13pt;
          color: ${C.body};
          line-height: 1.55;
          margin: 0;
        }

        /* ─── Stop Image ─── */
        .stop-image-col {
          flex-shrink: 0;
          width: 240px;
        }
        .stop-image-wrapper {
          position: relative;
          width: 240px;
          aspect-ratio: 3 / 2;
          border-radius: 5px;
          overflow: hidden;
        }
        .stop-image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
        }
        .stop-image-text {
          color: rgba(255,255,255,0.85);
          font-size: 14pt;
          font-weight: bold;
          text-align: center;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .stop-year-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: ${C.yearBadge};
          color: #1b1c19;
          font-size: 9pt;
          font-weight: bold;
          padding: 3px 8px;
          line-height: 1.3;
        }

        /* ─── Page Footer ─── */
        .day-footer {
          margin-top: auto;
          padding-top: 16px;
        }
        .footer-rule {
          border: none;
          height: 1px;
          background: ${C.ruleLight};
          margin: 0 0 10px 0;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11pt;
        }
        .footer-lodging {
          color: ${C.body};
        }
        .footer-driving {
          color: ${C.muted};
        }
        .footer-page-number {
          text-align: center;
          font-size: 10pt;
          color: #999999;
          margin-top: 12px;
        }

        /* ─── Print Overrides ─── */
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .pdf-toolbar,
          .pdf-screen-wrapper {
            display: contents !important;
            background: none !important;
            padding: 0 !important;
            gap: 0 !important;
          }
          .pdf-toolbar {
            display: none !important;
          }
          .pdf-page {
            box-shadow: none;
            page-break-after: always;
            break-after: page;
            margin: 0;
            width: 210mm;
            height: 297mm;
            min-height: 297mm;
            max-height: 297mm;
            overflow: hidden;
          }
          .pdf-page:last-child {
            page-break-after: avoid;
          }
        }
      `}</style>

      {/* Toolbar (screen only) */}
      <div className="pdf-toolbar">
        <span className="toolbar-info">תצוגה מקדימה של ה-PDF</span>
        <button onClick={handlePrint}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>download</span>
          הורדת PDF
        </button>
        <button onClick={() => window.history.back()} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
          חזרה
        </button>
      </div>

      {/* Pages Container */}
      <div className="pdf-screen-wrapper">
        <CoverPage route={route} />
        {route.days.map((day, i) => (
          <DayPage key={day.day} day={day} route={route} pageNumber={i + 2} />
        ))}
      </div>
    </>
  );
}

export default function PdfPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500 text-lg">טוען...</p>
        </div>
      }
    >
      <PdfContent />
    </Suspense>
  );
}
