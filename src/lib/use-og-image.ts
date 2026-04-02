'use client';

import { useState, useEffect } from 'react';

const PLACEHOLDER_URL = '/__og_placeholder';

// Client-side cache across component instances
const clientCache = new Map<string, string | null>();

export function useOgImage(articleUrl: string | undefined) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    articleUrl ? (clientCache.get(articleUrl) ?? null) : null
  );
  const [loading, setLoading] = useState(!!articleUrl && !clientCache.has(articleUrl));

  useEffect(() => {
    if (!articleUrl) {
      setLoading(false);
      return;
    }

    // Already cached
    if (clientCache.has(articleUrl)) {
      const cached = clientCache.get(articleUrl)!;
      setImageUrl(cached === PLACEHOLDER_URL ? null : cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    
    const fetchImage = async () => {
      try {
        const res = await fetch(`/api/og-image?url=${encodeURIComponent(articleUrl)}`);
        const data = await res.json();
        
        if (!cancelled) {
          clientCache.set(articleUrl, data.imageUrl);
          setImageUrl(data.imageUrl === PLACEHOLDER_URL ? null : data.imageUrl);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          clientCache.set(articleUrl, PLACEHOLDER_URL);
          setImageUrl(null);
          setLoading(false);
        }
      }
    };

    fetchImage();
    return () => { cancelled = true; };
  }, [articleUrl]);

  return { imageUrl, loading };
}
