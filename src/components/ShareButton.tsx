'use client';

import { Route } from '@/lib/types';

interface ShareButtonProps {
  route: Route;
}

export default function ShareButton({ route }: ShareButtonProps) {
  const getShareText = () => {
    const lines = [
      `שביל הטעמים של ישראל — מסלול קולינרי: ${route.totalDays} ימים, ${route.totalStops} עצירות`,
      '',
    ];
    route.days.forEach((day) => {
      lines.push(`יום ${day.day}:`);
      day.stops.forEach((stop, i) => {
        lines.push(`  ${i + 1}. ${stop.name} (${stop.type}) — ${stop.region}`);
      });
      lines.push('');
    });
    lines.push('נוצר באמצעות שביל הטעמים של ישראל');
    return lines.join('\n');
  };

  const handleShare = async () => {
    const text = getShareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: 'שביל הטעמים של ישראל', text });
        return;
      } catch {
        // fallback
      }
    }
    // WhatsApp fallback
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <button
      onClick={handleShare}
      className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      title="שיתוף"
    >
      <span className="material-symbols-outlined">share</span>
    </button>
  );
}
