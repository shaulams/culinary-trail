import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'שביל הטעמים של ישראל',
  description:
    'בנו מסלול קולינרי מותאם אישית ברחבי ישראל — מסעדות, יקבים, מאפיות, שווקים ועוד',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alef:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-[var(--font-alef)]">{children}</body>
    </html>
  );
}
