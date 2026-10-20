import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StudyPlanYearPicker } from '@/components/StudyPlanYearPicker';

const specialties: Record<string,string> = {
  'physical-therapy': 'العلاج الطبيعي',
  'occupational-therapy': 'العلاج الوظيفي',
  'prosthetics-orthotics': 'الأطراف الاصطناعية والأجهزة المساعدة',
  'hearing-speech': 'السمع والنطق',
};

export function generateStaticParams() {
  return Object.keys(specialties).map(specialty => ({ specialty }));
}

export async function generateMetadata({ params }: { params: Promise<{specialty:string}> }): Promise<Metadata> {
  const { specialty } = await params;
  return { title: `الخطط الدراسية — ${specialties[specialty] || 'علوم التأهيل'} | النخبة` };
}

export default async function SpecialtyPlansPage({ params }: { params: Promise<{specialty:string}> }) {
  const { specialty } = await params;
  const title = specialties[specialty];
  if (!title) notFound();
  return <main className="plan-year-page">
    <div className="container-wide">
      <nav className="plan-year-breadcrumb" aria-label="مسار التصفح">
        <Link href="/study-plans">الخطط الدراسية</Link><span aria-hidden="true">/</span><span>{title}</span>
      </nav>
      <header className="plan-year-heading">
        <span className="eyebrow">كلية علوم التأهيل · الجامعة الأردنية</span>
        <h1>الخطط الدراسية — {title}</h1>
        <p>اختر سنة الخطة الدراسية للاطلاع على معلوماتها عند توفر الملفات المعتمدة.</p>
      </header>
      <StudyPlanYearPicker specialtyTitle={title} specialty={specialty} />
    </div>
  </main>;
}
