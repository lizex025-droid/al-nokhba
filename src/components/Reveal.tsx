'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * One IntersectionObserver for static and dynamically inserted reveal elements.
 * Stagger cards that enter the viewport together, rather than delaying every
 * item by its absolute position in a potentially very long list.
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

    const revealTogether = (elements: Element[]) => {
      const cardsByParent = new Map<Element, HTMLElement[]>();

      for (const element of elements) {
        if (!element.isConnected) continue;
        if (!(element instanceof HTMLElement) || !element.hasAttribute('data-card-reveal')) {
          reveal(element);
          continue;
        }

        const parent = element.parentElement ?? document.body;
        const cards = cardsByParent.get(parent) ?? [];
        cards.push(element);
        cardsByParent.set(parent, cards);
      }

      for (const cards of cardsByParent.values()) {
        // A short stagger per visible group, even far down a long list.
        cards.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
        cards.forEach((card, index) => {
          card.style.setProperty('--card-stagger-delay', `${Math.min(index, 7) * 80}ms`);
          reveal(card);
        });
      }
    };

    const observer: IntersectionObserver | null = running
      ? new IntersectionObserver(entries => {
          const entering = entries.filter(entry => entry.isIntersecting).map(entry => entry.target);
          revealTogether(entering);
        }, { threshold: 0.01, rootMargin: '0px 0px -8px 0px' })
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
