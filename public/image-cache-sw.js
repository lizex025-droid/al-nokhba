/* Al Nokhba: image-only, bounded, persistent cache. Never cache APIs or student data. */
const IMAGE_CACHE = 'nokhba-public-images-v1';
const IMAGE_CACHE_PREFIX = 'nokhba-public-images-';
const MAX_IMAGES = 48;
const R2_HOST = 'pub-7353766376b14b8fa88b7a2a55859c04.r2.dev';
const IMAGE_EXT = /\.(?:avif|webp|png|jpe?g|gif|svg)$/i;

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(IMAGE_CACHE_PREFIX) && name !== IMAGE_CACHE)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

function publicImage(request) {
  if (request.method !== 'GET' || request.destination !== 'image') return false;
  const url = new URL(request.url);
  if (!IMAGE_EXT.test(url.pathname)) return false;
  if (url.origin === self.location.origin) {
    return url.pathname.startsWith('/materials/') ||
      url.pathname.startsWith('/ai/') ||
      url.pathname.startsWith('/al-nokhba-logo');
  }
  return url.hostname === R2_HOST && url.protocol === 'https:';
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (!publicImage(request)) return;

  event.respondWith((async () => {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    // R2's public cross-origin images can be opaque (no-cors). Both successful
    // normal responses and opaque image responses are safe to store as images.
    if (response.ok || response.type === 'opaque') {
      const copy = response.clone();
      event.waitUntil((async () => {
        try {
          await cache.put(request, copy);
          const keys = await cache.keys();
          if (keys.length > MAX_IMAGES) {
            await Promise.all(keys.slice(0, keys.length - MAX_IMAGES).map(key => cache.delete(key)));
          }
        } catch {
          // Low-storage / private-browsing devices continue loading normally.
        }
      })());
    }
    return response;
  })());
});
