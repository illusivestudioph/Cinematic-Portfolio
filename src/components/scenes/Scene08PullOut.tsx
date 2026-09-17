import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';

export const Scene08PullOut: React.FC = () => {
  const { progress, content } = usePortfolio();
  const { start, end } = SCENES.studio;

  const isVisible = progress >= start - 0.03 && progress <= end + 0.03;
  if (!isVisible) return null;

  // Local progress (0.72 to 0.80)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Opacity: crossfades in as camera pulls backward, then transitions to Scene 09
  const opacity = t < 0.1 ? t / 0.1 : t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;

  // Pull back transformations
  // Camera pulls backwards: scale shrinks from 1.0 to 0.45, translates back in Z
  const pullScale = 1.0 - t * 0.55;
  const pullZ = -t * 600;
  const tiltX = t * 6; // Slight perspective tilt
  const surroundReveal = Math.min(1, t * 1.5); // Studio environment emerges

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100"
      style={{
        opacity,
      }}
    >
      <div
        className="relative w-full h-full flex items-center justify-center preserve-3d will-change-transform"
        style={{
          transform: `translate3d(0, ${t * 40}px, ${pullZ}px) rotateX(${tiltX}deg) scale(${pullScale})`,
        }}
      >
        {/* Surrounding Studio Environment (Becomes visible as camera pulls back) */}
        <div 
          className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-300"
          style={{ opacity: surroundReveal }}
        >
          {/* Studio Back Wall & Sound Diffusers */}
          <div className="absolute inset-x-0 -top-32 h-64 border-b border-white/10 flex justify-around px-24 opacity-40">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-2 h-48 bg-slate-800 rounded-sm" />
            ))}
          </div>

          {/* Left Side Client Screen (Revealed in studio) */}
          <div 
            className="absolute left-4 sm:left-16 w-64 sm:w-80 h-44 sm:h-52 rounded-xl bg-slate-950 border border-white/15 p-2 shadow-2xl preserve-3d"
            style={{ transform: 'rotateY(25deg) translateZ(-150px)' }}
          >
            <div className="w-full h-full rounded bg-black/90 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80"
                alt="Secondary project feed"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-300 bg-black/70 px-2 py-0.5 rounded">
                STUDIO BAY B // FEED
              </div>
            </div>
          </div>

          {/* Right Side Grading Display */}
          <div 
            className="absolute right-4 sm:right-16 w-64 sm:w-80 h-44 sm:h-52 rounded-xl bg-slate-950 border border-white/15 p-2 shadow-2xl preserve-3d"
            style={{ transform: 'rotateY(-25deg) translateZ(-150px)' }}
          >
            <div className="w-full h-full rounded bg-black/90 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                alt="Grade station"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute top-2 left-2 text-[9px] font-mono text-purple-300 bg-black/70 px-2 py-0.5 rounded">
                COLOR SUITE // ACES 2065
              </div>
            </div>
          </div>

          {/* Foreground Desk & Color Grading Surface */}
          <div 
            className="absolute -bottom-24 w-[85vw] max-w-5xl h-28 bg-gradient-to-t from-black via-slate-950 to-slate-900/90 rounded-t-3xl border-t border-white/15 shadow-2xl flex items-center justify-between px-16 preserve-3d"
            style={{ transform: 'translateZ(150px)' }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-400/40 shadow-[0_0_10px_#38bdf8]" />
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-white/20" />
              <div className="w-8 h-8 rounded-full bg-purple-950 border border-purple-400/40" />
            </div>
            <div className="font-mono text-xs text-slate-500">
              ILLUSIVE STUDIO // MASTER CONSOLE
            </div>
          </div>
        </div>

        {/* The Central Monitor with Reel Frame */}
        <div className="relative w-[85vw] max-w-4xl h-[55vh] sm:h-[480px] rounded-2xl bg-black border-4 border-slate-800 shadow-[0_0_100px_rgba(56,189,248,0.25)] p-2 flex flex-col justify-between overflow-hidden">
          {/* Bezel header */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 px-2">
            <span className="text-cyan-400 font-bold">OLED REFERENCE 8K</span>
            <span className="text-amber-400">HOLD FRAME // REEL COMPLETE</span>
          </div>

          {/* Held Reel Visual */}
          <div className="relative flex-1 rounded-xl overflow-hidden bg-black flex items-center justify-center">
            <img
              src={content.showreel.posterUrl}
              alt="Reel final frame"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            
            {/* Center notice */}
            <div className="absolute bottom-6 flex flex-col items-center">
              <span className="font-syne text-lg font-bold text-white tracking-wider">
                {content.showreel.title}
              </span>
              <span className="text-xs font-mono text-cyan-300 mt-1">
                DISCOVERING SELECTED WORK AHEAD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">SHOT 08</span>
        <span className="text-slate-600">//</span>
        <span>PULL OUT INTO STUDIO BAY</span>
      </div>
    </div>
  );
};
