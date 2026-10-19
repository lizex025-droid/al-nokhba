'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav } from '@/lib/content';
import { ArrowIcon } from './Icons';

const installGuideImage = 'https://pub-7353766376b14b8fa88b7a2a55859c04.r2.dev/%D8%B7%D8%B1%D9%8A%D9%82%D8%A9%20%D8%A5%D8%B6%D8%A7%D9%81%D8%A9%20%D9%85%D9%88%D9%82%D8%B9%20rehab%20ju%20%D8%A5%D9%84%D9%89%20%D8%B4%D8%A7%D8%B4%D8%A9%20%D8%A7%D9%84%D8%A2%D9%8A%D9%81%D9%88%D9%86.png';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!showInstallGuide) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setShowInstallGuide(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showInstallGuide]);
  return <header className="site-header">
    <div className="nav-wrap container-wide">
      <Link href="/" className="brand" aria-label="النخبة — الرئيسية" onClick={() => { setOpen(false); if (pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
        <span className="brand-mark" aria-hidden="true"><span>ن</span></span>
        <span className="brand-text"><strong>النخبة</strong><small>علوم التأهيل</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="التنقل الرئيسي">
        {nav.map(item => <Link key={item.href} href={item.href} className={pathname === item.href ? 'active' : ''}>{item.label}</Link>)}
      </nav>
      <Link className="nav-cta" href="/materials">ابدأ الدراسة <ArrowIcon className="arrow-icon" /></Link>
      <button className="menu-toggle" type="button" aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(v => !v)}><span /><span /><span /></button>
    </div>
    <div id="mobile-menu" className={`mobile-nav ${open ? 'open' : ''}`} aria-hidden={!open}>
      <button className="mobile-nav-close" type="button" aria-label="إغلاق القائمة" onClick={() => setOpen(false)}>×</button>
      <nav className="mobile-nav-content" aria-label="التنقل على الهاتف">
        {nav.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={pathname === item.href ? 'active' : ''}>{item.label}<ArrowIcon className="arrow-icon" /></Link>)}
        <Link href="/join-us" onClick={() => setOpen(false)}>انضم إلى النخبة <ArrowIcon className="arrow-icon" /></Link>
        <Link href="/contact" onClick={() => setOpen(false)}>تواصل معنا <ArrowIcon className="arrow-icon" /></Link>
        <button type="button" className="mobile-nav-cta" onClick={() => { setOpen(false); setShowInstallGuide(true); }}>تنزيل التطبيق <ArrowIcon className="arrow-icon" /></button>
      </nav>
    </div>
    {showInstallGuide && <div className="install-guide-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowInstallGuide(false); }}>
      <div className="install-guide-dialog" role="dialog" aria-modal="true" aria-label="طريقة تنزيل تطبيق rehab ju على الآيفون">
        <div className="install-guide-heading"><strong>تنزيل تطبيق rehab ju</strong><button type="button" autoFocus aria-label="إغلاق تعليمات التنزيل" onClick={() => setShowInstallGuide(false)}>×</button></div>
        <p>اتبع الخطوات في الصورة لإضافة الموقع إلى الشاشة الرئيسية على الآيفون.</p>
        <img src={installGuideImage} alt="شرح مصور لطريقة إضافة موقع rehab ju إلى شاشة الآيفون الرئيسية" loading="lazy" decoding="async" />
        <a href={installGuideImage} target="_blank" rel="noopener noreferrer">فتح الصورة بالحجم الكامل ↗</a>
      </div>
    </div>}
  </header>;
}
