'use client';

import { Route } from '@/lib/types';

interface ShareButtonProps {
  route: Route;
}

export default function ShareButton({ route }: ShareButtonProps) {
  const getShareText = () => {
    const lines = [
      `🍽️ מסלול קולינרי בישראל — ${route.totalDays} ימים, ${route.totalStops} עצירות`,
      '',
    ];
    route.days.forEach((day) => {
      lines.push(`📅 יום ${day.day}:`);
      day.stops.forEach((stop, i) => {
        lines.push(`  ${i + 1}. ${stop.name} (${stop.type}) — ${stop.region}`);
      });
      lines.push('');
    });
    lines.push('נוצר באמצעות שביל הטעמים של ישראל 🇮🇱');
    return lines.join('\n');
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      alert('הועתק!');
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = getShareText();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('הועתק!');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={shareWhatsApp}
        className="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#1DA855] transition-colors text-sm font-medium"
      >
        📱 שיתוף בוואטסאפ
      </button>
      <button
        onClick={copyToClipboard}
        className="px-4 py-2 bg-sand text-white rounded-lg hover:bg-earth transition-colors text-sm font-medium"
      >
        📋 העתקה
      </button>
    </div>
  );
}
