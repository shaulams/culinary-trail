'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Place, Route as RouteType, PLACE_TYPE_LABEL, PlaceType, DAY_COLORS } from '@/lib/types';
import { buildRoute } from '@/lib/route-builder';
import { haversineDistance, estimatedDrivingMinutes } from '@/lib/distance';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import placesJson from '@/data/places.json';

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

  const handleDownload = async () => {
    if (!route) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    doc.setFontSize(24);
    doc.setTextColor(157, 61, 46);
    doc.text('Israel Culinary Trail', pageWidth / 2, 40, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text(`${route.totalDays} Days | ${route.totalStops} Stops | ${route.totalDrivingKm} km`, pageWidth / 2, 55, { align: 'center' });

    route.days.forEach((day) => {
      doc.addPage();
      const color = DAY_COLORS[(day.day - 1) % DAY_COLORS.length];
      const [r, g, b] = [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)];
      doc.setFillColor(r, g, b);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text(`Day ${day.day}`, pageWidth / 2, 16, { align: 'center' });
      doc.setFontSize(9);
      doc.text(`${day.stops.length} stops | ${day.totalDrivingKm} km`, pageWidth / 2, 22, { align: 'center' });

      let y = 35;
      day.stops.forEach((stop, i) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFillColor(r, g, b);
        doc.circle(margin + 5, y + 3, 4, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(`${i + 1}`, margin + 5, y + 5, { align: 'center' });
        doc.setTextColor(27, 28, 25);
        doc.setFontSize(12);
        doc.text(stop.name, margin + 14, y + 5);
        doc.setFontSize(9);
        doc.setTextColor(86, 66, 62);
        doc.text(`${stop.type} | ${stop.region}`, margin + 14, y + 11);
        doc.setFontSize(8);
        const desc = stop.description.slice(0, 120) + (stop.description.length > 120 ? '...' : '');
        doc.text(desc, margin + 14, y + 17, { maxWidth: pageWidth - margin * 2 - 14 });
        y += 32;
      });
    });

    doc.save('culinary-trail-route.pdf');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant text-lg">טוען...</p>
      </div>
    );
  }

  if (!route) return null;

  // Generate time estimates per stop
  const getStopTime = (dayIndex: number, stopIndex: number): string => {
    const baseHour = 9;
    let totalMinutes = 0;
    for (let s = 0; s < stopIndex; s++) {
      totalMinutes += 45; // ~45min per stop
      if (s < route.days[dayIndex].stops.length - 1) {
        const dist = haversineDistance(route.days[dayIndex].stops[s], route.days[dayIndex].stops[s + 1]);
        totalMinutes += Math.round(estimatedDrivingMinutes(dist));
      }
    }
    const hours = baseHour + Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-surface-container">
      <Header showBack />

      <main className="pt-4 pb-32 px-4 flex flex-col items-center">
        {/* Paper preview */}
        <div className="w-full max-w-[375px] bg-surface shadow-[0px_12px_32px_rgba(160,63,48,0.06)] overflow-hidden relative mb-8 min-h-[600px]" style={{ border: '1px solid rgba(221,192,187,0.2)' }}>
          {/* Cover section */}
          <div className="p-8 text-center mb-8" style={{ borderBottom: '2px solid rgba(157,61,46,0.1)' }}>
            <div className="mb-4">
              <span className="text-primary text-4xl font-bold tracking-tighter">שביל הטעמים</span>
              <div className="text-secondary font-medium tracking-widest text-xs mt-1">של ישראל</div>
            </div>
            <h2 className="text-2xl text-on-surface-variant mb-6">המסלול הקולינרי שלכם</h2>

            {/* Summary stats */}
            <div className="flex justify-center gap-6 py-4" style={{ borderTop: '1px solid rgba(221,192,187,0.3)', borderBottom: '1px solid rgba(221,192,187,0.3)' }}>
              <div className="text-center">
                <p className="text-xs text-secondary/70 font-bold">משך</p>
                <p className="text-lg text-primary font-bold">{route.totalDays} ימים</p>
              </div>
              <div className="w-px bg-outline-variant/30" />
              <div className="text-center">
                <p className="text-xs text-secondary/70 font-bold">עצירות</p>
                <p className="text-lg text-primary font-bold">{route.totalStops} עצירות</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-on-surface-variant/60 font-medium">
              הופק בתאריך: {new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Timeline */}
          <div className="px-8 pb-12">
            {route.days.map((day, dayIdx) => {
              // Determine primary region
              const regionCounts: Record<string, number> = {};
              day.stops.forEach((s) => { regionCounts[s.region] = (regionCounts[s.region] || 0) + 1; });
              const primaryRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

              return (
                <div key={day.day} className="mb-10 relative">
                  {/* Vertical timeline line */}
                  <div className="absolute -right-4 top-0 bottom-0 w-px bg-secondary/20" />
                  <div className="absolute -right-[7px] top-1 w-3 h-3 rounded-full bg-secondary" />

                  <h3 className="text-2xl text-secondary mb-6 pr-4 font-bold">
                    יום {day.day}: {primaryRegion}
                  </h3>

                  {day.stops.map((stop, stopIdx) => (
                    <div key={stop.name} className="mb-8 pr-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-on-surface text-lg">{stop.name}</h4>
                        <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded text-secondary font-bold">
                          {getStopTime(dayIdx, stopIdx)}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed mb-2">
                        {stop.description}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-secondary/80 font-medium">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {stop.region}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Download button */}
        <div className="w-full max-w-[375px] px-4">
          <button
            onClick={handleDownload}
            className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-3 hover:bg-primary-container transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">download</span>
            הורדת PDF
          </button>
          <p className="text-center text-secondary/60 text-xs mt-4">הקובץ מוכן להדפסה בפורמט A4</p>
        </div>
      </main>

      <BottomNav active="saved" />
    </div>
  );
}

export default function PdfPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <p className="text-on-surface-variant text-lg">טוען...</p>
        </div>
      }
    >
      <PdfContent />
    </Suspense>
  );
}
