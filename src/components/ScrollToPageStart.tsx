'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Start each route at its top while respecting deliberate #section navigation. */
export function ScrollToPageStart() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Let Next finish rendering before scrolling to a requested section.
      const frame = window.requestAnimationFrame(() => {
        const id = decodeURIComponent(hash.slice(1));
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'instant', block: 'start' });
      });
      return () => window.cancelAnimationFrame(frame);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
