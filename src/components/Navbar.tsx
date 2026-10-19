'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav } from '@/lib/content';
import { ArrowIcon } from './Icons';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);
  useEffect(() => setOpen(false), [pathname]);
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
        <Link href="/materials" className="mobile-nav-cta" onClick={() => setOpen(false)}>ابدأ الدراسة <ArrowIcon className="arrow-icon" /></Link>
      </nav>
    </div>
  </header>;
}
