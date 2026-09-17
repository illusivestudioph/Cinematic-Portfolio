import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface StickerBadgeProps {
  text: string;
  tag?: string;
  active?: boolean;
  className?: string;
  rotate?: number;
  variant?: 'green' | 'dark';
}

export const StickerBadge: React.FC<StickerBadgeProps> = ({
  text,
  tag = 'DIRECTOR CUT',
  active = true,
  className = '',
  rotate = -5.5,
  variant = 'dark',
}) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const [secondState, setSecondState] = useState(false);

  // 1-second state alternation like Mad Dogs startBadgeToggling()
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setSecondState(prev => !prev);
    }, 1200);
    return () => clearInterval(interval);
  }, [active]);

  // Entrance bounce animation
  useEffect(() => {
    const el = badgeRef.current;
    if (!el) return;

    if (active) {
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        {
          scale: 0.6,
          opacity: 0,
          rotate: rotate - 10,
        },
        {
          scale: 1,
          opacity: 1,
          rotate: rotate,
          duration: 0.7,
          ease: 'back.out(1.8)',
          delay: 0.15,
        }
      );
    } else {
      gsap.set(el, { scale: 0.6, opacity: 0 });
    }
  }, [active, rotate]);

  const isDark = variant === 'dark';

  return (
    <div
      ref={badgeRef}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`relative inline-flex items-center gap-3.5 px-5 py-3 rounded-2xl md:rounded-3xl border shadow-2xl transition-colors duration-300 ${
        isDark
          ? 'bg-[#0F0F0F]/90 border-white/20 text-white backdrop-blur-xl'
          : 'bg-[#5EB423] border-[#7FFF68] text-black shadow-[0_0_35px_rgba(94,180,35,0.45)]'
      } ${className}`}
    >
      {/* Sticker Circular Icon Stamp */}
      <div
        ref={iconRef}
        className={`relative flex-none w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border shadow-inner transition-transform duration-300 ${
          secondState ? 'scale-105 rotate-6' : 'scale-100 rotate-0'
        } ${
          isDark
            ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-white/30 text-[#5EB423]'
            : 'bg-black text-[#5EB423] border-black/40'
        }`}
      >
        {secondState ? (
          <svg className="w-5 h-5 md:w-6 md:h-6 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
          </svg>
        )}
      </div>

      {/* Badge Content */}
      <div className="flex flex-col">
        <span className={`text-[10px] md:text-xs font-mono tracking-widest uppercase opacity-70 ${isDark ? 'text-zinc-400' : 'text-black/75'}`}>
          {tag}
        </span>
        <span className="font-bricolage text-base md:text-lg font-extrabold tracking-tight leading-none">
          {text}
        </span>
      </div>
    </div>
  );
};
