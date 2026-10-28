import { BookIcon } from './Icons';

/** Shared original hero illustration; the loading screen reuses the exact same scene. */
export function HeroArt() { return <div className="hero-art orbital-scene" aria-label="لوحة النخبة التعليمية المدارية المتحركة مع كتاب أكاديمي وأيقونات تعليمية" role="img">
  <span className="orbital-grid" aria-hidden="true" />
  <span className="orbital-glow" aria-hidden="true" />
  <span className="orbital-ring orbital-ring-outer" aria-hidden="true"><i /></span>
  <span className="orbital-ring orbital-ring-middle" aria-hidden="true"><i /></span>
  <span className="orbital-ring orbital-ring-inner" aria-hidden="true" />
  <span className="academic-icon academic-icon-cap" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="m7 18 17-9 17 9-17 9L7 18Z"/><path d="M14 22v10c6 5 14 5 20 0V22M41 19v12"/></svg></span>
  <span className="academic-icon academic-icon-book" aria-hidden="true"><BookIcon /></span>
  <span className="academic-icon academic-icon-laptop" aria-hidden="true"><svg viewBox="0 0 48 48"><path d="M12 11h24v20H12zM7 36h34l-3 3H10l-3-3Z"/></svg></span>
  <span className="orbital-spark orbital-spark-a" aria-hidden="true" /><span className="orbital-spark orbital-spark-b" aria-hidden="true" /><span className="orbital-spark orbital-spark-c" aria-hidden="true" /><span className="orbital-spark orbital-spark-d" aria-hidden="true" />
  <div className="orbital-book" aria-hidden="true"><span className="orbital-book-title">AL NOKHBA</span><span className="orbital-book-logo" /></div>
</div>; }
