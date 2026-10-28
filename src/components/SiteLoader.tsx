'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HeroArt } from './HeroArt';

// Static pages already render in the initial HTML. Only cover a navigation
// when fetching its route payload is unusually slow or appears stuck.
const SHOW_AFTER_MS = 4000;
const SLOW_NAVIGATION_MS = 14000;

export function SiteLoader() {
  const pathname = usePathname();
  const currentPathRef = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [delayed, setDelayed] = useState(false);
  const showTimerRef = useRef<number | null>(null);
  const slowTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (showTimerRef.current !== null) window.clearTimeout(showTimerRef.current);
    if (slowTimerRef.current !== null) window.clearTimeout(slowTimerRef.current);
    showTimerRef.current = null;
    slowTimerRef.current = null;
  };

  useEffect(() => {
    const startNavigation = () => {
      clearTimers();
      setVisible(false);
      setDelayed(false);
      showTimerRef.current = window.setTimeout(() => {
        showTimerRef.current = null;
        setVisible(true);
        slowTimerRef.current = window.setTimeout(() => setDelayed(true), SLOW_NAVIGATION_MS);
      }, SHOW_AFTER_MS);
    };

    const onLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) ||
          (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return;

      let destination: URL;
      try { destination = new URL(anchor.href); }
      catch { return; }
      const current = new URL(window.location.href);
      if (destination.origin !== current.origin || destination.pathname === current.pathname) return;

      startNavigation();
    };

    // Observe link clicks before Next.js handles them so we can detect slow
    // transitions even if the destination has not mounted yet.
    const onHistoryNavigation = () => {
      // Back/forward can move only between hash or query entries on one page.
      if (window.location.pathname !== currentPathRef.current) startNavigation();
    };

    document.addEventListener('click', onLinkClick, true);
    window.addEventListener('popstate', onHistoryNavigation);
    return () => {
      document.removeEventListener('click', onLinkClick, true);
      window.removeEventListener('popstate', onHistoryNavigation);
      clearTimers();
    };
  }, []);

  // As soon as the new route is available, cancel the pending indicator.
  // Do not wait for lazy images, external fonts, or window.load.
  useEffect(() => {
    currentPathRef.current = pathname;
    clearTimers();
    setVisible(false);
    setDelayed(false);
  }, [pathname]);

  if (!visible) return null;

  return <div className="site-loader-screen" role="status" aria-live="polite" aria-label="جارٍ تحميل صفحة النخبة">
    <div className="site-loader-art" aria-hidden="true"><HeroArt /></div>
    <span className="site-loader-status">جارٍ تحميل الصفحة…</span>
    {delayed && <div className="site-loader-slow" role="alert">
      <p>بعض المحتوى يستغرق وقتًا أطول من المعتاد.</p>
      <button type="button" onClick={() => {
        clearTimers();
        setVisible(false);
        setDelayed(false);
      }}>عرض الصفحة الآن</button>
    </div>}
  </div>;
}
