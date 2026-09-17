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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
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
        scrub: 0.5,
        onUpdate: (self) => {
          setProgress(self.progress);
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
