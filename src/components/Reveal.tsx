'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One IntersectionObserver for static and dynamically inserted reveal elements.
 * The first eight cards in each grid stagger via CSS (80ms steps). Cards beyond
 * the first eight have no artificial delay, avoiding long-list animation queues.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const selector = '[data-reveal], [data-card-reveal]';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const observed = new WeakSet<Element>();
    const running = !reducedMotion.matches && 'IntersectionObserver' in window;

    document.body.classList.add('motion-ready');

    const reveal = (element: Element) => {
      element.classList.add('is-visible');
      observer?.unobserve(element);
    };

    const observer: IntersectionObserver | null = running
      ? new IntersectionObserver(entries => {
          for (const entry of entries) {
            if (entry.isIntersecting) reveal(entry.target);
          }
        }, { threshold: 0.04, rootMargin: '0px 0px -18px 0px' })
      : null;

    const observe = (element: Element) => {
      if (observed.has(element)) return;
      observed.add(element);
      if (!observer) {
        reveal(element);
      } else if (!element.classList.contains('is-visible')) {
        observer.observe(element);
      }
    };

    const addFrom = (element: Element) => {
      if (element.matches(selector)) observe(element);
      element.querySelectorAll(selector).forEach(observe);
    };

    addFrom(document.body);

    // Search/filter cards and help-form choice cards can mount after the initial
    // page load. Watch only added nodes, never attributes, to avoid busy loops.
    const mutationObserver = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === 1) addFrom(node as Element);
        }
      }
    });
    mutationObserver.observe(document.body, { subtree: true, childList: true });

    return () => {
      mutationObserver.disconnect();
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
