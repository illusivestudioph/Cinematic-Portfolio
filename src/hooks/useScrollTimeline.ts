import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolio } from '../context/PortfolioContext';

gsap.registerPlugin(ScrollTrigger);

export function useScrollTimeline(containerRef: React.RefObject<HTMLDivElement | null>) {
  const { setProgress, scrollPaused } = usePortfolio();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prevSecondRef = { current: 0 };
    const TOTAL_DURATION_SEC = 26.0; // Mad Dogs sequence duration standard

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.8,
      infinite: false,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Create ScrollTrigger on the master container
    const container = containerRef.current;
    let trigger: ScrollTrigger | null = null;

    if (container) {
      trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.2,
        onUpdate: (self) => {
          const scrollProgress = self.progress;
          const sequenceProgress = Math.max(0, Math.min(1, scrollProgress));
          const prevSecond = prevSecondRef.current;
          const nextSecond = sequenceProgress * TOTAL_DURATION_SEC;
          prevSecondRef.current = nextSecond;

          // Mad Dogs exact scroll telemetry
          console.log(
            `📊 SCROLL_UPDATE: scrollProgress=${scrollProgress.toFixed(4)} → sequenceProgress=${sequenceProgress.toFixed(4)} → nextSecond=${nextSecond.toFixed(3)} (prev=${prevSecond.toFixed(3)})`
          );

          setProgress(scrollProgress);
        },
      });
    }

    return () => {
      if (trigger) trigger.kill();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, [containerRef, setProgress]);

  // Handle scroll pause/resume
  useEffect(() => {
    if (lenisRef.current) {
      if (scrollPaused) {
        lenisRef.current.stop();
      } else {
        lenisRef.current.start();
      }
    }
  }, [scrollPaused]);

  return {
    lenis: lenisRef.current,
  };
}
