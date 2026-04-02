'use client';

import { Route } from '@/lib/types';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface ExportPdfProps {
  route: Route;
}

export default function ExportPdf({ route }: ExportPdfProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleExport = () => {
    // Navigate to the PDF preview page which handles printing
    router.push(`/route/pdf?${searchParams.toString()}`);
  };

  return (
    <button
      onClick={handleExport}
      className="w-12 h-12 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg active:scale-95 transition-transform"
      title="ייצוא ל-PDF"
    >
      <span className="material-symbols-outlined">picture_as_pdf</span>
    </button>
  );
}
