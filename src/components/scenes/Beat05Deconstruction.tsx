import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS } from '../../config/timeline';
import { RotateCcw, Volume2, GitFork, Layers, Sliders } from 'lucide-react';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';

export const Beat05Deconstruction: React.FC = () => {
  const { progress, content } = usePortfolio();
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
  const seqConfig = content.sequences?.beat05Deconstruction || {
    baseUrl: '',
    frameCount: 140,
    padding: 4,
    fallback: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1920&q=85',
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-100 z-20"
      style={{ opacity }}
    >
      <div className="relative w-[95vw] max-w-6xl h-[82vh] max-h-[780px] flex flex-col justify-between">
        {/* Deconstruction Stage Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-black/90 border border-white/10 rounded-xl backdrop-blur-md pointer-events-auto shadow-2xl">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex items-center space-x-1.5 text-cyan-400 font-mono text-xs font-bold uppercase">
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>REWIND // DECONSTRUCTION</span>
            </div>
            <span className="text-slate-600">//</span>
            <span className="font-mono text-[11px] text-slate-300 hidden sm:inline">
              {t < 0.35 ? 'STEP 01: HIGH-SPEED REWIND' : t < 0.70 ? 'STEP 02: COLOR & VFX NODE DECOMPOSITION' : 'STEP 03: RAW LOG SENSOR INGEST'}
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* View Mode Switcher */}
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('nodes')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                  activeTab === 'nodes' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Nodes
              </button>
              <button
                onClick={() => setActiveTab('layers')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                  activeTab === 'layers' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Layers
              </button>
              <button
                onClick={() => setActiveTab('stems')}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                  activeTab === 'stems' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                Stems
              </button>
            </div>

            <div className="font-mono text-[11px] text-amber-400 bg-amber-950/70 border border-amber-500/40 px-2.5 py-1 rounded">
              -{rewindSpeed} FPS
            </div>
          </div>
        </div>

        {/* Central Deconstructed Workspace */}
        <div className="relative flex-1 my-3 flex flex-col lg:flex-row items-stretch gap-4 min-h-0">
          {/* Left: Rewinding & Layer-Stripped Screen (Driven by WebP scroll sequence or crisp fallback) */}
          <div className="w-full lg:w-7/12 h-64 lg:h-full rounded-2xl bg-black border border-cyan-500/30 overflow-hidden shadow-2xl relative pointer-events-auto flex items-center justify-center">
            {seqConfig.baseUrl ? (
              <ScrollFrameSequence
                baseUrl={seqConfig.baseUrl}
                frameCount={seqConfig.frameCount}
                padding={seqConfig.padding}
                fallback={seqConfig.fallback}
                progress={1 - t} // Rewinds backwards with scroll
                alt="Rewind Deconstruction Sequence"
              />
            ) : (
              <img
                src={seqConfig.fallback}
                alt="Deconstructed Footage"
                className={`w-full h-full object-cover transition-all duration-300 ${
                  isRaw ? 'grayscale contrast-75 brightness-110' : ''
                }`}
              />
            )}

            {/* CRT scanlines and rewind bars */}
            <div className="absolute inset-0 crt-scanlines opacity-25 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 pointer-events-none" />

            {/* Rewind Timecode HUD */}
            <div className="absolute top-3 left-3 font-mono text-[10px] text-white bg-black/80 px-2.5 py-1 rounded border border-white/10 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>REWIND // {isRaw ? 'SONY S-LOG3 FLAT SENSOR FEED' : 'ACEScc MASTER COLOR GRADE'}</span>
            </div>

            {/* Bottom Layer Status Bar */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/85 px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-cyan-400 font-bold">
                {isRaw ? 'CST: Sony S-Gamut3.Cine -> Rec.709 Bypassed' : 'Active LUT: Kodak 2383 D65 Film Emulation'}
              </span>
              <span className="text-amber-400">STATUS: {isRaw ? 'RAW FEED' : 'DECONSTRUCTING'}</span>
            </div>
          </div>

          {/* Right: Interactive Node Tree & Process Details */}
          <div className="w-full lg:w-5/12 h-auto lg:h-full flex flex-col justify-between p-4 rounded-2xl bg-slate-950/95 border border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl space-y-2.5 overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                DAVINCI RESOLVE // NODE GRAPH
              </span>
              <span className="text-[10px] font-mono text-slate-400">4 PRIMARY NODES</span>
            </div>

            {/* Tab 1: Node Graph */}
            {activeTab === 'nodes' && (
              <div className="grid grid-cols-2 gap-2 flex-1 py-1">
                <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                  t > 0.35 ? 'bg-black/80 border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.15)]' : 'bg-black/40 border-white/10 opacity-70'
                }`}>
                  <div className="flex justify-between text-[9px] font-mono text-cyan-400">
                    <span className="font-bold">NODE 01</span>
                    <span>ACES CST</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">Color Space Transform</div>
                  <div className="text-[9px] font-mono text-slate-400">Sony S-Log3 → ACEScct</div>
                </div>

                <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                  t > 0.45 ? 'bg-black/80 border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-black/40 border-white/10 opacity-70'
                }`}>
                  <div className="flex justify-between text-[9px] font-mono text-purple-400">
                    <span className="font-bold">NODE 02</span>
                    <span>EXPOSURE</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">HDR Balance Wheels</div>
                  <div className="text-[9px] font-mono text-slate-400">+0.6 EV Highlight Roll</div>
                </div>

                <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                  t > 0.55 ? 'bg-black/80 border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 'bg-black/40 border-white/10 opacity-70'
                }`}>
                  <div className="flex justify-between text-[9px] font-mono text-amber-400">
                    <span className="font-bold">NODE 03</span>
                    <span>SKIN ISOLATION</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">3D Hue Qualifier</div>
                  <div className="text-[9px] font-mono text-slate-400">Sub-surface Softening</div>
                </div>

                <div className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all ${
                  t > 0.65 ? 'bg-black/80 border-emerald-400/60 shadow-[0_0_15px_rgba(52,211,153,0.15)]' : 'bg-black/40 border-white/10 opacity-70'
                }`}>
                  <div className="flex justify-between text-[9px] font-mono text-emerald-400">
                    <span className="font-bold">NODE 04</span>
                    <span>PRINT EMULATION</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">Kodak 2383 D65</div>
                  <div className="text-[9px] font-mono text-slate-400">Toe & Shoulder Density</div>
                </div>
              </div>
            )}

            {/* Tab 2: Layer Stripping */}
            {activeTab === 'layers' && (
              <div className="flex-1 flex flex-col justify-around py-1 space-y-1.5 font-mono text-xs">
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 flex justify-between items-center">
                  <span className="text-purple-300 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> V3 GRAPHICS & TITLES</span>
                  <span className="text-[10px] text-slate-400">BYPASS</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 flex justify-between items-center">
                  <span className="text-cyan-300 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> V2 COLOR GRADE NODES</span>
                  <span className="text-[10px] text-amber-400">DECOUPLING</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 flex justify-between items-center">
                  <span className="text-emerald-300 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> V1 BASE FOOTAGE CUT</span>
                  <span className="text-[10px] text-emerald-400">LOCKED</span>
                </div>
              </div>
            )}

            {/* Tab 3: Audio Stems */}
            {activeTab === 'stems' && (
              <div className="flex-1 flex flex-col justify-around py-1 space-y-1.5 font-mono text-xs">
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 flex justify-between items-center">
                  <span className="text-slate-300 flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-cyan-400" /> A1 DIALOGUE</span>
                  <span className="text-[10px] text-cyan-400">-12.4 dB</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 flex justify-between items-center">
                  <span className="text-slate-300 flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-amber-400" /> A2 FOLEY IMPACTS</span>
                  <span className="text-[10px] text-amber-400">-14.1 dB</span>
                </div>
                <div className="p-2 rounded-lg bg-black/60 border border-white/10 flex justify-between items-center">
                  <span className="text-slate-300 flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5 text-emerald-400" /> A3 SUB-BASS DRONE</span>
                  <span className="text-[10px] text-emerald-400">-8.0 dB</span>
                </div>
              </div>
            )}

            {/* Audio Stem Separation Strip */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 space-y-1 font-mono">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Sliders className="w-3 h-3 text-emerald-400" /> MULTI-STEM AUDIO BUS</span>
                <span className="text-emerald-400 font-bold">-14 LUFS Broadcast Target</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-[9px]">
                <div className="p-1 rounded bg-slate-900 border border-white/5 text-slate-300">SFX RISERS</div>
                <div className="p-1 rounded bg-slate-900 border border-white/5 text-slate-300">FOLEY</div>
                <div className="p-1 rounded bg-slate-900 border border-white/5 text-slate-300">VOICE</div>
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
