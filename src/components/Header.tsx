'use client';

import { useRouter } from 'next/navigation';

interface HeaderProps {
  showBack?: boolean;
  onShare?: () => void;
}

export default function Header({ showBack = false, onShare }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-surface sticky top-0 z-50 flex flex-row-reverse justify-between items-center w-full px-6 py-4">
      <div className="flex items-center gap-4">
        {onShare ? (
          <button onClick={onShare} className="hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-primary">share</span>
          </button>
        ) : (
          <span className="material-symbols-outlined text-primary opacity-0">share</span>
        )}
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-primary">
        שביל הטעמים
      </h1>
      <div className="flex items-center">
        {showBack ? (
          <button onClick={() => router.back()} className="hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-primary">arrow_forward</span>
          </button>
        ) : (
          <span className="material-symbols-outlined text-primary opacity-0">arrow_forward</span>
        )}
      </div>
    </header>
  );
}
