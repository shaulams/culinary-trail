'use client';

import { PLACE_TYPES, PLACE_TYPE_EMOJI, PlaceType } from '@/lib/types';

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

  const selectAll = () => {
    if (selected.length === PLACE_TYPES.length) {
      onChange([]);
    } else {
      onChange([...PLACE_TYPES]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-earth-dark">🍴 סוגי מקומות</h3>
        <button
          onClick={selectAll}
          className="text-xs text-olive hover:text-olive-dark underline"
        >
          {selected.length === PLACE_TYPES.length ? 'נקה הכל' : 'בחר הכל'}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {PLACE_TYPES.map((type) => (
          <label
            key={type}
            className={`cursor-pointer text-sm px-3 py-1.5 rounded-lg border transition-all ${
              selected.includes(type)
                ? 'bg-terracotta/10 border-terracotta text-terracotta font-medium'
                : 'bg-white border-sand-light text-earth hover:border-sand'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(type)}
              onChange={() => toggleType(type)}
              className="sr-only"
            />
            {PLACE_TYPE_EMOJI[type as PlaceType]} {type}
          </label>
        ))}
      </div>
    </div>
  );
}
