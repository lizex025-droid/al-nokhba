'use client';

import { useEffect, useState } from 'react';
import { HeroArt } from '@/components/HeroArt';

/** Show a fallback only if a route has been waiting for several seconds. */
export default function Loading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="site-loader-screen site-loader-fallback" role="status" aria-label="جارٍ تحميل موقع النخبة">
      <div className="site-loader-art" aria-hidden="true"><HeroArt /></div>
      <span className="site-loader-status">جارٍ تحميل الصفحة…</span>
    </div>
  );
}
