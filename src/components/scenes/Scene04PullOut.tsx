import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_SCENES } from '../../config/timeline';

export const Scene04PullOut: React.FC = () => {
  const { progress, content } = usePortfolio();
  const scene = PINNED_SCENES.studio;

  // Scene 04 range: 750/1950 (0.385) to 1000/1950 (0.513)
  const globalStart = 750 / 1950;
  const globalEnd = 1000 / 1950;

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity: crossfades in smoothly as camera pulls back from reel, then transitions into project discovery
  const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  // Camera pulls backward in 3D:
  // t = 0.0: Fullscreen reel
  // t = 1.0: Reel shrinks down to 0.45 scale, revealing the large studio monitor, desk, diffusers, and client stations
  const pullScale = 1.0 - t * 0.52;
  const pullZ = -t * 700;
  const tiltX = t * 5.5; // cinematic perspective tilt
  const surroundReveal = Math.min(1, t * 1.6); // Studio room emerges

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
          transform: `translate3d(0, ${t * 30}px, ${pullZ}px) rotateX(${tiltX}deg) scale(${pullScale})`,
        }}
      >
        {/* ================= SURROUNDING STUDIO ENVIRONMENT ================= */}
        {/* Emerges as the camera pulls backward, giving spatial grounding to the film */}
        <div
          className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-300"
          style={{ opacity: surroundReveal }}
        >
          {/* Studio Back Wall & Sound Diffusers */}
          <div className="absolute inset-x-0 -top-28 h-64 border-b border-white/10 flex justify-around px-16 sm:px-24 opacity-40">
            {[...Array(22)].map((_, i) => (
              <div key={i} className="w-2 h-48 bg-slate-800 rounded-sm" />
            ))}
          </div>

          {/* Left Side Client Screen (Revealed in studio bay) */}
          <div
            className="absolute left-4 sm:left-16 w-64 sm:w-80 h-44 sm:h-52 rounded-xl bg-slate-950 border border-white/15 p-2 shadow-2xl preserve-3d"
            style={{ transform: 'rotateY(25deg) translateZ(-160px)' }}
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
            style={{ transform: 'rotateY(-25deg) translateZ(-160px)' }}
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
        </div>

        {/* ================= CENTRAL PRIMARY STUDIO MONITOR ================= */}
        {/* The showreel video holds on its final frame as the screen pulls back */}
        <div className="relative w-[92vw] max-w-5xl h-[65vh] sm:h-[75vh] rounded-2xl bg-black border-2 border-cyan-500/50 shadow-[0_0_90px_rgba(56,189,248,0.3)] p-3.5 flex flex-col justify-between overflow-hidden preserve-3d">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/10 pb-2">
            <span className="text-cyan-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              MASTER_PLAYOUT // REEL_COMPLETE
            </span>
            <span className="text-amber-400 font-bold">00:01:20:00</span>
          </div>

          <div className="relative flex-1 my-2 rounded-lg bg-slate-950 overflow-hidden border border-white/10 flex items-center justify-center">
            <img
              src={content.showreel.posterUrl}
              alt="Final frame hold"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />

            <div className="absolute bottom-6 left-6 font-mono">
              <div className="text-[10px] text-cyan-400 uppercase tracking-widest">SHOWREEL COMPLETED</div>
              <div className="text-lg font-bold text-white font-syne">{content.showreel.title}</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-white/10">
            <span>PULLING OUT INTO THE STUDIO WORLD</span>
            <span className="text-cyan-400">NEXT // PROJECT DESTINATIONS</span>
          </div>
        </div>
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">SHOT {scene.code}</span>
        <span className="text-slate-600">//</span>
        <span>{scene.name}</span>
      </div>
    </div>
  );
};
