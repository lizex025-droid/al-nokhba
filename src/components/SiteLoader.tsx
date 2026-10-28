'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HeroArt } from './HeroArt';

/**
 * The orbital brand screen is visible immediately (including server HTML).
 * It remains until the new route's DOM, critical viewport imagery, logo and
 * fonts are ready. Lazy images below the fold never block navigation.
 *
 * Async page widgets can opt in by using data-page-loading="true" or
 * aria-busy="true" while their essential initial data is still loading.
 */
export function SiteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [delayed, setDelayed] = useState(false);
  const navigatingRef = useRef(false);
  const navTimeoutRef = useRef<number | null>(null);

  // Show the brand screen as soon as a user requests a different page,
  // rather than waiting for the destination component to mount.
  useEffect(() => {
    const startNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target && anchor.target !== '_self' ||
          anchor.hasAttribute('download')) return;

      let targetUrl: URL;
      try { targetUrl = new URL(anchor.href); }
      catch { return; }
      const here = new URL(window.location.href);
      if (targetUrl.origin !== here.origin ||
          (targetUrl.pathname === here.pathname && targetUrl.search === here.search)) return;

      navigatingRef.current = true;
      setDelayed(false);
      setVisible(true);
      if (navTimeoutRef.current !== null) window.clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = window.setTimeout(() => setDelayed(true), 14000);
    };

    const onHistoryNavigation = () => {
      navigatingRef.current = true;
      setVisible(true);
      setDelayed(false);
      if (navTimeoutRef.current !== null) window.clearTimeout(navTimeoutRef.current);
      navTimeoutRef.current = window.setTimeout(() => setDelayed(true), 14000);
    };

    document.addEventListener('click', startNavigation, true);
    window.addEventListener('popstate', onHistoryNavigation);
    return () => {
      document.removeEventListener('click', startNavigation, true);
      window.removeEventListener('popstate', onHistoryNavigation);
      if (navTimeoutRef.current !== null) window.clearTimeout(navTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    navigatingRef.current = false;
    if (navTimeoutRef.current !== null) window.clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = null;

    let alive = true;
    let scanFrame = 0;
    let nextFrame = 0;
    let minimumTimer: number | undefined;
    let warningTimer: number | undefined;
    let ready = false;
    const beganAt = performance.now();
    const MIN_DISPLAY_MS = 520;

    setVisible(true);
    setDelayed(false);

    // The central logo is a CSS background in HeroArt. Ensure it has loaded
    // (or failed definitively) before removing the overlay.
    const logo = new window.Image();
    logo.src = '/al-nokhba-logo.webp';

    const aboveFoldImagesReady = () => {
      const viewport = window.visualViewport?.height ?? window.innerHeight;
      const images = document.querySelectorAll<HTMLImageElement>('#main-content img, .site-header img');
      for (const img of images) {
        if (img.complete) continue; // Broken images cannot hold the site hostage.
        const rect = img.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (rect.top < viewport + 40 && rect.bottom > -40) return false;
      }
      return true;
    };

    const essentialDataPending = () =>
      document.querySelector(
        '#main-content [data-page-loading="true"], #main-content [aria-busy="true"]'
      ) !== null;

    const inspect = () => {
      scanFrame = 0;
      if (!alive || navigatingRef.current || ready) return;
      if (document.readyState !== 'complete' ||
          !document.getElementById('main-content') ||
          !logo.complete ||
          (document.fonts && document.fonts.status !== 'loaded') ||
          !aboveFoldImagesReady() ||
          essentialDataPending()) return;

      const elapsed = performance.now() - beganAt;
      if (elapsed < MIN_DISPLAY_MS) {
        minimumTimer = window.setTimeout(queueInspect, MIN_DISPLAY_MS - elapsed);
        return;
      }
      ready = true;
      setVisible(false);
      setDelayed(false);
    };

    const queueInspect = () => {
      if (!alive || scanFrame || ready) return;
      scanFrame = window.requestAnimationFrame(inspect);
    };
    const onResourceComplete = (event: Event) => {
      if (event.target instanceof HTMLImageElement) queueInspect();
    };
    const onReadyStateChange = () => queueInspect();

    // Inspect after two paints, so hydrated/streamed page content is present.
    scanFrame = window.requestAnimationFrame(() => {
      scanFrame = 0;
      nextFrame = window.requestAnimationFrame(queueInspect);
    });

    const main = document.getElementById('main-content');
    const observer = main && typeof MutationObserver !== 'undefined'
      ? new MutationObserver(queueInspect) : null;
    observer?.observe(main!, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'srcset', 'data-page-loading', 'aria-busy'],
    });

    logo.addEventListener('load', queueInspect);
    logo.addEventListener('error', queueInspect);
    document.addEventListener('load', onResourceComplete, true);
    document.addEventListener('error', onResourceComplete, true);
    document.addEventListener('readystatechange', onReadyStateChange);
    window.addEventListener('load', onReadyStateChange);
    document.fonts?.ready.then(queueInspect).catch(queueInspect);

    // No arbitrary dismissal timer: wait for readiness. After 14 seconds,
    // offer an explicit way out if a third-party resource never settles.
    warningTimer = window.setTimeout(() => {
      if (alive && !ready) setDelayed(true);
    }, 14000);

    return () => {
      alive = false;
      if (scanFrame) window.cancelAnimationFrame(scanFrame);
      if (nextFrame) window.cancelAnimationFrame(nextFrame);
      if (minimumTimer !== undefined) window.clearTimeout(minimumTimer);
      if (warningTimer !== undefined) window.clearTimeout(warningTimer);
      observer?.disconnect();
      logo.removeEventListener('load', queueInspect);
      logo.removeEventListener('error', queueInspect);
      document.removeEventListener('load', onResourceComplete, true);
      document.removeEventListener('error', onResourceComplete, true);
      document.removeEventListener('readystatechange', onReadyStateChange);
      window.removeEventListener('load', onReadyStateChange);
    };
  }, [pathname]);

  if (!visible) return null;

  return <div className="site-loader-screen" role="status" aria-live="polite" aria-label="جارٍ تجهيز صفحة النخبة">
    <div className="site-loader-art" aria-hidden="true"><HeroArt /></div>
    <span className="site-loader-status">جارٍ تجهيز الصفحة…</span>
    {delayed && <div className="site-loader-slow" role="alert">
      <p>بعض المحتوى يستغرق وقتًا أطول من المعتاد.</p>
      <button type="button" onClick={() => {
        navigatingRef.current = false;
        if (navTimeoutRef.current !== null) window.clearTimeout(navTimeoutRef.current);
        navTimeoutRef.current = null;
        setVisible(false);
        setDelayed(false);
      }}>عرض الصفحة الآن</button>
    </div>}
  </div>;
}
