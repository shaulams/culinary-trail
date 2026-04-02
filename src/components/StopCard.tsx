'use client';

import { Place, PLACE_TYPE_EMOJI, PlaceType } from '@/lib/types';

interface StopCardProps {
  place: Place;
  index: number;
  dayColor: string;
}

export default function StopCard({ place, index, dayColor }: StopCardProps) {
  return (
    <div className="bg-white rounded-xl border border-sand-light overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Stop number */}
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: dayColor }}
          >
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            {/* Name and type badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-earth-dark">{place.name}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cream-dark text-earth">
                {PLACE_TYPE_EMOJI[place.type as PlaceType]} {place.type}
              </span>
            </div>
            {/* Region */}
            <p className="text-xs text-sand mt-0.5">{place.region}</p>
            {/* Description */}
            <p className="text-sm text-earth mt-2 leading-relaxed">
              {place.description}
            </p>
            {/* Links */}
            <div className="flex gap-3 mt-3">
              {place.articleUrl && (
                <a
                  href={place.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-olive hover:text-olive-dark underline"
                >
                  📰 לכתבה המלאה
                </a>
              )}
              {place.mapsLink && (
                <a
                  href={place.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-olive hover:text-olive-dark underline"
                >
                  📍 נווט לשם
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
