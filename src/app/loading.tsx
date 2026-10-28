import { HeroArt } from '@/components/HeroArt';

/** Next.js App Router fallback during streamed route loading. */
export default function Loading() {
  return (
    <div className="site-loader-screen site-loader-fallback" role="status" aria-label="جارٍ تحميل موقع النخبة">
      <div className="site-loader-art" aria-hidden="true"><HeroArt /></div>
      <span className="sr-only">جارٍ تحميل موقع النخبة</span>
    </div>
  );
}
