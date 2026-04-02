'use client';

import { REGION_GROUPS } from '@/lib/types';

interface RegionSelectorProps {
  selected: string[];
  onChange: (regions: string[]) => void;
}

export default function RegionSelector({ selected, onChange }: RegionSelectorProps) {
  const toggleRegion = (region: string) => {
    if (selected.includes(region)) {
      onChange(selected.filter((r) => r !== region));
    } else {
      onChange([...selected, region]);
    }
  };

  const toggleGroup = (groupRegions: string[]) => {
    const allSelected = groupRegions.every((r) => selected.includes(r));
    if (allSelected) {
      onChange(selected.filter((r) => !groupRegions.includes(r)));
    } else {
      onChange([...new Set([...selected, ...groupRegions])]);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-earth-dark">🗺️ אזורים</h3>
      {REGION_GROUPS.map((group) => {
        const allGroupSelected = group.regions.every((r) => selected.includes(r));
        return (
          <div key={group.label} className="space-y-2">
            <button
              onClick={() => toggleGroup(group.regions)}
              className={`font-semibold text-sm px-3 py-1 rounded-full transition-colors ${
                allGroupSelected
                  ? 'bg-olive text-white'
                  : 'bg-cream-dark text-earth-dark hover:bg-sand-light'
              }`}
            >
              {group.label}
            </button>
            <div className="flex flex-wrap gap-2">
              {group.regions.map((region) => (
                <label
                  key={region}
                  className={`cursor-pointer text-sm px-3 py-1.5 rounded-lg border transition-all ${
                    selected.includes(region)
                      ? 'bg-olive/10 border-olive text-olive-dark font-medium'
                      : 'bg-white border-sand-light text-earth hover:border-sand'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(region)}
                    onChange={() => toggleRegion(region)}
                    className="sr-only"
                  />
                  {region}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
