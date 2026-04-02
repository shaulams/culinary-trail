'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { Place, Route as RouteType } from '@/lib/types';
import { buildRoute } from '@/lib/route-builder';
import RouteMap from '@/components/RouteMap';
import DayCard from '@/components/DayCard';
import RouteSummary from '@/components/RouteSummary';
import ExportPdf from '@/components/ExportPdf';
import ShareButton from '@/components/ShareButton';
import Link from 'next/link';
import placesJson from '@/data/places.json';

function RouteContent() {
  const searchParams = useSearchParams();
  const [route, setRoute] = useState<RouteType | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-earth text-lg">בונה את המסלול שלך...</p>
      </div>
    );
  }

  if (!route || route.totalStops === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-earth text-lg text-center">
          😕 לא נמצאו מקומות מתאימים. נסו לבחור אזורים או סוגים אחרים.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-olive text-white rounded-lg hover:bg-olive-dark transition-colors"
        >
          ← חזרה לבחירה
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-olive text-white py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-olive-light hover:text-white text-sm">
            ← מסלול חדש
          </Link>
          <h1 className="text-lg font-bold">🍽️ המסלול שלך</h1>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Summary */}
        <RouteSummary route={route} />

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <ExportPdf route={route} />
          <ShareButton route={route} />
        </div>

        {/* Map + Days layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <RouteMap route={route} />
          </div>

          {/* Day cards */}
          <div className="space-y-6">
            {route.days.map((day) => (
              <DayCard key={day.day} dayPlan={day} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-earth border-t border-sand-light mt-8">
        <p>
          מבוסס על הטור &quot;פינת אוכל&quot; מאת רונית ורד, הארץ (2017–2026)
        </p>
      </footer>
    </main>
  );
}

export default function RoutePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-earth text-lg">טוען...</p>
        </div>
      }
    >
      <RouteContent />
    </Suspense>
  );
}
