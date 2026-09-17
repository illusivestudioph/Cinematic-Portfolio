import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

interface KineticTextProps {
  text: string;
  active?: boolean;
  className?: string;
  wordClassName?: string;
  lineClassName?: string;
  stagger?: number;
  duration?: number;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const KineticText: React.FC<KineticTextProps> = ({
  text,
  active = true,
  className = '',
  wordClassName = '',
  lineClassName = '',
  stagger = 0.03,
  duration = 0.65,
  delay = 0,
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);
  wordsRef.current = [];

  // Parse lines and words (split on newline for lines, split on space for words)
  const lines = useMemo(() => {
    return text.split('\n').filter(l => l.length > 0);
  }, [text]);

  const addWordRef = (el: HTMLSpanElement | null) => {
    if (el && !wordsRef.current.includes(el)) {
      wordsRef.current.push(el);
    }
  };

  useEffect(() => {
    const words = wordsRef.current;
    if (!words.length) return;

    if (active) {
      gsap.killTweensOf(words);
      gsap.fromTo(
        words,
        {
          yPercent: 125,
          opacity: 0,
          rotateZ: 2,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateZ: 0,
          duration,
          delay,
          stagger,
          ease: 'power2.out',
          force3D: true,
          clearProps: 'transform,rotateZ',
        }
      );
    } else {
      gsap.set(words, {
        yPercent: 125,
        opacity: 0,
      });
    }

    return () => {
      gsap.killTweensOf(words);
    };
  }, [active, duration, delay, stagger]);

  return (
    <Component ref={containerRef as any} className={`kinetic-text-container ${className}`}>
      {lines.map((line, lineIdx) => {
        const words = line.split(' ');
        return (
          <span key={lineIdx} className={`kinetic-line ${lineClassName}`}>
            {words.map((word, wordIdx) => (
              <span
                key={wordIdx}
                ref={addWordRef}
                className={`kinetic-word mr-[0.26em] last:mr-0 ${wordClassName}`}
              >
                {word}
              </span>
            ))}
          </span>
        );
      })}
    </Component>
  );
};
