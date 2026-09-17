import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';

export const Scene06EnterFootage: React.FC = () => {
  const { progress } = usePortfolio();
  const { start, end } = SCENES.footage;

  const isVisible = progress >= start - 0.02 && progress <= end + 0.03;
  if (!isVisible) return null;

  // Local progress (0.52 to 0.60)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Opacity: fades in from Scene 05, stays full, then smoothly hands off to Showreel
  const opacity = t < 0.1 ? t / 0.1 : t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;

  // The clip balloons up from standard preview size to 100vw/100vh
  // Exponential zoom punch
  const scale = 1.0 + Math.pow(t, 2.2) * 4.5;
  const depthZ = t * 1200;

  // Surrounding universe drops away into deep dark
  const surroundingOpacity = Math.max(0, 1 - t * 2.2);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100"
      style={{
        opacity,
      }}
    >
      {/* Surrounding Timeline Elements falling away into background darkness */}
      <div 
        className="absolute inset-0 flex items-center justify-between px-16 pointer-events-none preserve-3d"
        style={{
          opacity: surroundingOpacity,
          transform: `translateZ(${-t * 800}px) scale(${1 - t * 0.4})`,
        }}
      >
        <div className="w-64 h-40 rounded-lg bg-slate-950/40 border border-white/5 blur-sm" />
        <div className="w-64 h-40 rounded-lg bg-slate-950/40 border border-white/5 blur-sm" />
      </div>

      {/* The Hero Clip Punching In */}
      <div
        className="relative w-[80vw] sm:w-[680px] h-[50vh] sm:h-[420px] rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_120px_rgba(56,189,248,0.7)] preserve-3d will-change-transform"
        style={{
          transform: `translate3d(0, 0, ${depthZ}px) scale(${scale})`,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=85"
          alt="Entering Footage"
          className="w-full h-full object-cover"
        />

        {/* Scanline and anamorphic flare */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-cyan-500/20" />
        <div className="absolute inset-0 crt-scanlines opacity-30" />

        {/* Center Punch-in message */}
        {t < 0.6 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-center">
            <span className="text-xs tracking-[0.3em] text-cyan-300 uppercase bg-black/70 px-4 py-1.5 rounded-full border border-cyan-400/40 animate-pulse">
              BREACHING FOOTAGE HORIZON
            </span>
          </div>
        )}
      </div>

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">SHOT 06</span>
        <span className="text-slate-600">//</span>
        <span>ENTER THE FOOTAGE</span>
      </div>
    </div>
  );
};
