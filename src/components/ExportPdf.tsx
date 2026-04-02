'use client';

import { Route, PLACE_TYPE_ICON, PlaceType, DAY_COLORS } from '@/lib/types';

interface ExportPdfProps {
  route: Route;
}

export default function ExportPdf({ route }: ExportPdfProps) {
  const handleExport = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Title page
    doc.setFontSize(24);
    doc.setTextColor(157, 61, 46); // primary
    doc.text('Israel Culinary Trail', pageWidth / 2, 40, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `${route.totalDays} Days | ${route.totalStops} Stops | ${route.totalDrivingKm} km`,
      pageWidth / 2,
      55,
      { align: 'center' }
    );

    doc.setFontSize(10);
    doc.text(
      `Regions: ${route.regions.join(', ')}`,
      pageWidth / 2,
      65,
      { align: 'center', maxWidth: pageWidth - margin * 2 }
    );

    // Day pages
    route.days.forEach((day) => {
      doc.addPage();
      const color = DAY_COLORS[(day.day - 1) % DAY_COLORS.length];
      const [r, g, b] = [
        parseInt(color.slice(1, 3), 16),
        parseInt(color.slice(3, 5), 16),
        parseInt(color.slice(5, 7), 16),
      ];

      doc.setFillColor(r, g, b);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.text(`Day ${day.day}`, pageWidth / 2, 16, { align: 'center' });

      doc.setFontSize(9);
      doc.text(
        `${day.stops.length} stops | ${day.totalDrivingKm} km | ~${day.estimatedDrivingMinutes} min driving`,
        pageWidth / 2,
        22,
        { align: 'center' }
      );

      let y = 35;

      day.stops.forEach((stop, i) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }

        doc.setFillColor(r, g, b);
        doc.circle(margin + 5, y + 3, 4, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(`${i + 1}`, margin + 5, y + 5, { align: 'center' });

        doc.setTextColor(27, 28, 25); // on-surface
        doc.setFontSize(12);
        doc.text(stop.name, margin + 14, y + 5);

        doc.setFontSize(9);
        doc.setTextColor(86, 66, 62); // on-surface-variant
        doc.text(`${stop.type} | ${stop.region}`, margin + 14, y + 11);

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const desc = stop.description.slice(0, 120) + (stop.description.length > 120 ? '...' : '');
        doc.text(desc, margin + 14, y + 17, { maxWidth: pageWidth - margin * 2 - 14 });

        if (stop.articleUrl) {
          doc.setTextColor(157, 61, 46); // primary
          doc.textWithLink('Article link', margin + 14, y + 25, { url: stop.articleUrl });
        }

        y += 32;
      });
    });

    doc.save('culinary-trail-route.pdf');
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
