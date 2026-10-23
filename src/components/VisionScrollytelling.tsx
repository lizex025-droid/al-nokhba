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

// The lamp keeps the Goals chapter's warm gold throughout the story.
const GOLD_NEON_RGB = '234 193 109';

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
    const announcement = stage.querySelector<HTMLElement>('.story-announcement');
    const header = document.querySelector<HTMLElement>('.site-header');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shortScreen = window.matchMedia('(max-width: 900px) and (max-height: 620px)');

    let frame = 0;
    let measureNeeded = true;
    let activeChapter = -1;
    let accessibleChapter = -2;
    let previousStaticMode: boolean | null = null;
    let position = 0;
    let pulse: Animation | null = null;
    const dimensions = {
      stickyTop: 100,
      headerHeight: 88,
      distance: 1,
      viewportHeight: window.innerHeight,
      lampStart: 75,
      lampStep: 120,
    };

    // Geometry depends on the header, content size and viewport; only measure
    // when any of those change, not on every scroll event.
    const measure = () => {
      measureNeeded = false;
      dimensions.viewportHeight = window.innerHeight;
      dimensions.headerHeight = Math.ceil(header?.getBoundingClientRect().height ?? 88);
      dimensions.stickyTop = dimensions.headerHeight + 12;
      root.style.setProperty('--story-sticky-top', dimensions.stickyTop + 'px');
      dimensions.distance = Math.max(1, root.offsetHeight - stage.offsetHeight);

      if (heading && rail) {
        const titleRect = heading.getBoundingClientRect();
        const lineRect = rail.getBoundingClientRect();
        const relativeTitle = titleRect.top + titleRect.height * .49 - lineRect.top;
        const start = Math.max(28, Math.min(lineRect.height * .31, relativeTitle));
        const end = Math.max(start, lineRect.height - 37);
        dimensions.lampStart = start;
        // Four evenly spaced stops: About, Vision, Mission and Goals.
        dimensions.lampStep = (end - start) / (chapters.length - 1);
      }
    };

    const render = () => {
      frame = 0;
      if (measureNeeded) measure();

      const staticLayout = reducedMotion.matches || shortScreen.matches;
      const rect = root.getBoundingClientRect();
      const isInView = rect.top < dimensions.viewportHeight * .88 &&
        rect.bottom > dimensions.stickyTop;
      document.body.classList.toggle(
        'about-story-active',
        rect.top <= dimensions.headerHeight + 10 &&
        rect.bottom > dimensions.headerHeight + 80
      );

      if (!isInView && !staticLayout) return;

      const progress = clamp((dimensions.stickyTop - rect.top) / dimensions.distance);
      position = progress * (chapters.length - 1);

      // Content is always in place. Complementary opacities ensure that
      // one chapter fades out exactly as the next fades in.
      layers.forEach((layer, index) => {
        const opacity = staticLayout ? 1 : chapterOpacity(index, position);
        layer.style.opacity = opacity.toFixed(4);
        layer.style.visibility = staticLayout || opacity > .001 ? 'visible' : 'hidden';
      });

      if (!staticLayout && rail) {
        const fromStop = Math.min(chapters.length - 2, Math.floor(position));
        const betweenStops = smoothstep(position - fromStop);
        const y = dimensions.lampStart + dimensions.lampStep * (fromStop + betweenStops);
        stage.style.setProperty('--story-lamp-y', y.toFixed(2) + 'px');
      }

      // The accessible chapter switches at the halfway point of the crossfade
      // (about .82 through an interval), not before the new text appears.
      const nextAccessible = staticLayout
        ? -1 : Math.min(chapters.length - 1, Math.floor(position + .18));

      if (accessibleChapter !== nextAccessible || previousStaticMode !== staticLayout) {
        accessibleChapter = nextAccessible;
        previousStaticMode = staticLayout;
        layers.forEach((layer, index) => {
          const hidden = !staticLayout && index !== nextAccessible;
          layer.setAttribute('aria-hidden', String(hidden));
          layer.inert = hidden;
        });
        if (announcement) {
          announcement.textContent = staticLayout ? '' : 'القسم الحالي: ' + chapters[nextAccessible].title;
        }
      }

      if (nextAccessible !== activeChapter) {
        activeChapter = nextAccessible;
        if (!staticLayout && isInView && bulb && typeof bulb.animate === 'function') {
          pulse?.cancel();
          pulse = bulb.animate([
            { transform: 'translate(-50%, -50%) scale(1)', filter: 'brightness(1)' },
            { transform: 'translate(-50%, -50%) scale(1.11)', filter: 'brightness(1.12)', offset: .42 },
            { transform: 'translate(-50%, -50%) scale(1)', filter: 'brightness(1)' },
          ], { duration: 460, easing: 'ease-out' });
        }
      }
    };

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const requestMeasure = () => {
      measureNeeded = true;
      requestRender();
    };

    // Keyboard interaction applies only while the section itself has focus.
    // At the first/last chapter, leave arrows to scroll away normally.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target !== root || event.altKey || event.ctrlKey || event.metaKey ||
          reducedMotion.matches || shortScreen.matches) return;
      const forward = event.key === 'ArrowDown' || event.key === 'PageDown';
      const backward = event.key === 'ArrowUp' || event.key === 'PageUp';
      if (!forward && !backward) return;
      const current = forward
        ? Math.floor(position + .12) : Math.ceil(position - .12);
      const target = forward ? Math.min(chapters.length - 1, current + 1)
        : Math.max(0, current - 1);
      if ((forward && position >= chapters.length - 1) || (backward && position <= 0)) return;
      event.preventDefault();
      const sectionTop = window.scrollY + root.getBoundingClientRect().top;
      const targetY = sectionTop - dimensions.stickyTop +
        (target / (chapters.length - 1)) * dimensions.distance;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    };

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(requestMeasure) : null;
    if (observer) {
      observer.observe(stage);
      if (header) observer.observe(header);
      if (heading) observer.observe(heading);
      if (rail) observer.observe(rail);
    }

    render();
    root.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', requestRender, { passive: true });
    window.addEventListener('resize', requestMeasure);
    window.visualViewport?.addEventListener('resize', requestMeasure);
    reducedMotion.addEventListener('change', requestMeasure);
    shortScreen.addEventListener('change', requestMeasure);

    return () => {
      root.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', requestRender);
      window.removeEventListener('resize', requestMeasure);
      window.visualViewport?.removeEventListener('resize', requestMeasure);
      reducedMotion.removeEventListener('change', requestMeasure);
      shortScreen.removeEventListener('change', requestMeasure);
      observer?.disconnect();
      pulse?.cancel();
      document.body.classList.remove('about-story-active');
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <section id="about" className="story-track" ref={rootRef} role="region" tabIndex={0} aria-label="من نحن ورؤية النخبة ورسالتها وأهدافها" aria-describedby="story-keyboard-hint">
    <div className="story-stage" ref={stageRef}>
      <p id="story-keyboard-hint" className="story-assistive-note">يمكنك استخدام السهمين للأعلى والأسفل للتنقل بين أقسام من نحن عند التركيز على هذا القسم.</p>
      <p className="story-announcement story-assistive-note" aria-live="polite" aria-atomic="true" />
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
