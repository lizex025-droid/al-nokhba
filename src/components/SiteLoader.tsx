'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { HeroArt } from './HeroArt';

/**
 * Image-aware loading overlay.
 *
 * Never show a loader merely because someone entered the site or clicked a
 * route. Only show the original homepage illustration when a visible,
 * above-the-fold image is still downloading beyond a short threshold.
 * Below-the-fold images stay lazy and do not hold up page interaction.
 */
export function SiteLoader() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    let active = true;
    let pendingShow: number | undefined;
    let maxWait: number | undefined;
    let firstFrame = 0;
    let secondFrame = 0;
    let scanFrame = 0;
    let observerCutoff: number | undefined;
    let enteringPage = true;

    // The header and the original hero illustration use a CSS background image.
    // Checking its preload handles that visible image as well as <img> elements.
    const logo = new window.Image();
    logo.src = '/al-nokhba-logo.png?v=20261019';

    // A slow image must not trap a visitor on the loader indefinitely.
    const finish = () => {
      if (pendingShow !== undefined) window.clearTimeout(pendingShow);
      pendingShow = undefined;
      if (maxWait !== undefined) window.clearTimeout(maxWait);
      maxWait = undefined;
      if (active) setShow(false);
    };

    const imagesStillLoading = () => {
      if (!logo.complete) return true;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const images = document.querySelectorAll<HTMLImageElement>('#main-content img, .site-header img');
      for (const img of images) {
        if (img.complete) continue;
        const rect = img.getBoundingClientRect();
        // Images outside the viewport must remain lazy and never block the page.
        if (rect.width < 1 || rect.height < 1) continue;
        if (rect.bottom > 0 && rect.top < viewportHeight + 30) return true;
      }
      return false;
    };

    const inspect = () => {
      if (!active) return;
      if (!imagesStillLoading()) {
        finish();
        return;
      }

      // Fast or cached images never cause the loading screen to flash.
      if (pendingShow === undefined && maxWait === undefined) {
        pendingShow = window.setTimeout(() => {
          pendingShow = undefined;
          if (!active || !imagesStillLoading()) return;
          setShow(true);
          maxWait = window.setTimeout(finish, 4500);
        }, 180);
      }
    };

    // Image 'load' and 'error' do not bubble, so listen during capture.
    const onImageFinish = (event: Event) => {
      if (!enteringPage && pendingShow === undefined && maxWait === undefined) return;
      if (event.target instanceof HTMLImageElement) inspect();
    };
    document.addEventListener('load', onImageFinish, true);
    document.addEventListener('error', onImageFinish, true);
    logo.addEventListener('load', inspect);
    logo.addEventListener('error', inspect);

    // Dynamically rendered images can appear after a Next.js route transition.
    // Observe only the page content, never the loader illustration itself.
    const main = document.getElementById('main-content');
    const scheduleInspect = () => {
      if (scanFrame) return;
      scanFrame = window.requestAnimationFrame(() => {
        scanFrame = 0;
        inspect();
      });
    };
    const observer = main && typeof MutationObserver !== 'undefined'
      ? new MutationObserver(scheduleInspect)
      : null;
    observer?.observe(main!, { subtree: true, childList: true, attributes: true, attributeFilter: ['src', 'srcset'] });
    // Only examine newly-mounted page images around initial navigation.
    // Do not keep observing the entire site throughout the user's session.
    observerCutoff = window.setTimeout(() => {
      enteringPage = false;
      observer?.disconnect();
    }, 1800);

    // Give the route a paint before measuring above-the-fold images.
    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(inspect);
    });

    return () => {
      active = false;
      if (pendingShow !== undefined) window.clearTimeout(pendingShow);
      if (maxWait !== undefined) window.clearTimeout(maxWait);
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.cancelAnimationFrame(scanFrame);
      if (observerCutoff !== undefined) window.clearTimeout(observerCutoff);
      logo.removeEventListener('load', inspect);
      logo.removeEventListener('error', inspect);
      document.removeEventListener('load', onImageFinish, true);
      document.removeEventListener('error', onImageFinish, true);
      observer?.disconnect();
    };
  }, [pathname]);

  // Render nothing on the server and on fast or image-free routes.
  if (!show) return null;

  return <div className="site-loader-screen" role="status" aria-live="polite" aria-label="جارٍ تحميل صور النخبة">
    <div className="site-loader-art" aria-hidden="true"><HeroArt /></div>
    <span className="sr-only">جارٍ تحميل صور الصفحة</span>
  </div>;
}
