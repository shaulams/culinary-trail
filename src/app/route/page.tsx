'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useCallback } from 'react';
import { Place, Route as RouteType, PLACE_TYPE_ICON, PLACE_TYPE_LABEL, PlaceType } from '@/lib/types';
import { buildRoute } from '@/lib/route-builder';
import { haversineDistance, estimatedDrivingMinutes } from '@/lib/distance';
import RouteMap from '@/components/RouteMap';
import SortableDayCard from '@/components/SortableDayCard';
import RouteSummary from '@/components/RouteSummary';
import ExportPdf from '@/components/ExportPdf';
import ShareButton from '@/components/ShareButton';
import BottomSheet from '@/components/BottomSheet';
import { RoutePageSkeleton } from '@/components/Skeleton';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import StopCard from '@/components/StopCard';
import Link from 'next/link';
import placesJson from '@/data/places.json';

function CompactStopCard({ stop, nextStop, isLast, animationDelay }: { stop: Place; nextStop?: Place; isLast: boolean; animationDelay?: number }) {
  let drivingMin = 0;
  if (nextStop) {
    const dist = haversineDistance(stop, nextStop);
    drivingMin = Math.round(estimatedDrivingMinutes(dist));
  }

  return (
    <StopCard
      place={stop}
      index={0}
      dayColor="#9d3d2e"
      variant="compact"
      drivingMinutes={drivingMin}
      isLast={isLast}
      animationDelay={animationDelay}
    />
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

    // Small delay so skeleton is visible briefly for perceived smoothness
    const timer = setTimeout(() => {
      setRoute(result);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleReorder = useCallback((dayNumber: number, newStops: Place[]) => {
    if (!route) return;
    setRoute((prev) => {
      if (!prev) return prev;
      const newDays = prev.days.map((d) => {
        if (d.day !== dayNumber) return d;
        let totalKm = 0;
        for (let i = 0; i < newStops.length - 1; i++) {
          totalKm += haversineDistance(newStops[i], newStops[i + 1]);
        }
        return {
          ...d,
          stops: newStops,
          totalDrivingKm: Math.round(totalKm),
          estimatedDrivingMinutes: Math.round(estimatedDrivingMinutes(totalKm)),
        };
      });
      const totalKm = newDays.reduce((sum, d) => sum + d.totalDrivingKm, 0);
      return { ...prev, days: newDays, totalDrivingKm: totalKm };
    });
  }, [route]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Header showBack />
        <RoutePageSkeleton />
        <BottomNav active="explore" />
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

  const dayTabs = (
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
  );

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
        <div className="relative" style={{ height: 'calc(100vh - 120px)' }}>
          <div className="w-full h-full bg-surface-container-high">
            <RouteMap route={route} animated />
          </div>

          {/* FABs */}
          <div className="absolute top-4 left-4 flex flex-col gap-3 z-10">
            <ExportPdf route={route} />
            <ShareButton route={route} />
          </div>

          {/* Bottom sheet */}
          <BottomSheet tabs={dayTabs} initialState="collapsed">
            <div className="space-y-6">
              {route.days
                .filter((d) => d.day === activeDay)
                .flatMap((day) =>
                  day.stops.map((stop, i) => (
                    <CompactStopCard
                      key={stop.name}
                      stop={stop}
                      nextStop={i < day.stops.length - 1 ? day.stops[i + 1] : undefined}
                      isLast={i === day.stops.length - 1}
                      animationDelay={i * 100}
                    />
                  ))
                )}
            </div>
          </BottomSheet>
        </div>
      ) : (
        /* CARDS VIEW */
        <main className="max-w-[375px] mx-auto min-h-screen pb-32">
          {route.days.map((day, dayIdx) => (
            <section key={day.day} className="px-6 py-8">
              <SortableDayCard
                dayPlan={day}
                variant="editorial"
                onReorder={handleReorder}
                baseAnimationDelay={dayIdx * 400}
              />
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
        <div className="min-h-screen bg-surface">
          <Header showBack />
          <RoutePageSkeleton />
          <BottomNav active="explore" />
        </div>
      }
    >
      <RouteContent />
    </Suspense>
  );
}
