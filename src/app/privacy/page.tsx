import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { privacySections } from '@/lib/legalPolicies';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية | النخبة',
  description: 'سياسة الخصوصية لمبادرة النخبة الطلابية لعلوم التأهيل، وبيان كيفية التعامل مع بيانات النماذج والمساهمات.',
};

export default function PrivacyPage() {
  return <LegalPage
    title="سياسة الخصوصية"
    eyebrow="الخصوصية والشفافية"
    description="كيف نتعامل مع المعلومات التي تقدّمها عند طلب المساعدة أو الانضمام إلى فريق النخبة."
    sections={privacySections}
    alternate={{ href: '/terms', label: 'قراءة شروط الاستخدام والمساهمة' }}
  />;
}
