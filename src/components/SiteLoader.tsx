'use client';

import { useEffect, useState } from 'react';
import { HeroArt } from './HeroArt';

/**
 * The brand screen is part of the initial HTML, but only for a full page load.
 * Once the first page's fonts and visible images are ready, it disappears for
 * the rest of this client-side session (including all route transitions).
 */
export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    if (!visible) return;
    let active = true;
    let frame = 0;

    const logo = new window.Image();
    logo.src = '/al-nokhba-logo.png?v=20261019';

    const visibleImagesReady = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const images = document.querySelectorAll<HTMLImageElement>('#main-content img, .site-header img');
      for (const image of images) {
        if (image.complete) continue; // A failed image must not block the site.
        const rect = image.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0 &&
            rect.top < viewportHeight + 40 && rect.bottom > -40) return false;
      }
      return true;
    };

    const inspect = () => {
      frame = 0;
      if (!active || document.readyState !== 'complete' ||
          !document.getElementById('main-content') || !logo.complete ||
          (document.fonts && document.fonts.status !== 'loaded') ||
          !visibleImagesReady()) return;

      cleanup();
      setVisible(false);
      setDelayed(false);
    };

    const queueInspect = () => {
      if (active && frame === 0) frame = window.requestAnimationFrame(inspect);
    };

    const onImageEvent = (event: Event) => {
      if (event.target instanceof HTMLImageElement) queueInspect();
    };

    const observer = new MutationObserver(queueInspect);
    observer.observe(document.getElementById('main-content') ?? document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset'],
    });

    logo.addEventListener('load', queueInspect);
    logo.addEventListener('error', queueInspect);
    document.addEventListener('load', onImageEvent, true);
    document.addEventListener('error', onImageEvent, true);
    document.addEventListener('readystatechange', queueInspect);
    window.addEventListener('load', queueInspect);
    document.fonts?.ready.then(queueInspect).catch(queueInspect);

    const warningTimer = window.setTimeout(() => {
      if (active) setDelayed(true);
    }, 12000);

    function cleanup() {
      active = false;
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(warningTimer);
      observer.disconnect();
      logo.removeEventListener('load', queueInspect);
      logo.removeEventListener('error', queueInspect);
      document.removeEventListener('load', onImageEvent, true);
      document.removeEventListener('error', onImageEvent, true);
      document.removeEventListener('readystatechange', queueInspect);
      window.removeEventListener('load', queueInspect);
    }

    // Give the initial page one paint so its visible images can be discovered.
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      queueInspect();
    });
    return cleanup;
  }, [visible]);

  if (!visible) return null;

  return <div className="site-loader-screen" role="status" aria-live="polite" aria-label="جارٍ تجهيز موقع النخبة">
    <div className="site-loader-art" aria-hidden="true"><HeroArt /></div>
    <span className="site-loader-status">جارٍ تجهيز الموقع…</span>
    {delayed && <div className="site-loader-slow" role="alert">
      <p>بعض الصور أو الخطوط تستغرق وقتًا أطول من المعتاد.</p>
      <button type="button" onClick={() => {
        setVisible(false);
        setDelayed(false);
      }}>عرض الصفحة الآن</button>
    </div>}
  </div>;
}
