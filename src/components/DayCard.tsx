'use client';

import { DayPlan } from '@/lib/types';
import StopCard from './StopCard';
import { haversineDistance, estimatedDrivingMinutes } from '@/lib/distance';

interface DayCardProps {
  dayPlan: DayPlan;
  variant?: 'compact' | 'editorial';
}

export default function DayCard({ dayPlan, variant = 'editorial' }: DayCardProps) {
  // Determine primary region for this day
  const regionCounts: Record<string, number> = {};
  dayPlan.stops.forEach((s) => {
    regionCounts[s.region] = (regionCounts[s.region] || 0) + 1;
  });
  const primaryRegion = Object.entries(regionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

  return (
    <div className="space-y-4">
      {/* Day header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-bold text-on-surface leading-tight -mr-1">
          יום {dayPlan.day}: {primaryRegion}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="material-symbols-outlined text-secondary text-lg">schedule</span>
          <span className="text-secondary font-medium text-sm">
            {dayPlan.estimatedDrivingMinutes} דק׳ נסיעה סה״כ
          </span>
        </div>
      </div>

      {/* Stops */}
      <div className={variant === 'editorial' ? 'flex flex-col' : 'space-y-6'}>
        {dayPlan.stops.map((stop, i) => {
          // Calculate driving minutes to next stop
          let drivingMin = 0;
          if (i < dayPlan.stops.length - 1) {
            const dist = haversineDistance(stop, dayPlan.stops[i + 1]);
            drivingMin = Math.round(estimatedDrivingMinutes(dist));
          }
          return (
            <StopCard
              key={stop.name}
              place={stop}
              index={i}
              dayColor="#9d3d2e"
              variant={variant}
              drivingMinutes={drivingMin}
              isLast={i === dayPlan.stops.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
}
