'use client';

interface BottomNavProps {
  active?: 'explore' | 'map' | 'saved' | 'menu';
}

const items = [
  { id: 'explore' as const, icon: 'explore', label: 'גילוי' },
  { id: 'map' as const, icon: 'map', label: 'מפה' },
  { id: 'saved' as const, icon: 'bookmark', label: 'שמורים' },
  { id: 'menu' as const, icon: 'menu', label: 'תפריט' },
];

export default function BottomNav({ active = 'explore' }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex flex-row-reverse justify-around items-center px-4 pb-6 pt-2 bg-surface rounded-t-xl shadow-[0px_-4px_16px_rgba(160,63,48,0.04)]" style={{ borderTop: '1px solid rgba(221,192,187,0.2)' }}>
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            className={`flex flex-col items-center justify-center gap-0.5 ${
              isActive ? 'text-primary font-bold' : 'text-secondary/70'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
