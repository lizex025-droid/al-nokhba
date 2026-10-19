import type { Metadata } from 'next';
import Link from 'next/link';
import { categories } from '@/lib/content';
import { SectionHeader, MaterialCard } from '@/components/Blocks';
import { FAQAccordion } from '@/components/FAQAccordion';
import { ArrowIcon, BookIcon } from '@/components/Icons';
import { VisionScrollytelling } from '@/components/VisionScrollytelling';

export const metadata: Metadata = { title: { absolute: 'النخبة علوم التأهيل | مواد وملخصات كلية علوم التأهيل الجامعة الأردنية' }, description: 'موقع النخبة الأكاديمي لطلبة كلية علوم التأهيل في الجامعة الأردنية. تصفح المواد، الملخصات، المراجعات، أدوات الذكاء الاصطناعي، إيميلات الدكاترة، والخطط الدراسية بسهولة.' };

function HeroArt() { return <div className="hero-art orbital-scene" aria-label="لوحة النخبة التعليمية المدارية المتحركة مع كتاب أكاديمي وأيقونات تعليمية" role="img">
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

export default function HomePage() { return <>
  <section className="home-hero"><div className="container-wide hero-layout"><div className="hero-copy"><span className="eyebrow hero-eyebrow"><span className="eyebrow-line" />من الطالب… وللطالب</span><h1>النخبة — مركز مواد كلية علوم التأهيل في الجامعة الأردنية</h1><p className="hero-lead">ادرس موادك بوضوح… <em>وابدأ من المكان الصحيح.</em></p><p className="hero-body">النخبة موقع أكاديمي طلابي يخدم طلبة كلية علوم التأهيل في الجامعة الأردنية، من خلال توفير المواد الدراسية، الملخصات، المراجعات، أدوات الذكاء الاصطناعي، إيميلات الدكاترة، والخطط الدراسية في مكان واحد منظم وسهل الوصول.</p><div className="hero-buttons"><Link href="/materials" className="button button-gold">تصفح مركز المواد <ArrowIcon className="arrow-icon" /></Link><Link href="/request-help" className="button button-outline-light">اطلب مساعدة دراسية</Link></div><div className="hero-foot"><span className="hero-foot-line" /><span>ادرس بوضوح. راجع بثقة. اسأل بدون تردد.</span></div></div><HeroArt /></div><Link href="#materials" className="scroll-hint" aria-label="انتقل إلى أقسام المواد"><span>اكتشف أكثر</span><span className="scroll-track"><span /></span></Link></section>

  <section id="materials" className="materials-section content-section"><div className="container-wide"><div className="section-topline"><SectionHeader title="ماذا ستجد هنا؟" /><Link href="/materials" className="text-link">كل التخصصات <ArrowIcon className="arrow-icon" /></Link></div><div className="material-grid">{categories.map((card, i) => <MaterialCard key={card.title} card={card} index={i} />)}</div></div></section>

  <VisionScrollytelling />

  <section className="help-section content-section"><div className="container-wide help-layout"><div className="help-copy" data-reveal><SectionHeader kicker="نحن هنا" title="محتاج مساعدة في مادة؟" text="إذا كنت لا تعرف من أين تبدأ، أو تواجه صعوبة في مادة معينة، أرسل لنا طلبك وسنحاول مساعدتك بأقرب طريقة ممكنة." /><p>اكتب اسم المادة، الجزء الصعب عليك، وموعد الامتحان أو الكويز. حتى لو لم تكن تعرف ما تحتاجه بالضبط، اختر: <strong>لا أعرف، أحتاج توجيه.</strong></p><Link href="/request-help" className="button button-navy">إرسال طلب المساعدة <ArrowIcon className="arrow-icon" /></Link></div></div></section>

  <section className="faq-section content-section section-tint"><div className="container-wide faq-layout"><SectionHeader kicker="أسئلة شائعة" title="إجابات تساعدك على البدء" text="كل ما تحتاج معرفته قبل أن تبدأ رحلتك مع النخبة." /><FAQAccordion /></div></section>
</>; }
