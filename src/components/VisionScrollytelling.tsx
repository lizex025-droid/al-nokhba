'use client';

import { useEffect, useRef } from 'react';

const visionPanels = [
  {
    number: '01',
    eyebrow: 'من نحن؟',
    title: 'فريق طلابي،\nبرؤية أكاديمية واضحة.',
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

export function VisionScrollytelling() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panels = Array.from(root.querySelectorAll<HTMLElement>('.vision-panel'));
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileView = () => window.matchMedia('(max-width: 900px)').matches;
    const syncHeader = () => {
      const rect = root.getBoundingClientRect();
      document.body.classList.toggle('vision-mobile-active', mobileView() && rect.top <= 0 && rect.bottom > window.innerHeight * .35);
    };
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
    window.addEventListener('resize', syncHeader);

    if (reducedMotion) {
      panels.forEach((panel) => panel.querySelectorAll<HTMLElement>('[data-vision-reveal]').forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'none';
      }));
      return () => {
        document.body.classList.remove('vision-mobile-active');
        window.removeEventListener('scroll', syncHeader);
        window.removeEventListener('resize', syncHeader);
      };
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const compactLayout = window.innerWidth <= 900;
      const headerHeight = document.querySelector<HTMLElement>('.site-header')?.getBoundingClientRect().height;
      const stickyTop = compactLayout ? 0 : (headerHeight ?? (viewportHeight < 700 ? 72 : 82));
      root.style.setProperty('--vision-sticky-top', `${stickyTop}px`);

      panels.forEach((panel, panelIndex) => {
        const rect = panel.getBoundingClientRect();
        const nextRect = panels[panelIndex + 1]?.getBoundingClientRect();
        const enterProgress = clamp((viewportHeight * .94 - rect.top) / (viewportHeight * .48));
        // On phones keep the current panel fully readable until the next panel
        // has visibly entered and begun covering it; only then fade/blur.
        const exitStart = compactLayout ? .40 : .58;
        const exitDistance = compactLayout ? .25 : .58;
        const exitProgress = nextRect ? clamp((stickyTop + viewportHeight * exitStart - nextRect.top) / (viewportHeight * exitDistance)) : 0;
        const content = panel.querySelector<HTMLElement>('.vision-panel-inner');
        // Advance the connected neon rail toward the next chapter as it approaches.
        const railProgress = nextRect
          ? clamp((viewportHeight * .95 - nextRect.top) / (viewportHeight * .85))
          : 0;
        panel.style.setProperty('--vision-rail-progress', String((panelIndex + railProgress) / (panels.length - 1)));

        if (content) {
          content.style.opacity = String(1 - exitProgress);
          content.style.transform = `translate3d(${(panelIndex % 2 === 0 ? -1 : 1) * exitProgress * (compactLayout ? 14 : 36)}px, ${-exitProgress * (compactLayout ? 24 : 30)}px, 0) scale(${1 - exitProgress * .025})`;
          content.style.filter = `blur(${exitProgress * 2}px)`;
        }

        panel.querySelectorAll<HTMLElement>('[data-vision-reveal]').forEach((item, itemIndex) => {
          const delay = itemIndex * .1;
          const reveal = clamp((enterProgress - delay) / Math.max(.01, 1 - delay));
          item.style.opacity = String(reveal);
          item.style.transform = `translate3d(${(panelIndex % 2 === 0 ? 1 : -1) * (1 - reveal) * (compactLayout ? 14 : 30)}px, ${(1 - reveal) * (compactLayout ? 25 : 40)}px, 0)`;
        });
      });
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      window.removeEventListener('scroll', syncHeader);
      window.removeEventListener('resize', syncHeader);
      document.body.classList.remove('vision-mobile-active');
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section className="vision-scrolly" ref={rootRef} aria-label="من نحن ورؤية النخبة ورسالتها وأهدافها">
    <div className="vision-stack">
      {visionPanels.map((panel, index) => <article id={index === 0 ? "about" : undefined} className={`vision-panel vision-panel-${index + 1}`} key={panel.number} style={{ zIndex: index + 1 }}>
        <div className="vision-progress" aria-hidden="true"><span className="vision-progress-rail" /><span className="vision-progress-fill" />{visionPanels.map((_, progressIndex) => <span className={progressIndex === index ? 'active' : ''} key={progressIndex}>0{progressIndex + 1}</span>)}</div>
        <div className="container-wide vision-panel-inner">
          <div className="vision-copy">
            <div className="vision-panel-top" data-vision-reveal><span>{panel.eyebrow}</span></div>
            <h3 data-vision-reveal>{panel.title}</h3>
            {panel.text && <p data-vision-reveal>{panel.text}</p>}
            {panel.goals && <ul className="vision-goals" data-vision-reveal>{panel.goals.map((goal, goalIndex) => <li key={goal}><span>0{goalIndex + 1}</span>{goal}</li>)}</ul>}
          </div>
          <div className="vision-visual" aria-hidden="true" data-vision-reveal>
            <span className="vision-number-ring"><span className="vision-big-number">{index + 1}</span><i /></span>
            <span className="vision-metric">{panel.metric}</span>
          </div>
        </div>
      </article>)}
    </div>
  </section>;
}
