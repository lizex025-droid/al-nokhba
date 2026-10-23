'use client';

import { useEffect, useRef } from 'react';

const chapters = [
  {
    title: 'من نحن؟',
    text: 'النخبة فريق طلابي من كلية علوم التأهيل في الجامعة الأردنية، تأسس ليكون عونًا للطلبة في رحلتهم الأكاديمية. نعمل على توفير محتوى دراسي منظم، مراجعات، ملخصات، أدوات ذكية، وخدمات تساعد الطالب على الوصول إلى المعلومة بسهولة والاستعداد لمواده بثقة.',
  },
  {
    title: 'رؤيتنا',
    text: 'أن تكون النخبة المرجع الأكاديمي الطلابي الأول لطلبة كلية علوم التأهيل في الجامعة الأردنية، ومصدرًا موثوقًا يساعدهم على الدراسة بوضوح، والتفوق بثقة، وخدمة بعضهم بروح الفريق.',
  },
  {
    title: 'رسالتنا',
    text: 'تقديم دعم أكاديمي منظم وفعّال لطلبة كلية علوم التأهيل، من خلال توفير مواد دراسية، ملخصات، مراجعات، أدوات ذكية، وخدمات طلابية تساعد الطالب على فهم مواده والاستعداد لها بطريقة أفضل.',
  },
  {
    title: 'أهداف النخبة',
    goals: ['تسهيل الوصول للمحتوى', 'تبسيط المواد الدراسية', 'تعزيز التعاون الطلابي'],
  },
] as const;

const neonColors = [
  [38, 215, 255],
  [37, 215, 165],
  [185, 148, 247],
  [234, 193, 109],
] as const;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smoothstep = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

// Crossfade occupies the last 35% of each chapter's scroll interval.
// Both the previous and next texts occupy the exact same coordinates.
const chapterOpacity = (index: number, position: number) => {
  const entering = index === 0 ? 1 : smoothstep((position - (index - 1 + .64)) / .36);
  const leaving = index === chapters.length - 1 ? 1 : 1 - smoothstep((position - (index + .64)) / .36);
  return entering * leaving;
};

export function VisionScrollytelling() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;

    const layers = Array.from(stage.querySelectorAll<HTMLElement>('.story-layer'));
    const heading = layers[0]?.querySelector<HTMLElement>('h3');
    const rail = stage.querySelector<HTMLElement>('.story-rail');
    const bulb = stage.querySelector<HTMLElement>('.story-rail-lamp');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortScreen = window.matchMedia('(max-width: 900px) and (max-height: 620px)');
    let frame = 0;
    let currentChapter = -1;

    const render = () => {
      frame = 0;
      const compact = window.innerWidth <= 900;
      const staticLayout = prefersReducedMotion.matches || shortScreen.matches;
      const viewportHeight = window.innerHeight;
      // Keep the fixed navigation above the story on every screen.
      // Subtract its real rendered height from the pinned canvas instead of
      // hiding the header while people read the About section.
      const header = document.querySelector<HTMLElement>('.site-header');
      const top = Math.ceil(header?.getBoundingClientRect().height ?? 78) + 8;
      root.style.setProperty('--story-sticky-top', top + 'px');

      const rect = root.getBoundingClientRect();
      const distance = Math.max(1, root.offsetHeight - stage.offsetHeight);
      const scrollProgress = clamp((top - rect.top) / distance);
      const position = scrollProgress * (chapters.length - 1);

      if (heading && rail && !staticLayout) {
        // Align the neon with the first heading, then let it travel downward
        // along the SAME stationary white rail as the four chapters swap.
        const titleRect = heading.getBoundingClientRect();
        const lineRect = rail.getBoundingClientRect();
        const aligned = titleRect.top + titleRect.height * .49 - lineRect.top;
        const startY = Math.max(34, Math.min(lineRect.height * .34, aligned));
        const travel = Math.min(lineRect.height * .43, 235);
        const y = Math.min(lineRect.height - 30, startY + scrollProgress * travel);
        stage.style.setProperty('--story-lamp-y', y.toFixed(1) + 'px');
      }

      layers.forEach((layer, index) => {
        const visible = staticLayout ? 1 : chapterOpacity(index, position);
        layer.style.opacity = String(visible);
        layer.style.visibility = staticLayout || visible > .005 ? 'visible' : 'hidden';
        layer.setAttribute('aria-hidden', String(!staticLayout && visible < .5));

        // Reveal the title's baseline slightly; text does not change position.
        const title = layer.querySelector<HTMLElement>('h3');
        if (title) title.style.clipPath = staticLayout ? 'none' :
          'inset(' + ((1 - smoothstep(visible * 2)) * 14) + '% 0 0 0)';
      });

      if (rail) {
        stage.style.setProperty('--story-progress', String(staticLayout ? 1 : scrollProgress));
        const base = Math.min(chapters.length - 2, Math.floor(position));
        const mix = smoothstep(position - base);
        const color = neonColors[base].map((channel, i) =>
          Math.round(channel + (neonColors[base + 1][i] - channel) * mix)
        );
        stage.style.setProperty('--story-neon-rgb', color.join(' '));
      }

      const active = staticLayout ? -1 : Math.min(chapters.length - 1, Math.round(position));
      const inViewport = rect.top < viewportHeight * .8 && rect.bottom > viewportHeight * .2;
      if (active !== currentChapter) {
        currentChapter = active;
        if (bulb && active >= 0 && inViewport && !prefersReducedMotion.matches) {
          bulb.animate(
            [
              { transform: 'translate(-50%, -50%) scale(1)', filter: 'brightness(1)' },
              { transform: 'translate(-50%, -50%) scale(1.22)', filter: 'brightness(1.25)', offset: .35 },
              { transform: 'translate(-50%, -50%) scale(1)', filter: 'brightness(1)' },
            ],
            { duration: 620, easing: 'ease-out' }
          );
        }
      }
    };

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestRender);
    prefersReducedMotion.addEventListener('change', requestRender);
    shortScreen.addEventListener('change', requestRender);

    return () => {
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', requestRender);
      prefersReducedMotion.removeEventListener('change', requestRender);
      shortScreen.removeEventListener('change', requestRender);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section id="about" className="story-track" ref={rootRef} aria-label="من نحن ورؤية النخبة ورسالتها وأهدافها">
    <div className="story-stage" ref={stageRef}>
      <div className="story-rail" aria-hidden="true">
        <span className="story-rail-white story-rail-white-top" />
        <span className="story-rail-white story-rail-white-bottom" />
        <span className="story-rail-lit" />
        <span className="story-rail-lamp" />
      </div>
      <div className="story-layers">
        {chapters.map((chapter, index) =>
          <article className="story-layer" key={chapter.title} aria-hidden={index !== 0}>
            <div className="story-layer-content">
              <h3>{chapter.title}</h3>
              {'text' in chapter && <p>{chapter.text}</p>}
              {'goals' in chapter && <ul className="story-goals">
                {chapter.goals.map(goal => <li key={goal}><span aria-hidden="true" />{goal}</li>)}
              </ul>}
              {index !== chapters.length - 1 &&
                <span className="story-scroll-cue" aria-hidden="true">مرّر للمتابعة <span>↓</span></span>}
            </div>
          </article>
        )}
      </div>
    </div>
  </section>;
}
