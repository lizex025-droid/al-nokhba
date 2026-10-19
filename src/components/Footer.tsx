import Link from 'next/link';
import { nav } from '@/lib/content';
import { ArrowIcon } from './Icons';

export function Footer() { return <footer className="footer">
  <div className="container-wide footer-top">
    <div className="footer-intro">
      <Link href="/" className="brand brand-light"><span className="brand-mark" aria-hidden="true"><span>ن</span></span><span className="brand-text"><strong>النخبة</strong><small>علوم التأهيل</small></span></Link>
      <p>موقع أكاديمي طلابي يخدم طلبة كلية علوم التأهيل في الجامعة الأردنية من خلال مركز مواد، ملخصات، مراجعات، اختبارات محوسبة، إيميلات الدكاترة، وخدمات دراسية تساعد الطالب على الدراسة بوضوح.</p>
      <strong className="footer-motto">من الطالب… وللطالب.</strong>
    </div>
    <div className="footer-links"><span className="footer-label">استكشف</span>{nav.slice(0, 6).map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
    <div className="footer-links"><span className="footer-label">النخبة</span><Link href="/about">من نحن</Link><Link href="/request-help">اطلب مساعدة</Link><Link href="/join-us">انضم إلى الفريق</Link><Link href="/contact">تواصل معنا</Link><Link className="footer-cta-link" href="/materials">ابدأ الدراسة <ArrowIcon className="arrow-icon" /></Link></div>
  </div>
  <div className="container-wide footer-bottom"><p>النخبة مبادرة طلابية أكاديمية وليست بديلًا عن المصادر الرسمية للجامعة الأردنية.</p><span>جميع الحقوق محفوظة © النخبة — علوم التأهيل 2026</span></div>
</footer>; }
