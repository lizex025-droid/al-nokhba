'use client';

import { useEffect, useRef } from 'react';

const visionPanels = [
  {
    number: '01',
    eyebrow: 'من نحن؟',
    title: 'من نحن؟',
    text: 'النخبة فريق طلابي من كلية علوم التأهيل في الجامعة الأردنية، تأسس ليكون عونًا للطلبة في رحلتهم الأكاديمية. نعمل على توفير محتوى دراسي منظم، مراجعات، ملخصات، أدوات ذكية، وخدمات تساعد الطالب على الوصول إلى المعلومة بسهولة والاستعداد لمواده بثقة.',
    metric: 'من الطالب… وللطالب',
  },
  {
    number: '02',
    eyebrow: 'وجهتنا الأكاديمية',
    title: 'رؤيتنا',
    text: 'أن تكون النخبة المرجع الأكاديمي الطلابي الأول لطلبة كلية علوم التأهيل في الجامعة الأردنية، ومصدرًا موثوقًا يساعدهم على الدراسة بوضوح، والتفوق بثقة، وخدمة بعضهم بروح الفريق.',
    metric: 'وضوح وثقة',
  },
  {
    number: '03',
    eyebrow: 'دورنا تجاه الطالب',
    title: 'رسالتنا',
    text: 'تقديم دعم أكاديمي منظم وفعّال لطلبة كلية علوم التأهيل، من خلال توفير مواد دراسية، ملخصات، مراجعات، أدوات ذكية، وخدمات طلابية تساعد الطالب على فهم مواده والاستعداد لها بطريقة أفضل.',
    metric: 'دعم أكاديمي',
  },
  {
    number: '04',
    eyebrow: 'الأثر الذي نبنيه',
    title: 'أهداف النخبة',
    text: '',
    metric: 'أهداف واضحة',
    goals: ['تسهيل الوصول للمحتوى', 'تبسيط المواد الدراسية', 'تعزيز التعاون الطلابي'],
  },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export function VisionScrollytelling() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const chapters = Array.from(root.querySelectorAll<HTMLElement>('.vision-panel')).map(panel => ({
      panel,
      content: panel.querySelector<HTMLElement>('.vision-panel-inner'),
      heading: panel.querySelector<HTMLElement>('.vision-copy h3'),
      rail: panel.querySelector<HTMLElement>('.vision-progress'),
      items: Array.from(panel.querySelectorAll<HTMLElement>('[data-vision-reveal]')),
    }));
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const chapterColors = [
      [38, 215, 255],  // About — electric cyan
      [37, 215, 165],  // Vision — mint
      [185, 148, 247], // Mission — violet
      [234, 193, 109], // Goals — warm gold
    ];
    let frame = 0;

    const render = () => {
      frame = 0;
      const reducedMotion = motionPreference.matches;
      const compact = window.innerWidth <= 900;
      const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
      const staticLayout = reducedMotion || (compact && viewportHeight <= 580);
      const headerHeight = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 82;
      const stickyTop = compact ? 0 : headerHeight;
      root.style.setProperty('--vision-sticky-top', String(stickyTop) + 'px');

      const sectionBounds = root.getBoundingClientRect();
      document.body.classList.toggle(
        'vision-mobile-active',
        compact && sectionBounds.top <= 0 && sectionBounds.bottom > viewportHeight * .35
      );

      // Measure all geometry before updating inline styles to avoid repeated layouts.
      const bounds = chapters.map(({panel, heading, rail}) => ({
        panel: panel.getBoundingClientRect(),
        heading: heading?.getBoundingClientRect(),
        rail: rail?.getBoundingClientRect(),
      }));

      // One active chapter at a time. The active class fires a short, one-shot
      // neon pulse when the illuminated title becomes the focus of the story.
      let activeChapter =
        sectionBounds.top > viewportHeight * .85 || sectionBounds.bottom < viewportHeight * .15
          ? -1 : 0;
      if (activeChapter !== -1) {
        bounds.forEach(({ panel }, index) => {
          if (panel.top <= viewportHeight * .48) activeChapter = index;
        });
      }

      chapters.forEach(({panel, content, heading, items}, index) => {
        const current = bounds[index];
        const upcoming = bounds[index + 1]?.panel;

        // The arriving chapter softly fades over the previous sticky card.
        // Do not fade the background at all in reduced-motion or short layouts.
        const arrival = staticLayout || index === 0 ? 1 :
          ease((viewportHeight * .96 - current.panel.top) / (viewportHeight * .38));
        panel.style.opacity = String(arrival);

        // Reveal the gold headline first; introduce body/cue slightly later.
        const enter = staticLayout ? 1 :
          ease((viewportHeight * .94 - current.panel.top) / (viewportHeight * (compact ? .44 : .50)));

        // The outgoing text remains readable until the incoming chapter has
        // covered most of the old card, avoiding the empty-screen effect.
        const exit = staticLayout || !upcoming ? 0 :
          ease((stickyTop + viewportHeight * (compact ? .23 : .29) - upcoming.top) /
          (viewportHeight * (compact ? .26 : .30)));

        const nextApproach = !upcoming ? 1 :
          ease((viewportHeight * .91 - upcoming.top) / (viewportHeight * .83));
        panel.classList.toggle('vision-is-active', index === activeChapter && !staticLayout);
        const from = chapterColors[index];
        const to = chapterColors[Math.min(index + 1, chapterColors.length - 1)];
        const neon = from.map((channel, colorIndex) =>
          Math.round(channel + (to[colorIndex] - channel) * nextApproach)
        ).join(' ');

        panel.style.setProperty('--vision-neon-color', neon);
        panel.style.setProperty('--vision-rail-progress', staticLayout ? '1' : String(nextApproach));
        panel.style.setProperty('--vision-glow-opacity', staticLayout ? '.72' : String(.22 + .78 * enter));

        const headingRect = current.heading;
        const railRect = current.rail;
        if (headingRect && railRect) {
          const offset = clamp((headingRect.top + headingRect.height * .49 - railRect.top) / Math.max(1, railRect.height));
          const lampY = Math.max(18, Math.min(railRect.height - 18, offset * railRect.height));
          panel.style.setProperty('--vision-lamp-offset', String(lampY) + 'px');
        }

        if (content) {
          content.style.opacity = staticLayout ? '1' : String(1 - exit);
          content.style.transform = staticLayout ? 'none' :
            'translate3d(0,' + (-exit * (compact ? 10 : 16)) + 'px,0)';
        }

        items.forEach((item, itemIndex) => {
          // Stagger title > paragraph > goals > scroll cue. Headline reveals
          // upward from a clipped baseline, never character-by-character.
          const delay = index === 0 && itemIndex === 0 ? 0 : itemIndex * .11;
          const visible = staticLayout ? 1 : ease((enter - delay) / Math.max(.24, .78 - delay));
          item.style.opacity = String(visible);
          item.style.transform = staticLayout ? 'none' :
            'translate3d(0,' + ((1 - visible) * (compact ? 16 : 23)) + 'px,0)';
          if (item === heading) {
            item.style.clipPath = staticLayout ? 'none' :
              'inset(' + ((1 - visible) * 96) + '% 0 0 0)';
          }
        });
      });
    };

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    render();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
    motionPreference.addEventListener('change', requestRender);

    return () => {
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', requestRender);
      motionPreference.removeEventListener('change', requestRender);
      document.body.classList.remove('vision-mobile-active');
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section className="vision-scrolly" ref={rootRef} aria-label="من نحن ورؤية النخبة ورسالتها وأهدافها">
    <div className="vision-stack">
      {visionPanels.map((panel, index) => <article id={index === 0 ? "about" : undefined} className={`vision-panel vision-panel-${index + 1}`} key={panel.number} style={{ zIndex: index + 1 }}>
        <div className="vision-progress" aria-hidden="true"><span className="vision-progress-rail" /><span className="vision-progress-fill" /></div>
        <div className="container-wide vision-panel-inner">
          <div className="vision-copy">
            <h3 data-vision-reveal>{panel.title}</h3>
            {panel.text && <p data-vision-reveal>{panel.text}</p>}
            {panel.goals && <ul className="vision-goals" data-vision-reveal>{panel.goals.map(goal => <li key={goal}><span className="vision-goal-mark" aria-hidden="true" />{goal}</li>)}</ul>}
            {index < visionPanels.length - 1 && <div className="vision-next-cue" data-vision-reveal aria-hidden="true"><span>مرّر للمتابعة</span><span className="vision-next-cue-arrow">↓</span></div>}
          </div>
        </div>
      </article>)}
    </div>
  </section>;
}
