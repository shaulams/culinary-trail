'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegionSelector from '@/components/RegionSelector';
import DaysSlider from '@/components/DaysSlider';
import TypeFilter from '@/components/TypeFilter';

export default function HomePage() {
  const router = useRouter();
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [days, setDays] = useState(3);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleBuildRoute = () => {
    const params = new URLSearchParams();
    if (selectedRegions.length > 0) params.set('regions', selectedRegions.join(','));
    if (selectedTypes.length > 0) params.set('types', selectedTypes.join(','));
    params.set('days', String(days));
    router.push(`/route?${params.toString()}`);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <header className="bg-olive text-white py-10 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            🍽️ שביל הטעמים של ישראל
          </h1>
          <p className="text-olive-light text-lg">
            בנו מסלול קולינרי מותאם אישית ברחבי ישראל
          </p>
          <p className="text-sm mt-2 opacity-80">
            104 מקומות מומלצים מתוך הטור של רונית ורד בהארץ
          </p>
        </div>
      </header>

      {/* Form */}
      <section className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <RegionSelector selected={selectedRegions} onChange={setSelectedRegions} />
        <DaysSlider value={days} onChange={setDays} />
        <TypeFilter selected={selectedTypes} onChange={setSelectedTypes} />

        {/* Build button */}
        <div className="pt-4">
          <button
            onClick={handleBuildRoute}
            className="w-full py-4 bg-terracotta text-white text-xl font-bold rounded-xl hover:bg-terracotta-light transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            🚗 !בנה לי מסלול
          </button>
          <p className="text-center text-xs text-earth mt-2">
            {selectedRegions.length === 0 ? 'כל האזורים' : `${selectedRegions.length} אזורים`}
            {' · '}
            {days} ימים
            {' · '}
            {selectedTypes.length === 0 ? 'כל הסוגים' : `${selectedTypes.length} סוגים`}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-earth border-t border-sand-light">
        <p>
          מבוסס על הטור &quot;פינת אוכל&quot; מאת רונית ורד, הארץ (2017–2026)
        </p>
      </footer>
    </main>
  );
}
