import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';
import { Layers, Activity, Sparkles, Sliders, Volume2, Film } from 'lucide-react';

export const Scene04EditWorld: React.FC = () => {
  const { progress } = usePortfolio();
  const { start, end } = SCENES.editWorld;

  const isVisible = progress >= start - 0.03 && progress <= end + 0.03;
  if (!isVisible) return null;

  // Local progress (0.25 to 0.40)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Opacity: fade in as we breach the monitor glass, hold, then segue into Scene 05
  const opacity = t < 0.15 ? t / 0.15 : t > 0.85 ? Math.max(0, (1 - t) / 0.15) : 1;

  // Camera depth into the editing world
  const depthZ = -600 + t * 900;
  const panX = -100 + t * 250;
  const pitchRotate = -5 + t * 8;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100"
      style={{
        opacity,
      }}
    >
      <div
        className="relative w-[95vw] max-w-7xl h-[85vh] flex flex-col justify-center items-center preserve-3d will-change-transform"
        style={{
          transform: `translate3d(${panX}px, 0, ${depthZ}px) rotateX(${pitchRotate}deg)`,
        }}
      >
        {/* Floating Ambient Dimension Particles & Track Glows */}
        <div className="absolute -top-20 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon: Master Timecode & Playhead HUD */}
        <div 
          className="w-full flex items-center justify-between px-6 py-3 bg-black/80 border-y border-white/10 backdrop-blur-md mb-6 preserve-3d shadow-2xl rounded-t-xl"
          style={{ transform: 'translateZ(80px)' }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>EDIT DIMENSION // MASTER SEQUENCE</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1 text-slate-400 text-xs font-mono">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span>4K PRORES 4444</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Master SMPTE Timecode */}
            <div className="font-mono text-lg sm:text-2xl font-bold tracking-widest text-white text-glow-cyan">
              00:00:<span className="text-cyan-400">{String(Math.floor(25 + t * 15)).padStart(2, '0')}</span>:
              <span className="text-amber-400">{String(Math.floor((t * 100) % 24)).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Spatial 3D Timeline Tracks Container */}
        <div className="relative w-full flex flex-col space-y-3 preserve-3d">
          {/* Vertical Playhead Cursor slicing across the universe */}
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_15px_#ef4444] z-30 pointer-events-none"
            style={{
              left: `${20 + t * 65}%`,
            }}
          >
            {/* Playhead Diamond Cap */}
            <div className="absolute -top-3 -left-2 w-4 h-4 bg-red-500 rotate-45 border border-white/80 shadow-[0_0_10px_#ef4444]" />
            <div className="absolute -bottom-2 -left-1.5 w-3 h-3 bg-red-500 rotate-45" />
          </div>

          {/* ================= VIDEO TRACKS ================= */}
          {/* Track V3 - Motion & VFX / Titles */}
          <div 
            className="h-14 w-full rounded-lg bg-slate-950/80 border border-purple-500/30 flex items-center p-2 relative overflow-hidden preserve-3d shadow-lg"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div className="w-24 shrink-0 font-mono text-xs font-bold text-purple-400 flex items-center space-x-2 border-r border-purple-500/30 pr-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>V3 MOTION</span>
            </div>
            <div className="flex-1 flex items-center space-x-4 pl-4 overflow-hidden">
              <div className="w-48 h-9 rounded bg-purple-950/70 border border-purple-400/60 px-3 flex items-center justify-between text-[11px] font-mono text-purple-200">
                <span>TITLE_KINETIC_01</span>
                <span className="text-[9px] text-purple-400">FX</span>
              </div>
              <div className="w-72 h-9 rounded bg-fuchsia-950/70 border border-fuchsia-400/60 px-3 flex items-center justify-between text-[11px] font-mono text-fuchsia-200">
                <span>ANAMORPHIC_STREAK</span>
                <span className="text-[9px] text-fuchsia-400">GLOW</span>
              </div>
              <div className="w-60 h-9 rounded bg-purple-950/70 border border-purple-400/60 px-3 flex items-center justify-between text-[11px] font-mono text-purple-200">
                <span>3D_TRACK_OVERLAY</span>
              </div>
            </div>
          </div>

          {/* Track V2 - Adjustment Layer / Color Grading */}
          <div 
            className="h-14 w-full rounded-lg bg-slate-950/80 border border-amber-500/30 flex items-center p-2 relative overflow-hidden preserve-3d shadow-lg"
            style={{ transform: 'translateZ(20px)' }}
          >
            <div className="w-24 shrink-0 font-mono text-xs font-bold text-amber-400 flex items-center space-x-2 border-r border-amber-500/30 pr-2">
              <Sliders className="w-3.5 h-3.5" />
              <span>V2 COLOR</span>
            </div>
            <div className="flex-1 flex items-center space-x-4 pl-4 overflow-hidden">
              <div className="w-96 h-9 rounded bg-amber-950/60 border border-amber-400/50 px-3 flex items-center justify-between text-[11px] font-mono text-amber-200">
                <span>ADJ_ACES_FILM_PRINT_2383</span>
                <span className="text-[9px] text-amber-400">LUT 100%</span>
              </div>
              <div className="w-80 h-9 rounded bg-amber-950/60 border border-amber-400/50 px-3 flex items-center justify-between text-[11px] font-mono text-amber-200">
                <span>HALATION_GRAIN_PASS</span>
              </div>
            </div>
          </div>

          {/* Track V1 - Master Cuts & Raw Hero Footage */}
          <div 
            className="h-16 w-full rounded-lg bg-slate-950/90 border border-cyan-500/40 flex items-center p-2 relative overflow-hidden preserve-3d shadow-xl"
            style={{ transform: 'translateZ(0px)' }}
          >
            <div className="w-24 shrink-0 font-mono text-xs font-bold text-cyan-400 flex items-center space-x-2 border-r border-cyan-500/30 pr-2">
              <Layers className="w-3.5 h-3.5" />
              <span>V1 CUTS</span>
            </div>
            <div className="flex-1 flex items-center space-x-2 pl-4 overflow-hidden">
              {/* Sequence of hero clips */}
              <div className="w-44 h-11 rounded bg-cyan-950/80 border border-cyan-400/60 px-3 flex flex-col justify-center text-[10px] font-mono text-cyan-200 relative overflow-hidden">
                <span className="font-bold">A001_C014_RAW</span>
                <span className="text-[9px] text-cyan-400/80">00:00:14:02</span>
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>

              <div className="w-56 h-11 rounded bg-sky-950/80 border border-sky-400/70 px-3 flex flex-col justify-center text-[10px] font-mono text-sky-100 relative overflow-hidden shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                <span className="font-bold text-white">HERO_SPEEDRAMP_TAKEOFF</span>
                <span className="text-[9px] text-cyan-300">CRIMEXBT // SC_04</span>
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              </div>

              <div className="w-64 h-11 rounded bg-cyan-950/80 border border-cyan-400/60 px-3 flex flex-col justify-center text-[10px] font-mono text-cyan-200 relative overflow-hidden">
                <span className="font-bold">A003_MATCH_CUT_CLOSE</span>
                <span className="text-[9px] text-cyan-400/80">00:00:18:19</span>
              </div>

              <div className="w-52 h-11 rounded bg-cyan-950/80 border border-cyan-400/60 px-3 flex flex-col justify-center text-[10px] font-mono text-cyan-200 relative overflow-hidden">
                <span className="font-bold">B_ROLL_ANAMORPHIC</span>
              </div>
            </div>
          </div>

          {/* ================= AUDIO TRACKS WITH REAL WAVEFORMS ================= */}
          {/* Track A1 - Dialogue / Voiceover */}
          <div 
            className="h-14 w-full rounded-lg bg-slate-950/80 border border-emerald-500/30 flex items-center p-2 relative overflow-hidden preserve-3d shadow-lg"
            style={{ transform: 'translateZ(-20px)' }}
          >
            <div className="w-24 shrink-0 font-mono text-xs font-bold text-emerald-400 flex items-center space-x-2 border-r border-emerald-500/30 pr-2">
              <Activity className="w-3.5 h-3.5" />
              <span>A1 DIALOGUE</span>
            </div>
            <div className="flex-1 flex items-center space-x-3 pl-4 overflow-hidden">
              <div className="w-72 h-9 rounded bg-emerald-950/60 border border-emerald-400/50 px-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-200">VO_NARRATIVE_STK</span>
                {/* SVG Audio Waveform */}
                <svg className="w-32 h-6 text-emerald-400 opacity-80" viewBox="0 0 100 24">
                  <path
                    d="M 0 12 Q 10 2 20 12 T 40 12 T 60 12 T 80 12 T 100 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 5 12 L 5 4 M 15 12 L 15 2 M 25 12 L 25 7 M 35 12 L 35 1 M 45 12 L 45 6 M 55 12 L 55 2 M 65 12 L 65 8 M 75 12 L 75 3 M 85 12 L 85 7 M 95 12 L 95 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Track A2 & A3 - SFX & Sub-Bass Foley */}
          <div 
            className="h-14 w-full rounded-lg bg-slate-950/80 border border-blue-500/30 flex items-center p-2 relative overflow-hidden preserve-3d shadow-lg"
            style={{ transform: 'translateZ(-40px)' }}
          >
            <div className="w-24 shrink-0 font-mono text-xs font-bold text-blue-400 flex items-center space-x-2 border-r border-blue-500/30 pr-2">
              <Volume2 className="w-3.5 h-3.5" />
              <span>A2-A3 SFX</span>
            </div>
            <div className="flex-1 flex items-center space-x-4 pl-4 overflow-hidden">
              <div className="w-56 h-9 rounded bg-blue-950/60 border border-blue-400/50 px-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-200">WHOOSH_HIT_BOOM</span>
                <div className="flex space-x-0.5 items-center">
                  {[4, 12, 18, 22, 15, 8, 24, 16, 6, 20].map((h, idx) => (
                    <div key={idx} className="w-1 bg-blue-400 rounded-full" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>
              <div className="w-64 h-9 rounded bg-blue-950/60 border border-blue-400/50 px-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-200">ATMOSPHERE_LOW_RUMBLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">SHOT 04</span>
        <span className="text-slate-600">//</span>
        <span>ENTER THE EDIT DIMENSION</span>
      </div>
    </div>
  );
};
