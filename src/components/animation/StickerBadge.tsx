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
  tag = 'STUDIO IDENT',
  active = true,
  className = '',
  rotate = -3.5,
}) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const stickerRef = useRef<HTMLDivElement>(null);
  const [secondState, setSecondState] = useState(false);

  // Toggle active icon every 1.5s matching Mad Dogs startBadgeToggling()
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setSecondState((prev) => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, [active]);

  // Entrance drop-down animation matching Mad Dogs EscapeScene
  useEffect(() => {
    const badge = badgeRef.current;
    const sticker = stickerRef.current;
    if (!badge || !sticker) return;

    if (active) {
      gsap.killTweensOf([badge, sticker]);
      const tl = gsap.timeline();
      tl.fromTo(
        badge,
        {
          y: 200,
          opacity: 0,
          scale: 0.6,
          rotation: rotate - 8,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: rotate,
          duration: 0.7,
          ease: 'power2.out',
          transformOrigin: 'center center',
        }
      ).fromTo(
        sticker,
        {
          opacity: 0,
          scale: 0,
          rotation: -45,
        },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'back.out(1.7)',
          transformOrigin: 'center center',
        },
        '-=0.4'
      );
    } else {
      gsap.set(badge, { opacity: 0, y: 100 });
    }
  }, [active, rotate]);

  return (
    <div
      ref={badgeRef}
      style={{
        transform: `rotate(${rotate}deg)`,
        transformOrigin: 'center center',
      }}
      className={`relative inline-flex items-center select-none ${className}`}
    >
      {/* Authentic Mad Dogs Cutout Pill Background */}
      <div className="relative flex items-center py-2.5 sm:py-3.5 px-4 sm:px-6 bg-[#0F0F0F] rounded-[28px] sm:rounded-[36px] border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(127,255,104,0.12)]">
        {/* Left Circular Sticker Disc */}
        <div
          ref={stickerRef}
          className="relative flex-none w-10 h-10 sm:w-12 sm:h-12 mr-3 sm:mr-4 rounded-full overflow-hidden flex items-center justify-center shadow-lg border border-white/30"
          style={{
            background: 'conic-gradient(from 180deg at 50% 50%, #7FFF68 0deg, #5EB423 180deg, #FFFFFF 180deg, #FFFFFF 360deg)',
          }}
        >
          {/* Inner Black Core with Icon */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0F0F0F] flex items-center justify-center text-white shadow-inner">
            {secondState ? (
              <span className="text-[#7FFF68] font-bold text-xs sm:text-sm animate-pulse">✦</span>
            ) : (
              <span className="text-white font-bold text-xs sm:text-sm">▶</span>
            )}
          </div>
        </div>

        {/* Text Container */}
        <div className="flex flex-col text-left">
          {tag && (
            <span className="font-mono text-[9px] sm:text-[11px] tracking-[0.2em] uppercase text-[#7FFF68] font-bold leading-none mb-1">
              {tag}
            </span>
          )}
          <span className="font-bricolage text-sm sm:text-lg md:text-xl font-extrabold text-white tracking-wide uppercase leading-tight">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
};
