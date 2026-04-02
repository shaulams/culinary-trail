'use client';

import { Route } from '@/lib/types';

interface RouteSummaryProps {
  route: Route;
}

export default function RouteSummary({ route }: RouteSummaryProps) {
  return (
    <div className="flex items-center gap-2 text-secondary font-medium text-sm">
      <span>מסלול {route.totalDays} ימים</span>
      <span className="w-1 h-1 bg-outline-variant rounded-full" />
      <span>{route.totalStops} עצירות</span>
      <span className="w-1 h-1 bg-outline-variant rounded-full" />
      <span>{route.regions.length} אזורים</span>
    </div>
  );
}
