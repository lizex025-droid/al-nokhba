import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { pages, categories, seoTitles } from '@/lib/content';
import { SectionHeader, ServiceCard, CTASection } from '@/components/Blocks';
import { GpaCalculator } from '@/components/GpaCalculator';
import { HelpForm, JoinForm, ContactForm } from '@/components/Forms';
import { EmailDirectory } from '@/components/EmailDirectory';
import { ArrowIcon } from '@/components/Icons';

export function generateStaticParams() { return Object.keys(pages).map(slug => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const page = pages[slug]; return page ? { title: { absolute: seoTitles[slug] || page.title }, description: page.description } : {}; }
export default async function InnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const page = pages[slug]; if (!page) notFound();
  const isSpecialty = slug.endsWith('-materials') && slug !== 'materials';
  const isMaterials = slug === 'materials';
  return <>
    {page.sections?.map((section, i) => <section key={section.title} className={`content-section ${i % 2 ? 'section-tint' : ''} ${isMaterials ? 'materials-discovery-section' : ''}`}><div className="container-wide"><SectionHeader kicker={isMaterials ? undefined : page.eyebrow} title={isMaterials ? 'ماذا ستجد هنا؟' : section.title} />{section.text?.map(p => <p className="section-prose" key={p}>{p}</p>)}{section.cards && <div className={isMaterials ? 'service-grid inner-grid materials-discovery-grid' : 'service-grid inner-grid'}>{section.cards.map((card, n) => <ServiceCard key={card.title} card={card} index={n} showImage={isMaterials} />)}</div>}</div></section>)}
    {isSpecialty && <section className="content-section section-tint"><div className="container-wide"><SectionHeader kicker="مركز المواد" title="ابدأ من تخصصك" text="المحتوى قيد التجهيز. يمكنك تصفح أقسام التخصصات الأخرى أو طلب مساعدة في مادة محددة." /><div className="related-links">{categories.slice(0, 4).filter(c => c.href !== `/${slug}`).map(c => <Link href={c.href!} key={c.title}>{c.title}<ArrowIcon className="arrow-icon" /></Link>)}</div></div></section>}
    {slug === 'gpa-calculator' && <section className="content-section"><div className="container-narrow"><GpaCalculator /></div></section>}
    {slug === 'professors-emails' && <section className="content-section"><div className="container-wide"><EmailDirectory /><div className="email-template" data-reveal><span className="eyebrow">قالب جاهز</span><h2>كيف تكتب رسالة أكاديمية واضحة؟</h2><div className="template-copy"><p>الموضوع: استفسار بخصوص مادة [اسم المادة]</p><p>السلام عليكم دكتور/دكتورة [الاسم]،</p><p>أنا الطالب/ـة [اسمك] من شعبة [رقم الشعبة إن وجد] في مادة [اسم المادة].</p><p>أرغب بالاستفسار عن [اكتب سؤالك باختصار ووضوح].</p><p>شاكر/ـة وقتكم وتعاونكم.</p><p>مع الاحترام،<br />[اسمك]<br />[رقمك الجامعي]</p></div></div></div></section>}
    {slug === 'study-plans' && <section className="content-section section-tint"><div className="container-wide"><div className="notice-card"><strong>تنويه مهم</strong><p>الخطط التفصيلية لم تُضف بعد. راجع المصادر الرسمية للجامعة عند التسجيل أو اتخاذ أي قرار أكاديمي.</p></div></div></section>}
    {slug === 'ai' && <section className="content-section section-tint"><div className="container-wide"><div className="notice-card"><strong>المساعد الذكي قيد التطوير</strong><p>نعمل على تجهيز تجربة آمنة ومفيدة لطلبة علوم التأهيل. ستتمكن قريبًا من طلب شرح مبسّط، تنظيم خطة مراجعة، وتكوين أسئلة تدريبية.</p></div></div></section>}
    {slug === 'request-help' && <section className="content-section"><div className="container-narrow"><HelpForm /></div></section>}
    {slug === 'join-us' && <section className="content-section"><div className="container-narrow"><JoinForm /></div></section>}
    {slug === 'contact' && <section className="content-section"><div className="container-narrow"><ContactForm /></div></section>}
    {slug === 'about' && <div className="about-closing container-wide">النخبة ليست مجرد اسم. النخبة مسؤولية، عمل، وأثر نثبته معكم.</div>}
    <CTASection {...page.cta} />
  </>;
}
