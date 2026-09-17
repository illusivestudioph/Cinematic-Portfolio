import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_SCENES } from '../../config/timeline';
import { Film, Crosshair, Sparkles } from 'lucide-react';

export const Scene02Timeline: React.FC = () => {
  const { progress } = usePortfolio();
  const scene = PINNED_SCENES.timeline;

  // Scene 02 range: 250/1950 (0.128) to 550/1950 (0.282)
  const globalStart = 250 / 1950;
  const globalEnd = 550 / 1950;

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity: smoothly enters from Scene 01 at monitor glass, stays full, hands off to Showreel
  const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  // SPATIAL CAMERA PROGRESSION:
  // Phase 1 (0.0 - 0.25): Breaches monitor glass, enters the 3D editing dimension
  // Phase 2 (0.25 - 0.70): Traverses across 3D timeline tracks (V1-V3, A1-A3, waveforms)
  // Phase 3 (0.70 - 0.88): Panning and locking onto the target destination clip
  // Phase 4 (0.88 - 1.00): Target clip balloons to fill screen, surrounding elements drop away

  const depthZ = -600 + t * 1400;
  const lateralX = -t * 600;
  const pitchRotate = -4 + Math.sin(t * Math.PI) * 6;

  // Active milestone phase indicator
  let waypointName = 'BREACHING MONITOR';
  if (t > 0.85) waypointName = 'SELECTED CLIP EXPAND';
  else if (t > 0.70) waypointName = 'TARGET CLIP LOCK';
  else if (t > 0.55) waypointName = 'COLOR & MOTION NODES';
  else if (t > 0.40) waypointName = 'AUDIO WAVEFORMS & STEMS';
  else if (t > 0.25) waypointName = '3D NLE ASSEMBLY (V1-V3)';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100"
      style={{
        opacity,
      }}
    >
      <div
        className="relative w-[96vw] max-w-7xl h-[85vh] flex flex-col justify-center items-center preserve-3d will-change-transform"
        style={{
          transform: `translate3d(${lateralX}px, 0, ${depthZ}px) rotateX(${pitchRotate}deg)`,
        }}
      >
        {/* Ambient Dimension Light Blooms */}
        <div className="absolute -top-16 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Master Timecode & Playhead HUD Ribbon */}
        <div
          className="w-full flex items-center justify-between px-6 py-2.5 bg-black/85 border-y border-white/10 backdrop-blur-md mb-6 preserve-3d shadow-2xl rounded-t-xl"
          style={{ transform: 'translateZ(90px)' }}
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span>EDIT DIMENSION // 3D TIMELINE</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1 text-slate-300 text-xs font-mono">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-cyan-300 font-bold">{waypointName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 font-mono text-xs sm:text-sm text-slate-300">
            <span>TC 00:00:<span className="text-cyan-400 font-bold">{String(Math.floor(25 + t * 30)).padStart(2, '0')}</span>:18</span>
          </div>
        </div>

        {/* Spatial 3D Timeline Tracks Array */}
        <div className="relative w-full flex flex-col space-y-3 preserve-3d">
          {/* Vertical Playhead Cursor slicing through spatial tracks */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_20px_#ef4444] z-30 pointer-events-none"
            style={{
              left: `${15 + t * 75}%`,
            }}
          >
            <div className="absolute -top-3 -left-2 w-4 h-4 bg-red-500 rotate-45 border border-white/80 shadow-[0_0_12px_#ef4444]" />
            <div className="absolute -bottom-2 -left-1.5 w-3 h-3 bg-red-500 rotate-45" />
          </div>

          {/* VIDEO TRACK 3 (V3: Motion Graphics & Speed Ramps) */}
          <div
            className="h-14 sm:h-16 rounded-xl bg-slate-950/80 border border-purple-500/30 backdrop-blur-md flex items-center px-4 space-x-4 preserve-3d shadow-xl"
            style={{ transform: 'translateZ(120px)' }}
          >
            <div className="flex items-center space-x-2 w-16 sm:w-24 shrink-0 text-purple-400 font-mono text-xs font-bold">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>V3 MOTION</span>
            </div>
            <div className="flex-1 flex space-x-3 overflow-hidden">
              <div className="w-48 h-10 rounded-lg bg-purple-950/70 border border-purple-400/40 flex items-center px-3 text-[10px] font-mono text-purple-300">
                WHIP_PAN_TRANSITION
              </div>
              <div className="w-64 h-10 rounded-lg bg-purple-900/60 border border-purple-400/50 flex items-center px-3 text-[10px] font-mono text-purple-200">
                DYNAMIC_SPEED_RAMP_400%
              </div>
              <div className="w-40 h-10 rounded-lg bg-purple-950/70 border border-purple-400/40 flex items-center px-3 text-[10px] font-mono text-purple-300">
                KINETIC_TITLES
              </div>
            </div>
          </div>

          {/* VIDEO TRACK 2 (V2: B-Roll & Inserts) */}
          <div
            className="h-16 sm:h-20 rounded-xl bg-slate-950/80 border border-sky-500/30 backdrop-blur-md flex items-center px-4 space-x-4 preserve-3d shadow-xl"
            style={{ transform: 'translateZ(60px)' }}
          >
            <div className="flex items-center space-x-2 w-16 sm:w-24 shrink-0 text-sky-400 font-mono text-xs font-bold">
              <Film className="w-4 h-4 text-sky-400" />
              <span>V2 B-ROLL</span>
            </div>
            <div className="flex-1 flex space-x-4 overflow-hidden">
              <div className="w-56 h-12 rounded-lg bg-sky-950/70 border border-sky-400/40 flex items-center px-3 text-[10px] font-mono text-sky-300">
                ANAMORPHIC_CAR_CHASE_04
              </div>
              <div className="w-72 h-12 rounded-lg bg-sky-900/70 border border-sky-400/60 flex items-center px-3 text-[10px] font-mono text-white">
                MACRO_ACTION_STUNT_CLOSEUP
              </div>
            </div>
          </div>

          {/* VIDEO TRACK 1 (V1: A-Cam Hero Footage & Destination Clip) */}
          <div
            className="h-24 sm:h-32 rounded-xl bg-slate-950/90 border-2 border-cyan-400/50 backdrop-blur-md flex items-center px-4 space-x-4 preserve-3d shadow-[0_0_40px_rgba(56,189,248,0.2)]"
            style={{ transform: 'translateZ(0px)' }}
          >
            <div className="flex items-center space-x-2 w-16 sm:w-24 shrink-0 text-cyan-400 font-mono text-xs font-bold">
              <Film className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>V1 PRIMARY</span>
            </div>

            {/* Clips on Primary Track */}
            <div className="flex-1 flex space-x-4 items-center">
              <div className="w-52 h-20 sm:h-24 rounded-lg bg-cyan-950/60 border border-cyan-500/30 p-2 flex flex-col justify-between opacity-70">
                <span className="text-[10px] font-mono text-cyan-300">RAW_A001_C002.MOV</span>
                <span className="text-[9px] font-mono text-slate-500">24.00 FPS // 4K DCI</span>
              </div>

              {/* ================= HERO TARGET CLIP DESTINATION ================= */}
              {/* As t approaches 1.0, this clip expands to become the showreel horizon */}
              <div
                className="relative rounded-xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_60px_rgba(56,189,248,0.6)] flex items-center justify-center transition-all duration-75 preserve-3d will-change-transform"
                style={{
                  width: `${240 + Math.pow(t, 2.5) * 800}px`,
                  height: `${90 + Math.pow(t, 2.5) * 450}px`,
                  transform: `translateZ(${t * 600}px)`,
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=85"
                  alt="Selected Reel Ingest"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                <div className="absolute top-2 left-2 flex items-center space-x-2 bg-black/70 px-2 py-0.5 rounded border border-cyan-400/50">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="font-mono text-[10px] text-cyan-300 font-bold uppercase">
                    SELECTED SHOWREEL CLIP
                  </span>
                </div>

                {t > 0.8 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-xs font-mono">
                    <span className="text-xs sm:text-sm tracking-[0.35em] text-cyan-300 uppercase px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/60 animate-pulse">
                      ENTERING SHOWREEL HORIZON
                    </span>
                  </div>
                )}
              </div>

              <div className="w-48 h-20 sm:h-24 rounded-lg bg-cyan-950/60 border border-cyan-500/30 p-2 flex flex-col justify-between opacity-70">
                <span className="text-[10px] font-mono text-cyan-300">RAW_A003_C018.MOV</span>
                <span className="text-[9px] font-mono text-slate-500">24.00 FPS // 4K DCI</span>
              </div>
            </div>
          </div>

          {/* AUDIO TRACKS (A1 & A2: Stereo Stems & Sub-Bass Risers) */}
          <div
            className="h-16 sm:h-20 rounded-xl bg-slate-950/80 border border-emerald-500/30 backdrop-blur-md flex items-center px-4 space-x-4 preserve-3d shadow-xl"
            style={{ transform: 'translateZ(-60px)' }}
          >
            <div className="flex items-center space-x-2 w-16 sm:w-24 shrink-0 text-emerald-400 font-mono text-xs font-bold">
              <span>A1-A2 AUDIO</span>
            </div>
            {/* Visual audio waveform bars */}
            <div className="flex-1 flex items-center space-x-1 overflow-hidden h-12 px-2 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
              {[...Array(64)].map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-emerald-400/80 rounded-full transition-all duration-75"
                  style={{
                    height: `${15 + Math.sin(i * 0.4 + t * 10) * 25 + Math.random() * 8}px`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shot Badge */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">SHOT {scene.code}</span>
        <span className="text-slate-600">//</span>
        <span>{scene.name}</span>
      </div>
    </div>
  );
};
