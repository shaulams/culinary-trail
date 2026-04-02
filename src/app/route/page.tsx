'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Place, Route as RouteType, PLACE_TYPE_ICON, PLACE_TYPE_LABEL, PlaceType } from '@/lib/types';
import { buildRoute } from '@/lib/route-builder';
import { haversineDistance, estimatedDrivingMinutes } from '@/lib/distance';
import RouteMap from '@/components/RouteMap';
import DayCard from '@/components/DayCard';
import RouteSummary from '@/components/RouteSummary';
import ExportPdf from '@/components/ExportPdf';
import ShareButton from '@/components/ShareButton';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
import placesJson from '@/data/places.json';

function CompactStopCard({ stop, nextStop, isLast }: { stop: Place; nextStop?: Place; isLast: boolean }) {
  const typeIcon = PLACE_TYPE_ICON[stop.type as PlaceType] || 'restaurant';
  const typeLabel = PLACE_TYPE_LABEL[stop.type as PlaceType] || stop.type;
  let drivingMin = 0;
  if (nextStop) {
    const dist = haversineDistance(stop, nextStop);
    drivingMin = Math.round(estimatedDrivingMinutes(dist));
  }

  return (
    <div>
      <div className="flex gap-4">
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl text-outline/40">{typeIcon}</span>
        </div>
        <div className="flex flex-col justify-center flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
              {typeLabel}
            </span>
          </div>
          <h3 className="text-lg font-bold text-on-surface leading-tight">{stop.name}</h3>
          <p className="text-sm text-on-surface-variant line-clamp-1">{stop.description}</p>
        </div>
      </div>
      {!isLast && drivingMin > 0 && (
        <div className="mt-4 flex items-center gap-3 text-xs text-secondary font-medium bg-surface-container-high/50 p-2.5 rounded-lg" style={{ borderInlineStart: '4px solid rgba(157,61,46,0.4)' }}>
          <span className="material-symbols-outlined text-sm">directions_car</span>
          <span>{drivingMin} דק׳ נסיעה לעצירה הבאה</span>
        </div>
      )}
    </div>
  );
}

function RouteContent() {
  const searchParams = useSearchParams();
  const [route, setRoute] = useState<RouteType | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'map' | 'cards'>('cards');
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    const regions = searchParams.get('regions')?.split(',').filter(Boolean) || [];
    const types = searchParams.get('types')?.split(',').filter(Boolean) || [];
    const days = Number(searchParams.get('days')) || 3;

    const places = (placesJson as Place[]).filter((p) => p.lat && p.lng);

    const result = buildRoute({
      places,
      selectedRegions: regions,
      selectedTypes: types,
      days,
    });

    setRoute(result);
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-on-surface-variant text-lg">בונה את המסלול שלך...</p>
      </div>
    );
  }

  if (!route || route.totalStops === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 bg-surface">
        <span className="material-symbols-outlined text-6xl text-outline/40">search_off</span>
        <p className="text-on-surface-variant text-lg text-center">
          לא נמצאו מקומות מתאימים. נסו לבחור אזורים או סוגים אחרים.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary text-on-primary rounded-full font-bold hover:bg-primary-container transition-colors"
        >
          חזרה לבחירה
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header showBack />

      {/* Summary bar */}
      <div className="bg-surface-container-low px-6 py-3 flex justify-between items-center">
        <RouteSummary route={route} />
        <button
          onClick={() => setView(view === 'map' ? 'cards' : 'map')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-primary hover:bg-surface-variant transition-colors"
          style={{ border: '1px solid rgba(221,192,187,0.3)' }}
        >
          <span className="material-symbols-outlined text-sm">
            {view === 'map' ? 'view_agenda' : 'map'}
          </span>
          {view === 'map' ? 'תצוגת כרטיסים' : 'תצוגת מפה'}
        </button>
      </div>

      {view === 'map' ? (
        /* MAP VIEW */
        <div className="relative">
          <div className="w-full h-[60vh] bg-surface-container-high">
            <RouteMap route={route} />
          </div>

          {/* FABs */}
          <div className="absolute top-4 left-4 flex flex-col gap-3 z-10">
            <ExportPdf route={route} />
            <ShareButton route={route} />
          </div>

          {/* Bottom sheet */}
          <section className="bg-surface rounded-t-[2rem] shadow-[0px_-12px_32px_rgba(160,63,48,0.06)] flex flex-col" style={{ borderTop: '1px solid rgba(221,192,187,0.1)' }}>
            <div className="w-full flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-outline-variant/40 rounded-full" />
            </div>

            <div className="flex justify-around px-6 py-4" style={{ borderBottom: '1px solid rgba(221,192,187,0.1)' }}>
              {route.days.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(day.day)}
                  className={`text-sm flex flex-col items-center gap-1 ${
                    activeDay === day.day
                      ? 'text-primary font-bold'
                      : 'text-on-surface-variant/60 font-medium'
                  }`}
                >
                  יום {day.day}
                  {activeDay === day.day && (
                    <span className="w-1 h-1 bg-primary rounded-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24">
              {route.days
                .filter((d) => d.day === activeDay)
                .flatMap((day) =>
                  day.stops.map((stop, i) => (
                    <CompactStopCard
                      key={stop.name}
                      stop={stop}
                      nextStop={i < day.stops.length - 1 ? day.stops[i + 1] : undefined}
                      isLast={i === day.stops.length - 1}
                    />
                  ))
                )}
            </div>
          </section>
        </div>
      ) : (
        /* CARDS VIEW */
        <main className="max-w-[375px] mx-auto min-h-screen pb-32">
          {route.days.map((day) => (
            <section key={day.day} className="px-6 py-8">
              <DayCard dayPlan={day} variant="editorial" />
            </section>
          ))}

          <section className="px-6 pb-8">
            <Link
              href={`/route/pdf?${searchParams.toString()}`}
              className="w-full py-4 bg-secondary text-on-secondary rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">picture_as_pdf</span>
              תצוגת PDF
            </Link>
          </section>

          <footer className="px-6 pb-12 text-center">
            <p className="text-on-surface-variant/60 text-xs font-medium">
              מבוסס על הטור ״פינת אוכל״ מאת רונית ורד, הארץ
            </p>
          </footer>
        </main>
      )}

      <BottomNav active={view === 'map' ? 'map' : 'explore'} />
    </div>
  );
}

export default function RoutePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <p className="text-on-surface-variant text-lg">טוען...</p>
        </div>
      }
    >
      <RouteContent />
    </Suspense>
  );
}
