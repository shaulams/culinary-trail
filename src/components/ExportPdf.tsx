'use client';

import { Route, PLACE_TYPE_EMOJI, PlaceType, DAY_COLORS } from '@/lib/types';

interface ExportPdfProps {
  route: Route;
}

export default function ExportPdf({ route }: ExportPdfProps) {
  const handleExport = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // jsPDF doesn't support Hebrew well natively, so we'll use a simple approach
    // with reversed text for basic Hebrew support
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Title page
    doc.setFontSize(24);
    doc.setTextColor(107, 142, 35); // olive
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

      // Day header
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

        // Stop number circle
        doc.setFillColor(r, g, b);
        doc.circle(margin + 5, y + 3, 4, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(`${i + 1}`, margin + 5, y + 5, { align: 'center' });

        // Stop info
        doc.setTextColor(60, 60, 60);
        doc.setFontSize(12);
        doc.text(stop.name, margin + 14, y + 5);

        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        const typeEmoji = PLACE_TYPE_EMOJI[stop.type as PlaceType] || '';
        doc.text(`${typeEmoji} ${stop.type} | ${stop.region}`, margin + 14, y + 11);

        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const desc = stop.description.slice(0, 120) + (stop.description.length > 120 ? '...' : '');
        doc.text(desc, margin + 14, y + 17, { maxWidth: pageWidth - margin * 2 - 14 });

        if (stop.articleUrl) {
          doc.setTextColor(107, 142, 35);
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
      className="px-4 py-2 bg-earth text-white rounded-lg hover:bg-earth-dark transition-colors text-sm font-medium"
    >
      📄 ייצוא ל-PDF
    </button>
  );
}
