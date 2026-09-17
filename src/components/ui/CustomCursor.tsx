import React, { useEffect, useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

export const CustomCursor: React.FC = () => {
  const { progress } = usePortfolio();
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const posRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    if (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check hover targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, input, [data-cursor]');
        if (interactive) {
          setIsHovered(true);
          const customLabel = interactive.getAttribute('data-cursor') || 
            (interactive.tagName === 'BUTTON' ? 'SELECT' : 
             interactive.tagName === 'A' ? 'OPEN' : '');
          setHoverLabel(customLabel);
        } else {
          setIsHovered(false);
          setHoverLabel('');
        }
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth RAF loop
    let rafId: number;
    const render = () => {
      const ease = 0.22;
      posRef.current.x += (posRef.current.targetX - posRef.current.x) * ease;
      posRef.current.y += (posRef.current.targetY - posRef.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  // Show the kinetic scroll prompt during the intro (Beat 01)
  const showScrollCue = progress < 0.05 && !isHovered;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
      }}
    >
      {/* Precision Center Reticle */}
      <div className="relative -top-1/2 -left-1/2 flex items-center justify-center">
        {/* Center Target Dot */}
        <div 
          className={`rounded-full transition-all duration-200 ${
            isHovered 
              ? 'w-10 h-10 bg-cyan-400/20 border border-cyan-400 backdrop-blur-xs shadow-[0_0_20px_rgba(56,189,248,0.6)]' 
              : 'w-2 h-2 bg-cyan-400 shadow-[0_0_10px_#38bdf8]'
          }`}
        />

        {/* Outer Director Focus Graticules */}
        {!isHovered && (
          <div className="absolute w-8 h-8 pointer-events-none transition-transform duration-300">
            {/* Top-left corner */}
            <span className="absolute top-0 left-0 w-2 h-[1px] bg-cyan-400/60" />
            <span className="absolute top-0 left-0 w-[1px] h-2 bg-cyan-400/60" />
            
            {/* Top-right corner */}
            <span className="absolute top-0 right-0 w-2 h-[1px] bg-cyan-400/60" />
            <span className="absolute top-0 right-0 w-[1px] h-2 bg-cyan-400/60" />

            {/* Bottom-left corner */}
            <span className="absolute bottom-0 left-0 w-2 h-[1px] bg-cyan-400/60" />
            <span className="absolute bottom-0 left-0 w-[1px] h-2 bg-cyan-400/60" />

            {/* Bottom-right corner */}
            <span className="absolute bottom-0 right-0 w-2 h-[1px] bg-cyan-400/60" />
            <span className="absolute bottom-0 right-0 w-[1px] h-2 bg-cyan-400/60" />
          </div>
        )}

        {/* Hover Label Pill */}
        {isHovered && hoverLabel && (
          <div className="absolute top-7 left-1/2 -translate-x-1/2 bg-black/90 border border-cyan-400/50 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 uppercase tracking-widest whitespace-nowrap shadow-lg">
            {hoverLabel}
          </div>
        )}

        {/* Kinetic Scroll Prompt (Inspired by Mad Dogs scroll-down-notice) */}
        {showScrollCue && (
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center space-x-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 whitespace-nowrap shadow-2xl animate-pulse">
            {/* Mouse wheel glyph */}
            <div className="w-3.5 h-5 rounded-full border border-cyan-400 flex items-start justify-center p-0.5">
              <span className="w-0.5 h-1.5 rounded-full bg-cyan-300 animate-bounce" />
            </div>
            <div className="flex flex-col">
              <span className="font-syne text-[10px] font-bold text-white tracking-widest uppercase">
                SCROLL TO DIRECT
              </span>
              <span className="font-mono text-[8px] text-cyan-400/80 tracking-wider">
                CONTROL 3D REEL
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
