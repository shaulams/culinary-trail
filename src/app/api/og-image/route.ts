import { NextRequest, NextResponse } from 'next/server';

// In-memory cache for OG images
const ogCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const PLACEHOLDER_URL = '/__og_placeholder';

function extractOgImage(html: string): string | null {
  // Try og:image
  const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (ogMatch?.[1]) return ogMatch[1];

  // Try twitter:image
  const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
  if (twMatch?.[1]) return twMatch[1];

  // Try any large image in article
  const imgMatch = html.match(/<img[^>]*src=["'](https?:\/\/[^"']+(?:\.jpg|\.jpeg|\.png|\.webp)[^"']*)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];

  return null;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  
  if (!url) {
    return NextResponse.json({ imageUrl: PLACEHOLDER_URL }, { status: 200 });
  }

  // Check cache
  const cached = ogCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ imageUrl: cached.url }, {
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Only read first 50KB to find meta tags
    const reader = res.body?.getReader();
    if (!reader) throw new Error('No body');
    
    let html = '';
    const decoder = new TextDecoder();
    while (html.length < 50000) {
      const { done, value } = await reader.read();
      if (done) break;
      html += decoder.decode(value, { stream: true });
    }
    reader.cancel();

    const imageUrl = extractOgImage(html);
    const result = imageUrl || PLACEHOLDER_URL;

    // Cache result
    ogCache.set(url, { url: result, timestamp: Date.now() });

    return NextResponse.json({ imageUrl: result }, {
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
    });
  } catch {
    // Cache failure too (avoid hammering)
    ogCache.set(url, { url: PLACEHOLDER_URL, timestamp: Date.now() });
    return NextResponse.json({ imageUrl: PLACEHOLDER_URL }, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    });
  }
}
