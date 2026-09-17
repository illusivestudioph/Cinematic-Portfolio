import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS } from '../../config/timeline';
import { RotateCcw, Volume2, GitFork } from 'lucide-react';

export const Beat05Deconstruction: React.FC = () => {
  const { progress } = usePortfolio();
  const beat = PINNED_BEATS.deconstruction;

  // Beat 05 range: 1150/2000 (0.575) to 1500/2000 (0.750)
  const globalStart = 1150 / 2000;
  const globalEnd = 1500 / 2000;

  const [activeTab, setActiveTab] = useState<'nodes' | 'layers' | 'stems'>('nodes');

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity
  const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  // REWIND & LAYER STRIPPING PHASES:
  // Phase 1 (0.00 - 0.35): Finished edit rewinds (rewind timecode & shuttle effect)
  // Phase 2 (0.35 - 0.70): Grade strips away -> DaVinci node tree exposed (LUT, Grain, CST, ACES)
  // Phase 3 (0.70 - 1.00): Revealing the raw uncorrected S-Log3 camera sensor feed

  const rewindSpeed = Math.floor((1 - t) * 240);
  const isRaw = t > 0.65;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100 z-20"
      style={{ opacity }}
    >
      <div className="relative w-[96vw] max-w-7xl h-[85vh] flex flex-col justify-between preserve-3d">
        {/* Deconstruction Stage Header */}
        <div className="flex items-center justify-between px-6 py-3 bg-black/85 border border-white/10 rounded-xl backdrop-blur-md pointer-events-auto shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase">
              <RotateCcw className="w-4 h-4 animate-spin-slow text-cyan-400" />
              <span>REWIND // DECONSTRUCTION</span>
            </div>
            <span className="text-slate-600">//</span>
            <span className="font-mono text-xs text-slate-300">
              {t < 0.35 ? 'STEP 01: HIGH-SPEED REWIND' : t < 0.70 ? 'STEP 02: COLOR & VFX NODE DECOMPOSITION' : 'STEP 03: RAW LOG INGEST SENSOR'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* View Mode Switcher */}
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('nodes')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeTab === 'nodes' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50' : 'bg-white/5 text-slate-400'
                }`}
              >
                Node Tree
              </button>
              <button
                onClick={() => setActiveTab('layers')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeTab === 'layers' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50' : 'bg-white/5 text-slate-400'
                }`}
              >
                Layer Strip
              </button>
              <button
                onClick={() => setActiveTab('stems')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  activeTab === 'stems' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50' : 'bg-white/5 text-slate-400'
                }`}
              >
                Audio Stems
              </button>
            </div>

            <div className="font-mono text-xs text-amber-400 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded">
              REWIND: -{rewindSpeed} FPS
            </div>
          </div>
        </div>

        {/* Central Deconstructed Workspace */}
        <div className="relative flex-1 my-4 flex flex-col lg:flex-row items-center gap-6 preserve-3d">
          {/* Left: Rewinding & Layer-Stripped Screen */}
          <div className="w-full lg:w-3/5 h-full rounded-2xl bg-black border-2 border-cyan-500/30 overflow-hidden shadow-2xl relative pointer-events-auto flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1920&q=85"
              alt="Deconstructed Footage"
              className={`w-full h-full object-cover transition-all duration-300 ${
                isRaw ? 'grayscale contrast-75 brightness-110' : ''
              }`}
            />

            {/* CRT scanlines and rewind bars */}
            <div className="absolute inset-0 crt-scanlines opacity-30 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Rewind Timecode HUD */}
            <div className="absolute top-4 left-4 font-mono text-xs text-white bg-black/70 px-3 py-1 rounded border border-white/10 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>REWINDING // {isRaw ? 'FLAT LOG RAW SENSOR FEED' : 'PROCESSED MASTER'}</span>
            </div>

            {/* Center Layer Deconstruct Notification */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-slate-300 bg-black/80 p-3 rounded-lg border border-white/10">
              <span className="text-cyan-400">
                {isRaw ? 'ACEScg -> S-Log3 Gamut Unfolded' : 'Film Grain Emulation [ Kodak 2383 ] Removed'}
              </span>
              <span className="text-amber-400">NODE STATUS: DECOUPLED</span>
            </div>
          </div>

          {/* Right: Interactive Node Tree & Process Details */}
          <div className="w-full lg:w-2/5 h-full flex flex-col justify-between p-5 rounded-2xl bg-slate-950/90 border border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                <GitFork className="w-4 h-4" />
                DAVINCI COLOR NODE GRAPH
              </span>
              <span className="text-[10px] font-mono text-slate-400">6 NODES ACTIVE</span>
            </div>

            {/* Visual Node Graph Array */}
            <div className="grid grid-cols-2 gap-2.5 flex-1 py-1">
              <div className="p-3 rounded-xl bg-black/70 border border-cyan-400/40 flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-cyan-400">
                  <span>NODE 01</span>
                  <span>ACES CST</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">Color Space Transform</div>
                <div className="text-[9px] font-mono text-slate-500 mt-2">Sony S-Log3 to ACEScct</div>
              </div>

              <div className="p-3 rounded-xl bg-black/70 border border-purple-400/40 flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-purple-400">
                  <span>NODE 02</span>
                  <span>EXPOSURE</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">HDR Balance Wheels</div>
                <div className="text-[9px] font-mono text-slate-500 mt-2">+0.6 EV Highlight Roll</div>
              </div>

              <div className="p-3 rounded-xl bg-black/70 border border-amber-400/40 flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-amber-400">
                  <span>NODE 03</span>
                  <span>SKIN ISOLATION</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">3D Hue Qualifier</div>
                <div className="text-[9px] font-mono text-slate-500 mt-2">Sub-surface Softening</div>
              </div>

              <div className="p-3 rounded-xl bg-black/70 border border-emerald-400/40 flex flex-col justify-between">
                <div className="flex justify-between text-[10px] font-mono text-emerald-400">
                  <span>NODE 04</span>
                  <span>PRINT EMULATION</span>
                </div>
                <div className="text-xs font-mono font-bold text-white mt-1">Kodak 2383 D65</div>
                <div className="text-[9px] font-mono text-slate-500 mt-2">Toe & Shoulder Density</div>
              </div>
            </div>

            {/* Audio Stem Separation Strip */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Volume2 className="w-3 h-3 text-emerald-400" /> MULTI-STEM SPLIT</span>
                <span className="text-emerald-400">-14 LUFS Lock</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                <div className="p-1 rounded bg-slate-900 border border-white/5 text-slate-300">SFX RISERS</div>
                <div className="p-1 rounded bg-slate-900 border border-white/5 text-slate-300">FOLEY IMPACT</div>
                <div className="p-1 rounded bg-slate-900 border border-white/5 text-slate-300">DIALOGUE</div>
                <div className="p-1 rounded bg-slate-900 border border-white/5 text-slate-300">SUB-BASS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span>{beat.name} (REWIND & NODES)</span>
      </div>
    </div>
  );
};
