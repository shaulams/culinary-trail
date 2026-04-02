'use client';

import { PLACE_TYPES, PLACE_TYPE_ICON, PLACE_TYPE_LABEL, PlaceType } from '@/lib/types';

interface TypeFilterProps {
  selected: string[];
  onChange: (types: string[]) => void;
}

export default function TypeFilter({ selected, onChange }: TypeFilterProps) {
  const toggleType = (type: string) => {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  };

  return (
    <div className="space-y-5">
      <h3 className="text-xl font-bold text-on-surface">מה תרצו לטעום?</h3>
      <div className="grid grid-cols-2 gap-3">
        {PLACE_TYPES.map((type) => {
          const isSelected = selected.includes(type);
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group ${
                isSelected
                  ? 'bg-surface-container-low border-2 border-primary/20'
                  : 'bg-surface-container-low border-2 border-transparent hover:bg-surface-container'
              }`}
            >
              <span
                className={`material-symbols-outlined text-3xl group-hover:scale-110 transition-transform ${
                  isSelected ? 'text-primary' : 'text-secondary'
                }`}
              >
                {PLACE_TYPE_ICON[type as PlaceType]}
              </span>
              <span
                className={`text-sm ${
                  isSelected ? 'font-bold text-primary' : 'font-medium text-on-surface'
                }`}
              >
                {PLACE_TYPE_LABEL[type as PlaceType]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
