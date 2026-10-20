import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'تنزيل تطبيق rehab ju',
  description: 'دليل إضافة موقع rehab ju إلى الشاشة الرئيسية على جهاز الآيفون.',
};

const guideImage = "https://pub-7353766376b14b8fa88b7a2a55859c04.r2.dev/%D8%B7%D8%B1%D9%8A%D9%82%D8%A9%20%D8%A5%D8%B6%D8%A7%D9%81%D8%A9%20%D9%85%D9%88%D9%82%D8%B9%20rehab%20ju%20%D8%A5%D9%84%D9%89%20%D8%B4%D8%A7%D8%B4%D8%A9%20%D8%A7%D9%84%D8%A2%D9%8A%D9%81%D9%88%D9%86.png";

export default function InstallPage() {
  return (
    <section className="install-page install-choice-page">
      <div className="container-wide install-page-inner">
        <div className="install-choice-intro">
          <span className="install-choice-kicker">rehab ju</span>
          <h1>اختر طريقة الوصول المناسبة لجهازك</h1>
          <p>الوصول إلى مواد النخبة بسهولة على الهاتف أو الكمبيوتر، مباشرةً من موقعنا.</p>
        </div>
        <div className="install-choice-grid">
          <article className="install-choice-card install-choice-ios">
            <div className="install-choice-icon"><img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/brands/apple.svg" width="44" height="44" alt="" loading="lazy" decoding="async" /></div>
            <span className="install-choice-platform" dir="ltr">iPhone · iOS</span>
            <h2>تنزيل للآيفون</h2>
            <p>أضف الموقع إلى الشاشة الرئيسية عبر Safari، ليظهر باسم rehab ju وبأيقونة التطبيق.</p>
            <a href="#iphone-guide" className="install-choice-action">عرض طريقة الإضافة <span aria-hidden="true">←</span></a>
          </article>
          <article className="install-choice-card install-choice-desktop">
            <div className="install-choice-icon"><img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/desktop.svg" width="44" height="44" alt="" loading="lazy" decoding="async" /></div>
            <span className="install-choice-platform" dir="ltr">Desktop · Web</span>
            <h2>استخدام على الديسكتوب</h2>
            <p>افتح النخبة من متصفح الكمبيوتر مباشرةً، ويمكنك تثبيت اختصار للموقع من خيارات المتصفح إن كانت مدعومة.</p>
            <Link href="/" className="install-choice-action">فتح في المتصفح <span aria-hidden="true">←</span></Link>
          </article>
          <article className="install-choice-card install-choice-android">
            <div className="install-choice-icon"><img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/brands/android.svg" width="44" height="44" alt="" loading="lazy" decoding="async" /></div>
            <span className="install-choice-platform" dir="ltr">Android</span>
            <h2>دعم الأندرويد</h2>
            <p>نعمل على توفير طريقة مخصصة وسهلة للإضافة على أجهزة الأندرويد.</p>
            <span className="install-choice-soon">قريبًا</span>
          </article>
        </div>
        <div id="iphone-guide" className="install-iphone-guide">
          <div className="install-guide-title">
            <span className="install-choice-kicker">خطوات الآيفون</span>
            <h2>طريقة إضافة rehab ju إلى الشاشة الرئيسية</h2>
          </div>
          <figure className="install-page-guide">
            <a href={guideImage} target="_blank" rel="noopener noreferrer" aria-label="فتح صورة تعليمات التنزيل بالحجم الكامل">
              <img src={guideImage} alt="طريقة إضافة موقع rehab ju إلى شاشة الآيفون الرئيسية خطوة بخطوة" loading="lazy" decoding="async" />
            </a>
            <figcaption>اضغط على الصورة لعرضها بالحجم الكامل.</figcaption>
          </figure>
        </div>
        <div className="install-page-actions">
          <Link href="/" className="install-page-return">العودة للصفحة الرئيسية ←</Link>
        </div>
      </div>
    </section>
  );
}
