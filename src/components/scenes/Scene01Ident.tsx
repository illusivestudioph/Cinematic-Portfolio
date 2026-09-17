import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';

export const Scene01Ident: React.FC = () => {
  const { progress, content } = usePortfolio();
  const { end } = SCENES.ident;


  // Calculate local progress in Scene 01 (0.00 to 0.05)
  const isCurrent = progress >= 0 && progress <= end + 0.02;
  if (!isCurrent) return null;

  const t = Math.max(0, Math.min(1, progress / end));

  // Opacity curves:
  // 0.0 to 0.2: Fade in from pitch black
  // 0.2 to 0.7: Hold prominent studio ident
  // 0.7 to 1.0: Fade completely out to black/dark room
  let opacity = 0;
  if (t <= 0.2) {
    opacity = t / 0.2;
  } else if (t <= 0.7) {
    opacity = 1;
  } else {
    opacity = Math.max(0, 1 - (t - 0.7) / 0.3);
  }

  // Slight optical scale forward as it holds
  const scale = 0.95 + t * 0.1;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-100 z-50 bg-[#050608]"
      style={{
        opacity,
        visibility: opacity <= 0.01 ? 'hidden' : 'visible',
      }}
    >
      <div
        className="flex flex-col items-center text-center px-6 transition-transform duration-75"
        style={{
          transform: `scale(${scale})`,
        }}
      >
        {/* Film Production Slate Tag */}
        <div className="flex items-center space-x-3 mb-4 opacity-80">
          <span className="h-[1px] w-8 bg-cyan-400" />
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.35em] text-cyan-400 uppercase">
            FILM & EDITORIAL PRODUCTION
          </span>
          <span className="h-[1px] w-8 bg-cyan-400" />
        </div>

        {/* Large Prominent Studio Ident */}
        <h1 className="font-syne text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase select-none text-glow-white">
          {content.studioName}
        </h1>

        {/* Studio Subtitle */}
        <p className="mt-3 sm:mt-5 font-mono text-xs sm:text-sm md:text-base tracking-[0.4em] text-slate-400 uppercase">
          {content.tagline}
        </p>

        {/* Anamorphic line shimmer */}
        <div className="w-64 sm:w-96 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent mt-6 shadow-[0_0_15px_#38bdf8]" />

        {/* Subtle scroll prompt */}
        <div className="absolute bottom-12 flex flex-col items-center opacity-60 animate-pulse">
          <span className="font-mono text-[10px] tracking-[0.25em] text-slate-400 uppercase mb-2">
            Scroll to Enter Camera
          </span>
          <div className="w-4 h-7 rounded-full border border-slate-500/60 flex justify-center p-1">
            <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};
