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
    <div className="space-y-5">
      <h3 className="text-xl font-bold text-on-surface">באיזה אזור נסייר?</h3>
      
      {/* Region group pills */}
      <div className="flex flex-wrap gap-3">
        {REGION_GROUPS.map((group) => {
          const allGroupSelected = group.regions.every((r) => selected.includes(r));
          return (
            <button
              key={group.label}
              onClick={() => toggleGroup(group.regions)}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all active:scale-[0.98] ${
                allGroupSelected
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
              }`}
            >
              {allGroupSelected && (
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              )}
              <span className="font-medium">{group.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-region chips */}
      {REGION_GROUPS.map((group) => {
        const someSelected = group.regions.some((r) => selected.includes(r));
        if (!someSelected) return null;
        return (
          <div key={group.label} className="flex flex-wrap gap-2">
            {group.regions.map((region) => (
              <button
                key={region}
                onClick={() => toggleRegion(region)}
                className={`px-4 py-2 rounded-full text-sm transition-all active:scale-[0.98] ${
                  selected.includes(region)
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {selected.includes(region) && (
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  )}
                  {region}
                </span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
