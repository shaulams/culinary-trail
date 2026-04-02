'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegionSelector from '@/components/RegionSelector';
import DaysSlider from '@/components/DaysSlider';
import TypeFilter from '@/components/TypeFilter';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

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
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="max-w-md mx-auto pb-32">
        {/* Hero */}
        <section className="px-6 pt-8 pb-12 overflow-hidden">
          <div className="relative">
            <h2 className="text-5xl font-bold text-primary leading-[1.1] mb-4 -mr-2 relative z-10">
              שביל הטעמים<br />של ישראל
            </h2>
            <div className="absolute -top-4 -left-8 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-0" />
          </div>
          <p className="text-lg text-secondary/80 max-w-[280px] font-medium leading-relaxed">
            בנו מסלול קולינרי מותאם אישית — מהגולן ועד הנגב
          </p>
        </section>

        {/* Form sections */}
        <div className="space-y-12">
          <section className="px-6">
            <RegionSelector selected={selectedRegions} onChange={setSelectedRegions} />
          </section>

          <section className="px-6">
            <DaysSlider value={days} onChange={setDays} />
          </section>

          <section className="px-6">
            <TypeFilter selected={selectedTypes} onChange={setSelectedTypes} />
          </section>

          {/* Build button */}
          <section className="px-6 pt-4">
            <button
              onClick={handleBuildRoute}
              className="w-full py-5 bg-primary text-on-primary rounded-xl font-bold text-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
            >
              בנה לי מסלול!
            </button>
          </section>

          {/* Footer credit */}
          <footer className="px-6 pb-12 text-center">
            <p className="text-on-surface-variant/60 text-xs font-medium">
              מבוסס על הטור ״פינת אוכל״ מאת רונית ורד, הארץ
            </p>
          </footer>
        </div>
      </main>

      <BottomNav active="explore" />
    </div>
  );
}
