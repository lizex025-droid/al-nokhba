'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
    document.body.classList.add('motion-ready');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12, rootMargin: '0px 0px -30px 0px' });
    items.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
