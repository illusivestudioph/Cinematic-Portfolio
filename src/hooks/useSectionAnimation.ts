import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface UseSectionAnimationOptions {
  localProgress: number;
  isVisible: boolean;
  onEnter?: (tl: gsap.core.Timeline) => void;
  onLeave?: (direction: 'forward' | 'backward') => void;
}

export function useSectionAnimation({
  localProgress,
  isVisible,
  onEnter,
  onLeave,
}: UseSectionAnimationOptions) {
  const hasEnteredRef = useRef(false);
  const prevProgressRef = useRef(localProgress);
  const enterTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (isVisible && !hasEnteredRef.current) {
      hasEnteredRef.current = true;
      const tl = gsap.timeline();
      enterTimelineRef.current = tl;
      if (onEnter) {
        onEnter(tl);
      }
    } else if (!isVisible && hasEnteredRef.current) {
      const direction = localProgress >= 1 ? 'forward' : 'backward';
      hasEnteredRef.current = false;
      if (onLeave) {
        onLeave(direction);
      }
    }
    prevProgressRef.current = localProgress;
  }, [isVisible, localProgress, onEnter, onLeave]);

  return {
    isEntered: hasEnteredRef.current,
    enterTimeline: enterTimelineRef.current,
  };
}
