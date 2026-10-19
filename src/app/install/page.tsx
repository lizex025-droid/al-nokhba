import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'تنزيل تطبيق rehab ju',
  description: 'دليل إضافة موقع rehab ju إلى الشاشة الرئيسية على جهاز الآيفون.',
};

const guideImage = "https://pub-7353766376b14b8fa88b7a2a55859c04.r2.dev/%D8%B7%D8%B1%D9%8A%D9%82%D8%A9%20%D8%A5%D8%B6%D8%A7%D9%81%D8%A9%20%D9%85%D9%88%D9%82%D8%B9%20rehab%20ju%20%D8%A5%D9%84%D9%89%20%D8%B4%D8%A7%D8%B4%D8%A9%20%D8%A7%D9%84%D8%A2%D9%8A%D9%81%D9%88%D9%86.png";

export default function InstallPage() {
  return (
    <section className="install-page">
      <div className="container-wide install-page-inner">
        <div className="install-page-heading">
          <span className="eyebrow">دليل التثبيت</span>
          <h1>تنزيل تطبيق <span dir="ltr">rehab ju</span></h1>
          <p>أضف موقع النخبة إلى الشاشة الرئيسية على الآيفون للوصول إليه بسهولة. اتبع الخطوات المصوّرة بالأسفل.</p>
        </div>
        <figure className="install-page-guide">
          <a href={guideImage} target="_blank" rel="noopener noreferrer" aria-label="فتح صورة تعليمات التنزيل بالحجم الكامل"><img
            src={guideImage}
            alt="طريقة إضافة موقع rehab ju إلى شاشة الآيفون الرئيسية خطوة بخطوة"
            loading="eager"
            decoding="async"
          /></a>
          <figcaption>اضغط على الصورة لعرضها بحجمها الكامل، أو مرّر للأسفل لمتابعة جميع الخطوات.</figcaption>
        </figure>
        <div className="install-page-actions">
          <a href={guideImage} target="_blank" rel="noopener noreferrer" className="button button-navy">عرض الصورة بالحجم الكامل ↗</a>
          <Link href="/" className="install-page-return">العودة للصفحة الرئيسية ←</Link>
        </div>
      </div>
    </section>
  );
}
