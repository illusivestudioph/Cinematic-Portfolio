import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS } from '../../config/timeline';
import { Film, Command, Sparkles, Activity } from 'lucide-react';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';

export const Beat03Catalyst: React.FC = () => {
  const { progress, content } = usePortfolio();
  const beat = PINNED_BEATS.catalyst;

  // Beat 03 range: 550/2000 (0.275) to 900/2000 (0.450)
  const globalStart = 550 / 2000;
  const globalEnd = 900 / 2000;

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity: smoothly enters from Beat 02, hands off to Beat 04 showreel
  const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  // CHOREOGRAPHY:
  // Phase 1 (0.00 - 0.40): Camera pushes over shoulder towards the monitor
  // Phase 2 (0.40 - 0.70): Keyboard shortcut hits (CMD + SHIFT + PLAY)
  // Phase 3 (0.70 - 1.00): DaVinci Resolve timeline smoothly expands towards fullscreen for Beat 04

  const shoulderFade = Math.max(0, 1 - t * 2.0);
  const monitorExpansion = 1.0 + t * 0.12; // Natural, cinematic push-in (max 1.12x)

  const seqConfig = content.sequences?.beat03Catalyst || {
    baseUrl: '',
    frameCount: 120,
    padding: 4,
    fallback: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=1920&q=85',
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-100 z-20"
      style={{ opacity }}
    >
      <div className="relative w-[95vw] max-w-6xl h-[82vh] max-h-[780px] flex flex-col items-center justify-center">
        {/* Editor's Shoulder in Foreground (Over-the-shoulder perspective) */}
        <div
          className="absolute -bottom-6 -left-8 sm:-left-12 w-64 sm:w-80 h-56 bg-gradient-to-t from-black via-slate-950 to-slate-900/60 rounded-tr-full border-t border-white/10 shadow-2xl z-30 pointer-events-none transition-opacity duration-100"
          style={{ opacity: shoulderFade }}
        />

        {/* ================= MONITOR EXPANDING INTO FULL DAVINCI RESOLVE TIMELINE ================= */}
        <div
          className="relative w-full max-w-5xl h-[72vh] max-h-[640px] rounded-2xl bg-black border border-cyan-400/80 shadow-[0_0_80px_rgba(56,189,248,0.25)] p-3.5 sm:p-4 flex flex-col justify-between overflow-hidden transition-transform duration-100"
          style={{
            transform: `scale(${monitorExpansion})`,
          }}
        >
          {/* DaVinci Top Menu Header */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 border-b border-white/15 pb-2">
            <div className="flex items-center space-x-3">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                DAVINCI RESOLVE STUDIO 19
              </span>
              <span className="text-slate-600">//</span>
              <span className="text-slate-400 hidden sm:inline">ACEScc Color Managed</span>
            </div>
            <span className="text-amber-400 font-bold">00:01:00:14</span>
          </div>

          {/* Central Footage Preview / Cut Display */}
          <div className="relative flex-1 my-2 rounded-xl bg-slate-950 overflow-hidden border border-white/10 flex items-center justify-center">
            {seqConfig.baseUrl ? (
              <ScrollFrameSequence
                baseUrl={seqConfig.baseUrl}
                frameCount={seqConfig.frameCount}
                padding={seqConfig.padding}
                fallback={seqConfig.fallback}
                progress={t}
                alt="Catalyst Sequence Over Shoulder"
              />
            ) : (
              <img
                src={seqConfig.fallback}
                alt="DaVinci Preview"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* KEYBOARD SHORTCUT TRIGGER (Phase 2: t between 0.35 and 0.75) */}
            {t >= 0.35 && t <= 0.75 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xs font-mono pointer-events-none">
                <div className="flex items-center space-x-2 bg-cyan-950/90 border border-cyan-400 px-4 py-2 rounded-xl shadow-[0_0_25px_#38bdf8] animate-pulse">
                  <Command className="w-4 h-4 text-cyan-300" />
                  <span className="text-xs text-white font-bold tracking-wider">
                    HOTKEY TRIGGER: [ CMD + SHIFT + PLAY ]
                  </span>
                </div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-[0.25em] mt-2">
                  LAUNCHING MASTER MONTAGE
                </span>
              </div>
            )}
          </div>

          {/* Multi-Track NLE Timeline Structure */}
          <div className="h-24 sm:h-30 flex flex-col justify-between pt-1.5 border-t border-white/15 space-y-1">
            {/* V2 Track */}
            <div className="h-5 rounded bg-purple-950/70 border border-purple-500/30 flex items-center px-3 justify-between text-[9px] font-mono text-purple-300">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> V2 MOTION / GRADE</span>
              <span className="opacity-70">ACES LUT // KODAK 2383</span>
            </div>

            {/* V1 Track with Playhead */}
            <div className="relative h-8 rounded bg-cyan-950/70 border border-cyan-500/40 flex items-center px-3 overflow-hidden">
              <span className="text-[9px] font-mono text-cyan-300 font-bold z-10">V1 MASTER CUT</span>
              
              {/* Playhead slicing across */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_12px_#ef4444]"
                style={{ left: `${20 + t * 65}%` }}
              />
            </div>

            {/* A1 Audio Track */}
            <div className="h-6 rounded bg-emerald-950/70 border border-emerald-500/30 flex items-center px-3 space-x-1 overflow-hidden">
              <span className="text-[9px] font-mono text-emerald-300 mr-2 shrink-0 flex items-center gap-1">
                <Activity className="w-3 h-3" /> A1 AUDIO
              </span>
              {[...Array(32)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-400/80 rounded-full"
                  style={{ height: `${6 + Math.sin(i * 0.5) * 8}px` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span>{beat.name} (DAVINCI TIMELINE)</span>
      </div>
    </div>
  );
};
