'use client';

import { Place, PLACE_TYPE_ICON, PLACE_TYPE_LABEL, PlaceType } from '@/lib/types';

interface StopCardProps {
  place: Place;
  index: number;
  dayColor: string;
  variant?: 'compact' | 'editorial';
  drivingMinutes?: number;
  isLast?: boolean;
}

export default function StopCard({
  place,
  index,
  dayColor,
  variant = 'compact',
  drivingMinutes,
  isLast = false,
}: StopCardProps) {
  const typeIcon = PLACE_TYPE_ICON[place.type as PlaceType] || 'restaurant';
  const typeLabel = PLACE_TYPE_LABEL[place.type as PlaceType] || place.type;

  if (variant === 'editorial') {
    return (
      <div>
        <article className="relative flex flex-col">
          <div className="overflow-hidden rounded-xl bg-surface-container-low">
            {/* Image with gradient */}
            <div className="relative h-64 w-full bg-surface-container-high">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-outline/30">{typeIcon}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c19]/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <span className="bg-secondary px-3 py-1 rounded-full text-on-secondary text-xs font-bold">
                  {typeLabel}
                </span>
                <span className="bg-primary/90 px-3 py-1 rounded-full text-on-primary text-xs font-bold">
                  {place.region}
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="p-5">
              <h3 className="text-2xl font-bold mb-2 text-on-surface">{place.name}</h3>
              <p className="text-on-surface-variant text-base leading-relaxed mb-6">
                {place.description}
              </p>
              <div className="flex flex-row-reverse items-center justify-between">
                {place.articleUrl && (
                  <a
                    href={place.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold text-sm underline underline-offset-4 decoration-primary/30"
                  >
                    לכתבה המלאה
                  </a>
                )}
                {place.mapsLink && (
                  <a
                    href={place.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>near_me</span>
                    נווט לשם
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>

        {/* Driving time connector */}
        {!isLast && drivingMinutes != null && drivingMinutes > 0 && (
          <div className="flex flex-col items-center py-6">
            <div className="w-px h-12 border-r border-dotted border-outline" />
            <div className="bg-surface-container-high px-4 py-1.5 rounded-full flex items-center gap-2">
              <span className="material-symbols-outlined text-xs text-secondary">directions_car</span>
              <span className="text-xs font-medium text-secondary">{drivingMinutes} דק׳ נסיעה</span>
            </div>
            <div className="w-px h-12 border-r border-dotted border-outline" />
          </div>
        )}
      </div>
    );
  }

  // Compact variant (for map bottom sheet)
  return (
    <div className="group relative">
      <div className="flex gap-4">
        {/* Thumbnail placeholder */}
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-2xl text-outline/40">{typeIcon}</span>
        </div>
        <div className="flex flex-col justify-center flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
              {typeLabel}
            </span>
          </div>
          <h3 className="text-lg font-bold text-on-surface leading-tight">{place.name}</h3>
          <p className="text-sm text-on-surface-variant line-clamp-1">{place.description}</p>
        </div>
      </div>
      {/* Driving time */}
      {!isLast && drivingMinutes != null && drivingMinutes > 0 && (
        <div className="mt-4 flex items-center gap-3 text-xs text-secondary font-medium bg-surface-container-high/50 p-2.5 rounded-lg" style={{ borderInlineStart: '4px solid rgba(157,61,46,0.4)' }}>
          <span className="material-symbols-outlined text-sm">directions_car</span>
          <span>{drivingMinutes} דק׳ נסיעה לעצירה הבאה</span>
        </div>
      )}
    </div>
  );
}
