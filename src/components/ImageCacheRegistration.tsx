'use client';

import { useEffect } from 'react';

/**
 * Registers a small image-only Service Worker after the first paint.
 * All route and application data requests stay on the normal network path.
 */
export function ImageCacheRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
    const timer = window.setTimeout(() => {
      void navigator.serviceWorker.register('/image-cache-sw.js', { scope: '/' }).catch(() => {
        // Offline image caching is an enhancement, never a requirement to browse.
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
