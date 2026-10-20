import Link from 'next/link';
import Image from 'next/image';
import { nav } from '@/lib/content';
import { ArrowIcon } from './Icons';

export function Footer() { return <footer className="footer">
  <div className="container-wide footer-top">
    <div className="footer-intro">
      <Link href="/" className="footer-brand" aria-label="النخبة — الصفحة الرئيسية"><span className="footer-brand-logo" aria-hidden="true"><Image src="/al-nokhba-logo.png" alt="" width={96} height={96} priority /></span><span className="footer-brand-text"><strong>النخبة</strong><small>علوم التأهيل</small></span></Link>
      <p>موقع أكاديمي طلابي يخدم طلبة كلية علوم التأهيل في الجامعة الأردنية من خلال مركز مواد، ملخصات، مراجعات، أدوات ذكاء اصطناعي، إيميلات الدكاترة، وخدمات دراسية تساعد الطالب على الدراسة بوضوح.</p>
      <strong className="footer-motto">من الطالب… وللطالب.</strong>
    </div>
    <div className="footer-links"><span className="footer-label">استكشف</span>{nav.slice(0, 6).map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</div>
    <div className="footer-links"><span className="footer-label">النخبة</span><Link href="/about">من نحن</Link><Link href="/request-help">اطلب مساعدة</Link><Link href="/join-us">انضم إلى الفريق</Link><Link href="/contact">تواصل معنا</Link><Link className="footer-cta-link" href="/materials">ابدأ الدراسة <ArrowIcon className="arrow-icon" /></Link></div>
  </div>
  <div className="container-wide footer-bottom"><p>النخبة مبادرة طلابية أكاديمية وليست بديلًا عن المصادر الرسمية للجامعة الأردنية.</p><span>جميع الحقوق محفوظة © النخبة — علوم التأهيل 2026</span><a className="footer-developer-credit" href="https://ahedbseiso.online/" target="_blank" rel="noopener noreferrer" dir="ltr">Made by AHED BSEISO — ©</a></div>
</footer>; }
