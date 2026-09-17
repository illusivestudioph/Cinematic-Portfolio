import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';
import { RotateCcw, GitFork, Volume2, Layers, Film, Palette, AudioWaveform, Camera } from 'lucide-react';

/**
 * BEAT 05 — DECONSTRUCTION
 *
 * The finished edit reverses and deconstructs, moving from the polished result
 * back toward the underlying editing process — visually exposing how the film
 * was made, driven entirely by scroll:
 *
 *   Finished edit -> Rewind -> Editing layers -> Timeline -> Color grading
 *   -> DaVinci node tree -> Audio stems / waveforms -> Raw footage / rushes
 */

const STAGES = [
  { id: 'rewind', num: '01', label: 'REWIND', note: 'The finished edit reverses', icon: RotateCcw },
  { id: 'layers', num: '02', label: 'EDITING LAYERS', note: 'Picture layers separate', icon: Layers },
  { id: 'timeline', num: '03', label: 'TIMELINE', note: 'Back to the cut itself', icon: Film },
  { id: 'grade', num: '04', label: 'COLOR GRADE', note: 'The grade is wiped away', icon: Palette },
  { id: 'nodes', num: '05', label: 'NODE TREE', note: 'DaVinci Resolve node graph', icon: GitFork },
  { id: 'stems', num: '06', label: 'AUDIO STEMS', note: 'Waveforms split into stems', icon: AudioWaveform },
  { id: 'raw', num: '07', label: 'RAW RUSHES', note: 'S-Log3 sensor feed — where it began', icon: Camera },
] as const;

/** Which DaVinci nodes are "active" per stage (1-based node numbers) */
const STAGE_NODES: Record<string, number[]> = {
  rewind: [],
  layers: [],
  timeline: [],
  grade: [3, 4],
  nodes: [1, 2, 3, 4],
  stems: [],
  raw: [1],
};

const NODES = [
  { n: 1, color: 'cyan', title: 'ACES CST', sub: 'Color Space Transform', detail: 'Sony S-Log3 to ACEScct' },
  { n: 2, color: 'purple', title: 'EXPOSURE', sub: 'HDR Balance Wheels', detail: '+0.6 EV Highlight Roll' },
  { n: 3, color: 'amber', title: 'SKIN ISOLATION', sub: '3D Hue Qualifier', detail: 'Sub-surface Softening' },
  { n: 4, color: 'emerald', title: 'PRINT EMULATION', sub: 'Kodak 2383 D65', detail: 'Toe & Shoulder Density' },
] as const;

const NODE_COLOR_CLASSES: Record<string, string> = {
  cyan: 'border-cyan-400/40 text-cyan-400',
  purple: 'border-purple-400/40 text-purple-400',
  amber: 'border-amber-400/40 text-amber-400',
  emerald: 'border-emerald-400/40 text-emerald-400',
};

const STEMS = [
  { label: 'DIALOGUE', color: 'bg-cyan-400' },
  { label: 'SFX / FOLEY', color: 'bg-purple-400' },
  { label: 'MUSIC', color: 'bg-amber-400' },
  { label: 'AMBIENCE', color: 'bg-emerald-400' },
];

