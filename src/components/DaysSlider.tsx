'use client';

interface DaysSliderProps {
  value: number;
  onChange: (days: number) => void;
}

export default function DaysSlider({ value, onChange }: DaysSliderProps) {
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-bold text-on-surface">לכמה ימים?</h3>
        <span className="text-primary font-bold text-lg">{value} ימים</span>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {days.map((d) => {
          const isSelected = d <= value;
          return (
            <button
              key={d}
              onClick={() => onChange(d)}
              className={`flex-none flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold transition-all active:scale-95 ${
                isSelected
                  ? 'border-primary bg-primary text-on-primary shadow-md'
                  : 'border-outline/30 text-on-surface-variant'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
