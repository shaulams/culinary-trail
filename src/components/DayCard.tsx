'use client';

import { DayPlan, DAY_COLORS } from '@/lib/types';
import StopCard from './StopCard';

interface DayCardProps {
  dayPlan: DayPlan;
}

export default function DayCard({ dayPlan }: DayCardProps) {
  const color = DAY_COLORS[(dayPlan.day - 1) % DAY_COLORS.length];

  return (
    <div className="space-y-3">
      {/* Day header */}
      <div
        className="flex items-center gap-3 px-4 py-2 rounded-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: color }}
        >
          {dayPlan.day}
        </div>
        <div>
          <h3 className="font-bold text-earth-dark">יום {dayPlan.day}</h3>
          <p className="text-xs text-earth">
            {dayPlan.stops.length} עצירות
            {dayPlan.totalDrivingKm > 0 && (
              <>
                {' '}
                · {dayPlan.totalDrivingKm} ק״מ · ~{dayPlan.estimatedDrivingMinutes} דקות נסיעה
              </>
            )}
          </p>
        </div>
      </div>
      {/* Stops */}
      <div className="space-y-3 ps-2">
        {dayPlan.stops.map((stop, i) => (
          <StopCard key={stop.name} place={stop} index={i} dayColor={color} />
        ))}
      </div>
    </div>
  );
}
