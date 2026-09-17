import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';

export const Scene03Stretch: React.FC = () => {
  const { progress } = usePortfolio();
  const { start, end } = SCENES.monitor;

  const isVisible = progress >= start - 0.02 && progress <= end + 0.03;
  if (!isVisible) return null;

  // Local progress (0.15 to 0.25)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Opacity: smoothly crossfade in from Scene 02 and out into Scene 04
  const opacity = t < 0.1 ? t / 0.1 : t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;

  // Stretch animation progression:
  // Phase 1 (0.0 - 0.4): Arm stretches up
  // Phase 2 (0.4 - 0.6): Hold stretch, arm lowers back to desk
  // Phase 3 (0.6 - 1.0): Camera accelerates rapidly into monitor screen
  let armTranslateY = 0;
  let armRotate = 0;
  let monitorScale = 1.0;
  let cameraZ = 0;

  if (t < 0.4) {
    const p1 = t / 0.4;
    armTranslateY = -p1 * 80;
    armRotate = -p1 * 25;
    monitorScale = 1.1 + p1 * 0.2;
    cameraZ = p1 * 200;
  } else if (t < 0.6) {
    const p2 = (t - 0.4) / 0.2;
    armTranslateY = -80 + p2 * 80;
    armRotate = -25 + p2 * 25;
    monitorScale = 1.3 + p2 * 0.3;
    cameraZ = 200 + p2 * 300;
  } else {
    // Rapid acceleration toward monitor glass
    const p3 = (t - 0.6) / 0.4;
    // Exponential acceleration curve
    const accel = Math.pow(p3, 2.5);
    armTranslateY = 20 * p3;
    armRotate = 0;
    monitorScale = 1.6 + accel * 3.8; // Monitor balloons up to fill screen
    cameraZ = 500 + accel * 1400;
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100"
      style={{
        opacity,
      }}
    >
      <div
        className="relative w-[90vw] max-w-5xl h-[75vh] flex items-center justify-center preserve-3d will-change-transform"
        style={{
          transform: `translate3d(0, 0, ${cameraZ}px) scale(${monitorScale})`,
        }}
      >
        {/* The Dominant Primary Monitor */}
        <div className="relative w-[640px] h-[400px] rounded-xl bg-black border-2 border-cyan-500/50 shadow-[0_0_80px_rgba(56,189,248,0.35)] p-4 flex flex-col justify-between overflow-hidden">
          {/* Glowing monitor glass scanlines and flare */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-transparent to-purple-500/10 pointer-events-none" />
          <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />

          {/* Timecode & Track status */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 border-b border-white/15 pb-2">
            <span className="text-cyan-400 font-bold tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              TIMELINE_SEQUENCE_01
            </span>
            <span className="text-amber-400 font-bold">00:00:18:22</span>
          </div>

          {/* Monitor Screen Core: Shows the threshold of the editing world */}
          <div className="relative flex-1 my-2 rounded bg-slate-950/90 overflow-hidden border border-white/15 flex flex-col items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1280&q=80"
              alt="Monitor Footage"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            
            {/* Overlay Grid lines hinting at NLE */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 border border-cyan-500/20 pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="border border-cyan-500/10" />
              ))}
            </div>

            {/* Pulsing Target Reticle as camera zooms in */}
            <div 
              className="relative z-10 w-24 h-24 rounded-full border border-cyan-400/60 flex items-center justify-center shadow-[0_0_20px_#38bdf8]"
              style={{
                transform: `scale(${1 + t * 0.5})`,
              }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
              <div className="absolute -top-6 text-[9px] font-mono tracking-widest text-cyan-300">
                PUNCH IN // PORTAL
              </div>
            </div>
          </div>

          {/* Mini tracks teaser at the bottom of monitor */}
          <div className="h-8 flex flex-col justify-center space-y-1 border-t border-white/10 pt-1 text-[9px] font-mono text-slate-400">
            <div className="h-2 bg-cyan-900/60 rounded-sm w-3/4 border-l-2 border-cyan-400" />
            <div className="h-2 bg-purple-900/60 rounded-sm w-5/6 border-l-2 border-purple-400" />
          </div>
        </div>

        {/* Editor's Arm & Shoulder Motion in Foreground */}
        <div 
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none transition-transform duration-75 preserve-3d"
          style={{
            transform: `translate3d(-40px, ${armTranslateY}px, 120px) rotate(${armRotate}deg)`,
            opacity: t > 0.7 ? Math.max(0, 1 - (t - 0.7) / 0.2) : 1,
          }}
        >
          {/* Silhouette arm reaching toward monitor */}
          <div className="w-20 h-56 bg-gradient-to-t from-black via-slate-900 to-slate-800/80 rounded-full border border-white/10 shadow-2xl origin-bottom" />
          {/* Hand silhouette */}
          <div className="w-14 h-16 bg-slate-900 rounded-2xl -mt-4 border border-white/10" />
        </div>
      </div>

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">SHOT 03</span>
        <span className="text-slate-600">//</span>
        <span>THE STRETCH & MONITOR PUSH</span>
      </div>
    </div>
  );
};
