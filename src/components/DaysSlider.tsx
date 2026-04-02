'use client';

interface DaysSliderProps {
  value: number;
  onChange: (days: number) => void;
}

export default function DaysSlider({ value, onChange }: DaysSliderProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-earth-dark">📅 מספר ימים</h3>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min={1}
          max={7}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-2xl font-bold text-olive min-w-[2ch] text-center">
          {value}
        </span>
      </div>
      <div className="flex justify-between text-xs text-earth px-1" dir="ltr">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
      </div>
    </div>
  );
}