/** Reverse-running SMPTE timecode for the rewind stage */
function reverseTimecode(stageT: number): string {
  const totalFrames = Math.round((1 - stageT) * 105 * 24); // 01:45 @ 24fps
  const ff = totalFrames % 24;
  const ss = Math.floor(totalFrames / 24) % 60;
  const mm = Math.floor(totalFrames / (24 * 60)) % 60;
  const pad = (v: number) => String(v).padStart(2, '0');
  return `00:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

export const Beat05Deconstruction: React.FC = () => {
  const { progress, content } = usePortfolio();
  const beat = PINNED_BEATS.deconstruction;

  if (!isSceneVisible(beat.id, progress)) return null;

  const { localT: t } = getSceneWindow(beat.id, progress);

  // Continuous hand-off from the showreel peak into the CTA pull-back
  const opacity = t < 0.08 ? t / 0.08 : t > 0.94 ? Math.max(0, (1 - t) / 0.06) : 1;

  // Stage machinery — scroll drives the deconstruction step by step
  const scaled = t * STAGES.length;
  const stageIndex = Math.min(STAGES.length - 1, Math.floor(scaled));
  const stageT = scaled - stageIndex;
  const stage = STAGES[stageIndex];
  const activeNodes = STAGE_NODES[stage.id] ?? [];
  const finishedFrame = content.showreel.posterUrl;
  // Per-beat WebP sequence: when configured, the real deconstruction footage
  // rewinds inside the screen (progress driven backwards with scroll)
  const seqConfig = content.sequences?.beat05Deconstruction;
  const hasSeq = Boolean(seqConfig?.baseUrl);
  const timelineFrame = content.catalyst.clips[2]?.fallback || finishedFrame;

  return (
    <div
      className="absolute inset-0 overflow-hidden flex flex-col pointer-events-none z-20"
      style={{ opacity }}
    >
      <div className="relative w-full h-full max-w-[110rem] mx-auto flex flex-col px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#5EB423]" />
              <span className="font-mono text-xs text-[#7FFF68] uppercase font-bold tracking-widest">
                STAGE DECONSTRUCTION // 05
              </span>
            </div>
            <h2 className="font-bricolage text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              COLOR & SOUND DECONSTRUCTION
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 font-sans font-medium">
              Peeling back the layers: from flat RAW log profiles to color science and spatial sound design.
            </p>
          </div>
        </div>

        {/* ============ DECONSTRUCTION STAGE RAIL ============ */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-3">
          {STAGES.map((s, i) => {
            const Icon = s.icon;
            const isCurrent = i === stageIndex;
            const isPast = i < stageIndex;
            return (
              <React.Fragment key={s.id}>
                {i > 0 && (
                  <div className={`flex-1 min-w-3 h-[2px] rounded ${isPast || isCurrent ? 'bg-[#5EB423]/60' : 'bg-white/10'}`} />
                )}
                <div
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border whitespace-nowrap transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#5EB423]/25 border-[#7FFF68] shadow-[0_0_18px_rgba(94,180,35,0.4)]'
                      : isPast
                        ? 'bg-white/5 border-white/15'
                        : 'bg-transparent border-white/10 opacity-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#7FFF68]' : 'text-slate-500'}`} />
                  <span
                    className={`font-bricolage text-[11px] tracking-[0.1em] uppercase font-bold hidden sm:inline ${
                      isCurrent ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className={`font-mono text-[10px] ${isCurrent ? 'text-[#7FFF68]' : 'text-slate-600'} sm:hidden`}>
                    {s.num}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* ============ DECONSTRUCTED WORKSPACE ============ */}
        <div className="relative flex-1 flex items-stretch gap-5 min-h-0">
          {/* ---- LEFT: The deconstructing screen ---- */}
          <div className="relative flex-1 min-w-0 rounded-2xl bg-black border-2 border-cyan-500/30 overflow-hidden shadow-2xl">
            {hasSeq ? (
              <>
                {/* Real deconstruction footage — rewinds backwards with scroll */}
                <ScrollFrameSequence
                  baseUrl={seqConfig!.baseUrl}
                  frameCount={seqConfig!.frameCount}
                  padding={seqConfig!.padding}
                  fallback={seqConfig!.fallback}
                  progress={1 - t}
                  alt="Rewind Deconstruction Sequence"
                />
                <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
              </>
            ) : (
            <>
            {/* Base: the finished edit frame */}
            <img
              src={finishedFrame}
              alt="The finished edit, deconstructing"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />

            {/* ---- STAGE 01: REWIND ---- */}
            {stage.id === 'rewind' && (
              <div className="absolute inset-0 animate-clip-cut animate-gate-weave">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                <div className="absolute inset-0 bg-cyan-500/5 mix-blend-screen" />
                <div className="absolute top-4 left-4 font-mono text-xs text-white bg-black/70 px-3 py-1 rounded border border-white/10 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-red-400 font-bold">◀◀ REWINDING</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-amber-400">{reverseTimecode(stageT)}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-slate-300 bg-black/80 p-3 rounded-lg border border-white/10 flex items-center justify-between">
                  <span className="text-cyan-400">Shuttling back through the master timeline</span>
                  <span className="text-amber-400">-{Math.round((1 - stageT) * 240)} FPS</span>
                </div>
              </div>
            )}

            {/* ---- STAGE 02: EDITING LAYERS ---- */}
            {stage.id === 'layers' && (
              <div className="absolute inset-0 animate-clip-cut">
                {[
                  { label: 'V2 // GRADE + VFX', offset: stageT * 110, rotate: -4 * stageT, tint: 'hue-rotate(15deg) saturate(1.2)' },
                  { label: 'V1 // MASTER CUT', offset: stageT * 45, rotate: -1.5 * stageT, tint: 'none' },
                  { label: 'A1 // AUDIO BED', offset: -stageT * 30, rotate: 2 * stageT, tint: 'brightness(0.4) saturate(0.4)' },
                ].map((layer) => (
                  <div
                    key={layer.label}
                    className="absolute left-[8%] right-[8%] top-1/2 h-[46%] -translate-y-1/2 rounded-lg overflow-hidden border border-white/20 shadow-2xl bg-black will-change-transform"
                    style={{
                      transform: `translateY(${layer.offset}px) rotate(${layer.rotate}deg)`,
                      zIndex: layer.label.startsWith('V2') ? 3 : layer.label.startsWith('V1') ? 2 : 1,
                    }}
                  >
                    <img
                      src={finishedFrame}
                      alt={layer.label}
                      className="w-full h-full object-cover"
                      style={{ filter: layer.tint === 'none' ? undefined : layer.tint }}
                      draggable={false}
                    />
                    <span className="absolute top-2 left-2 font-mono text-[9px] bg-black/80 px-2 py-0.5 rounded text-cyan-300">
                      {layer.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ---- STAGE 03: TIMELINE ---- */}
            {stage.id === 'timeline' && (
              <div className="absolute inset-0 animate-clip-cut">
                <img
                  src={timelineFrame}
                  alt="The master timeline"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_14px_#ef4444]"
                  style={{ left: `${16 + stageT * 68}%` }}
                />
                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-slate-300 bg-black/80 px-3 py-1.5 rounded border border-white/10">
                  V2 GRADE <span className="text-slate-600">//</span> V1 MASTER CUT <span className="text-slate-600">//</span> A1-A4 AUDIO
                </div>
              </div>
            )}

            {/* ---- STAGE 04: COLOR GRADE (wipe graded -> flat log) ---- */}
            {stage.id === 'grade' && (
              <div className="absolute inset-0 animate-clip-cut">
                {/* Flat log copy underneath — the grade wipes off to reveal it */}
                <div className="absolute inset-0" style={{ filter: 'saturate(0.3) contrast(0.75) brightness(1.2) sepia(0.22)' }}>
                  <img src={finishedFrame} alt="Flat log image" className="w-full h-full object-cover" draggable={false} />
                </div>
                <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${stageT * 100}% 0 0)` }}>
                  <img src={finishedFrame} alt="Graded image" className="w-full h-full object-cover" draggable={false} />
                </div>
                {/* Wipe handle */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 shadow-[0_0_16px_#38bdf8]"
                  style={{ left: `${(1 - stageT) * 100}%` }}
                />
                <div className="absolute top-4 left-4 flex space-x-2 font-mono text-[10px]">
                  <span className="bg-black/70 px-2.5 py-1 rounded border border-cyan-400/40 text-cyan-300">GRADED</span>
                  <span className="bg-black/70 px-2.5 py-1 rounded border border-white/10 text-slate-400">FLAT LOG</span>
                </div>
              </div>
            )}

            {/* ---- STAGE 05: NODE TREE overlay ---- */}
            {stage.id === 'nodes' && (
              <div className="absolute inset-0 animate-clip-cut">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <div className="flex items-center space-x-3 sm:space-x-5">
                    {NODES.map((node, i) => {
                      const appeared = stageT > i * 0.22;
                      return (
                        <React.Fragment key={node.n}>
                          {i > 0 && (
                            <div
                              className="w-8 sm:w-14 h-[2px] transition-all duration-300"
                              style={{
                                background: appeared ? 'rgba(56,189,248,0.7)' : 'rgba(255,255,255,0.12)',
                                boxShadow: appeared ? '0 0 10px rgba(56,189,248,0.6)' : 'none',
                              }}
                            />
                          )}
                          <div
                            className={`px-3 py-2.5 rounded-xl bg-black/90 border transition-all duration-300 ${
                              appeared ? NODE_COLOR_CLASSES[node.color] : 'border-white/10 text-slate-600'
                            } ${appeared ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}
                          >
                            <div className="font-mono text-[9px] opacity-70">NODE {String(node.n).padStart(2, '0')}</div>
                            <div className="font-mono text-[11px] font-bold text-white mt-0.5 whitespace-nowrap">{node.title}</div>
                            <div className="font-mono text-[9px] opacity-60 mt-0.5 hidden sm:block">{node.sub}</div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-cyan-300 bg-black/80 px-3 py-1.5 rounded border border-white/10">
                  DaVinci Resolve — node graph exposed
                </div>
              </div>
            )}

            {/* ---- STAGE 06: AUDIO STEMS ---- */}
            {stage.id === 'stems' && (
              <div className="absolute inset-0 animate-clip-cut">
                <div className="absolute inset-0 bg-black/75" />
                {/* Master waveform */}
                <div className="absolute top-[16%] left-[6%] right-[6%] h-24 flex items-center justify-between space-x-1">
                  {[...Array(56)].map((_, i) => {
                    const h = 14 + Math.abs(Math.sin(i * 0.55) * 0.6 + Math.sin(i * 0.21) * 0.4) * 76;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-200"
                        style={{
                          height: `${h}%`,
                          background: i / 56 < stageT ? 'rgba(56,189,248,0.85)' : 'rgba(255,255,255,0.12)',
                          boxShadow: i / 56 < stageT ? '0 0 8px rgba(56,189,248,0.5)' : 'none',
                        }}
                      />
                    );
                  })}
                </div>
                {/* Stems splitting off */}
                <div className="absolute bottom-[12%] left-[6%] right-[6%] space-y-2.5">
                  {STEMS.map((stem, i) => {
                    const lit = stageT > i * 0.22 + 0.15;
                    return (
                      <div key={stem.label} className="flex items-center space-x-3">
                        <span className={`font-mono text-[10px] w-24 transition-colors duration-300 ${lit ? 'text-white' : 'text-slate-600'}`}>
                          {stem.label}
                        </span>
                        <div className="flex-1 h-4 flex items-center space-x-0.5">
                          {[...Array(28)].map((_, j) => (
                            <div
                              key={j}
                              className={`flex-1 rounded-sm transition-all duration-200 ${lit ? stem.color : 'bg-white/8'}`}
                              style={{ height: `${20 + Math.abs(Math.sin(j * 0.7 + i)) * 80}%`, opacity: lit ? 0.55 + Math.abs(Math.sin(j * 0.7 + i)) * 0.45 : 0.5 }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---- STAGE 07: RAW RUSHES ---- */}
            {stage.id === 'raw' && (
              <div className="absolute inset-0 animate-clip-cut">
                <div className="absolute inset-0" style={{ filter: 'saturate(0.28) contrast(0.72) brightness(1.25) sepia(0.24)' }}>
                  <img src={finishedFrame} alt="Raw log rushes" className="w-full h-full object-cover animate-gate-weave" draggable={false} />
                </div>
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 font-mono text-[10px]">
                  <span className="bg-black/70 px-2.5 py-1 rounded border border-amber-500/40 text-amber-300">S-LOG3</span>
                  <span className="bg-black/70 px-2.5 py-1 rounded border border-white/10 text-slate-400">SGAMUT3.CINE</span>
                  <span className="bg-black/70 px-2.5 py-1 rounded border border-white/10 text-slate-400">ISO 800</span>
                  <span className="bg-black/70 px-2.5 py-1 rounded border border-white/10 text-slate-400">4.6K RAW</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-xs font-mono text-slate-300 bg-black/80 p-3 rounded-lg border border-white/10 flex items-center justify-between">
                  <span className="text-amber-300">CLIP: A001_C012_0811RG.R3M — rushes</span>
                  <span className="text-slate-500">UNTREATED SENSOR FEED</span>
                </div>
              </div>
            )}
            </>
            )}
          </div>

          {/* ---- RIGHT: DaVinci node graph + stems panel ---- */}
          <div className="hidden lg:flex w-[340px] xl:w-[380px] flex-col justify-between p-5 rounded-2xl bg-slate-950/90 border border-white/10 backdrop-blur-md shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-mono text-xs text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                <GitFork className="w-4 h-4" />
                DaVinci Color Node Graph
              </span>
              <span className="text-[10px] font-mono text-slate-400">{activeNodes.length || 0}/4 ACTIVE</span>
            </div>

            {/* Visual node graph array — nodes ignite as the deconstruction reaches them */}
            <div className="grid grid-cols-2 gap-2.5 flex-1 py-1">
              {NODES.map((node) => {
                const isActive = activeNodes.includes(node.n);
                return (
                  <div
                    key={node.n}
                    className={`p-3 rounded-xl bg-black/70 border flex flex-col justify-between transition-all duration-500 ${
                      isActive
                        ? `${NODE_COLOR_CLASSES[node.color]} shadow-[0_0_20px_rgba(56,189,248,0.15)]`
                        : 'border-white/10 opacity-45'
                    }`}
                  >
                    <div className={`flex justify-between text-[10px] font-mono ${NODE_COLOR_CLASSES[node.color].split(' ')[1]}`}>
                      <span>NODE {String(node.n).padStart(2, '0')}</span>
                      <span>{isActive ? '● ACTIVE' : '○ IDLE'}</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-white mt-1">{node.title}</div>
                    <div className="text-[9px] font-mono text-slate-500 mt-2">{node.detail}</div>
                  </div>
                );
              })}
            </div>

            {/* Audio stem separation strip — glows at the stems stage */}
            <div
              className={`p-3 rounded-xl bg-black/60 border space-y-1.5 font-mono text-xs transition-all duration-500 ${
                stage.id === 'stems' ? 'border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.2)]' : 'border-white/5'
              }`}
            >
              <div className="flex justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Volume2 className="w-3 h-3 text-emerald-400" /> Multi-stem split</span>
                <span className="text-emerald-400">-14 LUFS Lock</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-center text-[10px]">
                {STEMS.map((stem) => (
                  <div
                    key={stem.label}
                    className={`p-1 rounded border transition-all duration-500 ${
                      stage.id === 'stems' ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-white/5 text-slate-400'
                    }`}
                  >
                    {stem.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ============ STAGE NOTE ============ */}
        <div className="pt-3 flex items-center justify-center space-x-3 font-mono text-xs">
          <span className="text-cyan-400 font-bold">STEP {stage.num}</span>
          <span className="text-slate-600">//</span>
          <span className="text-white font-bold tracking-[0.2em] uppercase">{stage.label}</span>
          <span className="text-slate-600 hidden sm:inline">//</span>
          <span className="text-slate-400 hidden sm:inline">{stage.note}</span>
        </div>

        {/* Cinematic shot badge */}
        <div className="absolute bottom-6 left-4 sm:left-8 lg:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
          <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
          <span className="text-slate-600">//</span>
          <span>{beat.name}</span>
        </div>
      </div>
    </div>
  );
};
