'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HeroArt } from './HeroArt';

/**
 * Full-screen site loader using the original homepage illustration.
 * It appears briefly while the initial page hydrates, and during internal
 * page navigation. Never delays real navigation or external destinations.
 */
export function SiteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const initialRoute = useRef(true);
  const fallbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // The initial loader is rendered with the HTML so it covers slow hydration.
    // On a fast connection, let the original scene appear briefly.
    const initialTimer = window.setTimeout(() => setVisible(false), 320);
    return () => window.clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (initialRoute.current) {
      initialRoute.current = false;
      return;
    }
    if (fallbackTimer.current !== null) {
      window.clearTimeout(fallbackTimer.current);
      fallbackTimer.current = null;
    }
    const frame = window.requestAnimationFrame(() => setVisible(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const startLoading = () => {
      if (fallbackTimer.current !== null) window.clearTimeout(fallbackTimer.current);
      setVisible(true);
      // A failed navigation must never leave the site blocked by the loader.
      fallbackTimer.current = window.setTimeout(() => {
        fallbackTimer.current = null;
        setVisible(false);
      }, 4500);
    };

    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.defaultPrevented) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('javascript:')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      startLoading();
    };

    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      if (fallbackTimer.current !== null) window.clearTimeout(fallbackTimer.current);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="site-loader-screen" role="status" aria-live="polite" aria-label="جارٍ تحميل موقع النخبة">
      <div className="site-loader-art" aria-hidden="true">
        <HeroArt />
      </div>
      <span className="sr-only">جارٍ تحميل موقع النخبة</span>
    </div>
  );
}
