'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BottomNavProps {
  active?: 'explore' | 'map' | 'saved' | 'menu';
}

const items = [
  { id: 'explore' as const, icon: 'explore', label: 'גילוי', href: '/' },
  { id: 'map' as const, icon: 'map', label: 'מפה', href: '/route' },
  { id: 'saved' as const, icon: 'bookmark', label: 'שמורים', href: '#' },
  { id: 'menu' as const, icon: 'menu', label: 'תפריט', href: '#' },
];

export default function BottomNav({ active }: BottomNavProps) {
  const pathname = usePathname();

  const getActive = () => {
    if (active) return active;
    if (pathname === '/') return 'explore';
    if (pathname?.startsWith('/route')) return 'map';
    return 'explore';
  };

  const currentActive = getActive();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex flex-row-reverse justify-around items-center px-4 pb-6 pt-2 bg-surface rounded-t-xl shadow-[0px_-4px_16px_rgba(160,63,48,0.04)]" style={{ borderTop: '1px solid rgba(221,192,187,0.2)' }}>
      {items.map((item) => {
        const isActive = item.id === currentActive;
        const isDisabled = item.href === '#';

        if (isDisabled) {
          return (
            <span
              key={item.id}
              className="flex flex-col items-center justify-center gap-0.5 text-secondary/30 cursor-not-allowed"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </span>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive ? 'text-primary font-bold' : 'text-secondary/70 hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
