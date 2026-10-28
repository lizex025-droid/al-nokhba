import Link from 'next/link';
import type { LegalSection } from '@/lib/legalPolicies';
import { LEGAL_CONTACT_EMAIL, LEGAL_EFFECTIVE_DATE } from '@/lib/legalPolicies';

export function LegalPage({
  title,
  eyebrow,
  description,
  sections,
  alternate,
}: {
  title: string;
  eyebrow: string;
  description: string;
  sections: LegalSection[];
  alternate: { href: string; label: string };
}) {
  return <div className="legal-page">
    <header className="legal-hero">
      <div className="container-narrow">
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="legal-meta"><span>آخر تحديث: {LEGAL_EFFECTIVE_DATE}</span><span>النخبة — علوم التأهيل</span></div>
      </div>
    </header>
    <article className="legal-article container-narrow" aria-label={title}>
      <div className="legal-intro-notice">
        <strong>نحن مبادرة طلابية مستقلة.</strong> نستخدم البيانات لتقديم المساعدة وتنظيم المساهمات، ونحترم حقوق أصحاب المحتوى والمستخدمين.
      </div>
      {sections.map((section, index) => <section className="legal-section" key={section.title} id={`section-${index + 1}`}>
        <h2>{section.title}</h2>
        {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {section.bullets && <ul>{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}
      </section>)}
      <section className="legal-contact-box">
        <h2>تواصل معنا</h2>
        <p>للاستفسارات أو طلب تصحيح البيانات أو بلاغات حقوق المؤلف والمحتوى، يمكنك مراسلتنا مباشرة.</p>
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
      </section>
      <nav className="legal-end-links" aria-label="روابط السياسات">
        <Link href={alternate.href}>{alternate.label}</Link>
        <Link href="/">العودة إلى الرئيسية</Link>
      </nav>
    </article>
  </div>;
}
