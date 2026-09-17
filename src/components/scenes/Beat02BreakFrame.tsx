import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { ScrollClipSequence } from '../media/ScrollClipSequence';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';

/**
 * BEAT 02 — BREAKING THE FRAME
 *
 * The static portrait comes alive. The editor blinks, breaks the pose, moves
 * toward the workstation, pulls up the chair, sits and settles into the
 * editing position. This is a continuation of the opening scene — the same
 * composition, now moving — achieved by chaining multiple ~8s source clips:
 *
 *   BLINK -> BREAK POSE -> MOVE TO WORKSTATION -> PULL UP CHAIR -> SIT & SETTLE
 */
export const Beat02BreakFrame: React.FC = () => {
  const { progress, content } = usePortfolio();
  const beat = PINNED_BEATS.breakFrame;

  if (!isSceneVisible(beat.id, progress)) return null;

  const { localT: t } = getSceneWindow(beat.id, progress);

  // Opacity — continuous hand-off from Beat 01 into Beat 03
  const opacity = t < 0.08 ? t / 0.08 : t > 0.94 ? Math.max(0, (1 - t) / 0.06) : 1;

  const clips = content.breakFrame.clips;
  const hasRealClips = clips.some((c) => c.baseUrl);

  // Movement choreography segments (matched to the source-clip chain)
  const movements = clips.length > 0 ? clips.map((c) => c.label) : ['BLINK'];
  const seg = 1 / movements.length;
  const movementIndex = Math.min(movements.length - 1, Math.floor(t / seg));

  // Procedural choreography values (used when no real clips are configured)
  let chairY = 0;
  let chairRotate = 0;
  let bodyLeanZ = 0;
  const cameraDollyZ = t * 60; // Subtle camera dolly push (normalized)

  if (t < 0.2) {
    // BLINK — a micro-nudge, the first crack in the stillness
    const p = t / 0.2;
    chairY = -p * 8;
  } else if (t < 0.4) {
    // BREAK POSE — the rigid photograph pose releases
    const p = (t - 0.2) / 0.2;
    chairY = -8 + p * 18;
    chairRotate = -p * 5;
  } else if (t < 0.6) {
    // MOVE TO WORKSTATION — body weight shifts toward the desk
    const p = (t - 0.4) / 0.2;
    chairY = 10 + p * 6;
    chairRotate = -5 + p * 2;
  } else if (t < 0.8) {
    // PULL UP CHAIR — the chair rolls in
    const p = (t - 0.6) / 0.2;
    chairY = 16 - p * 14;
    chairRotate = -3 + p * 3;
    bodyLeanZ = p * 18;
  } else {
    // SIT & SETTLE — settling into the editing position, preparing to type
    const p = (t - 0.8) / 0.2;
    chairY = 2 - p * 2;
    chairRotate = p * 1.5;
    bodyLeanZ = 18 + p * 22;
  }

  const seqConfig = content.sequences?.beat02BreakFrame || content.editorSequence;

  return (
    <div
      className="absolute inset-0 overflow-hidden preserve-3d pointer-events-none z-20"
      style={{ opacity }}
    >
      {hasRealClips ? (
        /* ============ CHAINED SOURCE CLIPS — FULL-SCREEN ============ */
        <div className="absolute inset-0">
          <ScrollClipSequence clips={clips} progress={t} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/70 via-transparent to-[#050608]/25 pointer-events-none" />
        </div>
      ) : seqConfig.baseUrl ? (
        /* ============ SINGLE WEBP SEQUENCE (per-beat config) ============ */
        <div className="absolute inset-0">
          <ScrollFrameSequence
            baseUrl={seqConfig.baseUrl}
            frameCount={seqConfig.frameCount}
            padding={seqConfig.padding}
            fallback={seqConfig.fallback}
            progress={t}
            alt="Breaking The Frame Sequence"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/70 via-transparent to-[#050608]/25 pointer-events-none" />
        </div>
      ) : (
        /* ============ PROCEDURAL CHOREOGRAPHY SET ============ */
        <div
          className="relative w-full h-full flex items-center justify-center preserve-3d will-change-transform"
          style={{ transform: `translate3d(0, 0, ${cameraDollyZ}px)` }}
        >
          <div className="relative w-[94vw] max-w-6xl h-[80vh] flex items-center justify-center preserve-3d">
            {/* Monitor glow expanding as the editor leans in */}
            <div className="relative w-[80vw] sm:w-[620px] h-72 sm:h-88 rounded-2xl bg-black border-2 border-cyan-500/40 shadow-[0_0_80px_rgba(56,189,248,0.3)] p-3.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-1.5">
                <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  BAY_A // SESSION_INIT
                </span>
                <span className="text-amber-400 font-bold">00:00:18:04</span>
              </div>

              <div className="relative flex-1 my-2 rounded bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src={seqConfig.fallback || content.catalyst.clips[0]?.fallback || content.editorSequence.fallback}
                  alt="Editor monitor view"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              <div className="h-5 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-white/10 pt-1">
                <span>PROJECT: MASTER_SHOWREEL_TIMELINE</span>
                <span className="text-cyan-400 font-bold">READY</span>
              </div>
            </div>

            {/* Editor breaking the pose at the desk */}
            <div
              className="mt-6 flex flex-col items-center preserve-3d will-change-transform"
              style={{
                transform: `translate3d(0, ${chairY}px, ${bodyLeanZ}px) rotateZ(${chairRotate}deg)`,
              }}
            >
              {/* Keyboard & trackballs */}
              <div className="w-96 sm:w-[500px] h-10 rounded-lg bg-slate-950 border border-white/10 shadow-lg flex items-center justify-between px-6">
                <div className="flex space-x-1">
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className="w-4 h-3 rounded-xs bg-slate-800/80 border border-white/5" />
                  ))}
                </div>
                <div className="flex space-x-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/50 shadow-[0_0_8px_#38bdf8]" />
                  <div className="w-5 h-5 rounded-full bg-slate-900 border border-white/20" />
                  <div className="w-5 h-5 rounded-full bg-purple-950 border border-purple-400/50 shadow-[0_0_8px_#c084fc]" />
                </div>
              </div>

              {/* Moving shoulders / chair back */}
              <div className="w-56 sm:w-64 h-28 bg-gradient-to-t from-black via-[#090b10] to-slate-900/80 rounded-t-full border-t border-white/10 shadow-2xl -mt-2" />
            </div>
          </div>
        </div>
      )}

      {/* Movement readout — the choreography stepper (procedural set only;
          with real clips the ScrollClipSequence shot label takes over) */}
      {!hasRealClips && (
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none">
        {movements.map((m, i) => (
          <React.Fragment key={m + i}>
            {i > 0 && <span className="text-slate-700 text-[10px]">→</span>}
            <span
              className={`font-mono text-[10px] tracking-[0.18em] uppercase whitespace-nowrap transition-all duration-300 ${
                i === movementIndex
                  ? 'text-cyan-300 font-bold'
                  : i < movementIndex
                    ? 'text-slate-400'
                    : 'text-slate-700'
              }`}
            >
              {m}
            </span>
          </React.Fragment>
        ))}
      </div>
      )}

      {/* Cinematic shot badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span>{beat.name}</span>
      </div>
    </div>
  );
};
