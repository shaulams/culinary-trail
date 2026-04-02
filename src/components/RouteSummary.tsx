'use client';

import { Route } from '@/lib/types';

interface RouteSummaryProps {
  route: Route;
}

export default function RouteSummary({ route }: RouteSummaryProps) {
  return (
    <div className="bg-white rounded-xl border border-sand-light p-4 shadow-sm">
      <h3 className="font-bold text-earth-dark mb-3">📊 סיכום המסלול</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-cream rounded-lg">
          <p className="text-2xl font-bold text-olive">{route.totalDays}</p>
          <p className="text-xs text-earth">ימים</p>
        </div>
        <div className="text-center p-3 bg-cream rounded-lg">
          <p className="text-2xl font-bold text-terracotta">{route.totalStops}</p>
          <p className="text-xs text-earth">עצירות</p>
        </div>
        <div className="text-center p-3 bg-cream rounded-lg">
          <p className="text-2xl font-bold text-earth-dark">{route.regions.length}</p>
          <p className="text-xs text-earth">אזורים</p>
        </div>
        <div className="text-center p-3 bg-cream rounded-lg">
          <p className="text-2xl font-bold text-sand">{route.totalDrivingKm}</p>
          <p className="text-xs text-earth">ק״מ נסיעה</p>
        </div>
      </div>
    </div>
  );
}
