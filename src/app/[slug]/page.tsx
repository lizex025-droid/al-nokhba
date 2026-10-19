import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { pages, seoTitles } from '@/lib/content';
import { SectionHeader, ServiceCard } from '@/components/Blocks';
import { GpaCalculator } from '@/components/GpaCalculator';
import { HelpForm, JoinForm, ContactForm } from '@/components/Forms';
import { EmailDirectory } from '@/components/EmailDirectory';
import { SpecialtyMaterialsDirectory } from '@/components/SpecialtyMaterialsDirectory';
import { AiAcademicGuide } from '@/components/AiAcademicGuide';

export function generateStaticParams() { return Object.keys(pages).map(slug => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const page = pages[slug]; return page ? { title: { absolute: seoTitles[slug] || page.title }, description: page.description } : {}; }
export default async function InnerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const page = pages[slug]; if (!page) notFound();
  const isSpecialty = slug.endsWith('-materials') && slug !== 'materials';
  const isMaterials = slug === 'materials';
  return <>
    {slug === 'ai' && <section className="ai-news-feature"><div className="container-wide"><figure className="ai-news-card">
      <header className="ai-news-card-header"><span className="eyebrow"><span className="eyebrow-line" />خبر الجامعة الأردنية</span><h1>تعليمات استخدام أدوات الذكاء الاصطناعي في الجامعة الأردنية</h1><p>اطّلع على الخبر والتفاصيل المنشورة في الموقع الرسمي للجامعة الأردنية.</p></header>
      <div className="ai-news-image"><Image src="/ai/ju-ai-news.png" alt="خبر الجامعة الأردنية حول تعليمات استخدام أدوات الذكاء الاصطناعي" width={1902} height={869} priority sizes="(max-width: 1400px) calc(100vw - 72px), 1330px" /></div>
      <figcaption><a className="button button-navy" href="https://news.ju.edu.jo/en/english/Lists/News/Disp_FormNews1.aspx?ID=706" target="_blank" rel="noreferrer">قراءة الخبر الرسمي</a></figcaption>
    </figure></div></section>}
    {!isSpecialty && slug !== 'ai' && page.sections?.map((section, i) => <section key={section.title} className={`content-section ${i % 2 ? 'section-tint' : ''} ${isMaterials ? 'materials-discovery-section' : ''}`}><div className="container-wide"><SectionHeader kicker={isMaterials ? undefined : page.eyebrow} title={isMaterials ? 'ماذا ستجد هنا؟' : section.title} />{section.text?.map(p => <p className="section-prose" key={p}>{p}</p>)}{section.cards && <div className={isMaterials ? 'service-grid inner-grid materials-discovery-grid' : 'service-grid inner-grid'}>{section.cards.map((card, n) => <ServiceCard key={card.title} card={card} index={n} showImage={isMaterials} />)}</div>}</div></section>)}
    {isSpecialty && <SpecialtyMaterialsDirectory specialty={slug} />}
    {slug === 'gpa-calculator' && <section className="content-section calculator-page-section"><div className="container-wide"><GpaCalculator /></div></section>}
    {slug === 'professors-emails' && <section className="content-section"><div className="container-wide"><EmailDirectory /><div className="email-template" data-reveal><span className="eyebrow">قالب جاهز</span><h2>كيف تكتب رسالة أكاديمية واضحة؟</h2><div className="template-copy"><p>الموضوع: استفسار بخصوص مادة [اسم المادة]</p><p>السلام عليكم دكتور/دكتورة [الاسم]،</p><p>أنا الطالب/ـة [اسمك] من شعبة [رقم الشعبة إن وجد] في مادة [اسم المادة].</p><p>أرغب بالاستفسار عن [اكتب سؤالك باختصار ووضوح].</p><p>شاكر/ـة وقتكم وتعاونكم.</p><p>مع الاحترام،<br />[اسمك]<br />[رقمك الجامعي]</p></div></div></div></section>}
    {slug === 'study-plans' && <section className="content-section section-tint"><div className="container-wide"><div className="notice-card"><strong>تنويه مهم</strong><p>الخطط التفصيلية لم تُضف بعد. راجع المصادر الرسمية للجامعة عند التسجيل أو اتخاذ أي قرار أكاديمي.</p></div></div></section>}
    {slug === 'ai' && <AiAcademicGuide />}
    {slug === 'request-help' && <section className="content-section"><div className="container-narrow"><HelpForm /></div></section>}
    {slug === 'join-us' && <section className="content-section"><div className="container-narrow"><JoinForm /></div></section>}
    {slug === 'contact' && <section className="content-section"><div className="container-narrow"><ContactForm /></div></section>}
    {slug === 'about' && <div className="about-closing container-wide">النخبة ليست مجرد اسم. النخبة مسؤولية، عمل، وأثر نثبته معكم.</div>}
  </>;
}
