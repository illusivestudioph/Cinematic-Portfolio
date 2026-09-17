import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { ScrollClipSequence } from '../media/ScrollClipSequence';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';
import { CinematicBackdrop } from '../media/CinematicBackdrop';
import { Command, Film } from 'lucide-react';
import { KineticText } from '../animation/KineticText';
import { StickerBadge } from '../animation/StickerBadge';

/**
 * BEAT 03 — THE CATALYST
 *
 * The camera moves into the editing environment:
 *
 *   Editor at desk -> over-the-shoulder camera movement -> push toward monitor
 *   -> keyboard shortcut -> DaVinci Resolve timeline activates
 *   -> camera pushes closer into the timeline
 *
 * Several chained source clips cover the complete camera movement; the hotkey
 * trigger fires mid-beat regardless of whether real clips or the procedural
 * suite set is on screen.
 */
export const Beat03Catalyst: React.FC = () => {
  const { progress, content } = usePortfolio();
  const beat = PINNED_BEATS.catalyst;

  if (!isSceneVisible(beat.id, progress)) return null;

  const { localT: t } = getSceneWindow(beat.id, progress);

  // Continuous hand-off from Beat 02 into the showreel peak
  const opacity = t < 0.08 ? t / 0.08 : t > 0.95 ? Math.max(0, (1 - t) / 0.05) : 1;

  const clips = content.catalyst.clips;
  const hasRealClips = clips.some((c) => c.baseUrl);

  // Single per-beat WebP sequence (used when no clip chain is configured)
  const seqConfig = content.sequences?.beat03Catalyst;

  // ---- Procedural camera-move phases ----
  // Phase 1 (0.00-0.40): over-the-shoulder push toward the monitor
  // Phase 2 (0.40-0.62): keyboard shortcut executes
  // Phase 3 (0.62-1.00): DaVinci timeline activates; camera pushes closer in
  const p1 = Math.min(1, t / 0.4);
  const otsScale = 1 + p1 * 0.2;
  const shoulderFade = Math.max(0, 1 - t * 2.4);
  const timelineMix = Math.max(0, Math.min(1, (t - 0.62) / 0.14));
  const timelinePush = 1.06 + Math.max(0, (t - 0.62) / 0.38) * 0.32;
  const hotkeyActive = t >= 0.4 && t <= 0.62;
  const hotkeyPop = hotkeyActive ? Math.min(1, (t - 0.4) / 0.08) * Math.min(1, (0.62 - t) / 0.06) : 0;

  return (
    <div
      className="absolute inset-0 overflow-hidden preserve-3d pointer-events-none z-20"
      style={{ opacity }}
    >
      {hasRealClips ? (
        /* ============ CHAINED CAMERA-MOVE CLIPS — FULL-SCREEN ============ */
        <div className="absolute inset-0">
          <ScrollClipSequence clips={clips} progress={t} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/60 via-transparent to-[#050608]/20 pointer-events-none" />
        </div>
      ) : seqConfig?.baseUrl ? (
        /* ============ SINGLE WEBP SEQUENCE (per-beat config) ============ */
        <div className="absolute inset-0">
          <ScrollFrameSequence
            baseUrl={seqConfig.baseUrl}
            frameCount={seqConfig.frameCount}
            padding={seqConfig.padding}
            fallback={seqConfig.fallback}
            progress={t}
            alt="Catalyst Sequence Over Shoulder"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/60 via-transparent to-[#050608]/20 pointer-events-none" />
        </div>
      ) : (
        /* ============ PROCEDURAL CAMERA MOVE ============ */
        <div className="absolute inset-0">
          {/* Phase 1 — over-the-shoulder view, pushing toward the monitor */}
          <CinematicBackdrop
            src={clips[0]?.fallback || content.editorSequence.fallback}
            alt="Over-the-shoulder view of the editing monitor"
            mode="full"
            scale={otsScale}
            objectPosition="center 32%"
          />

          {/* Editor's shoulder in the foreground — slips past as the camera pushes in */}
          <div
            className="absolute -bottom-10 -left-16 w-[46vw] sm:w-[420px] h-56 bg-gradient-to-t from-black via-slate-950 to-slate-900/60 rounded-tr-[100%] border-t border-white/10 shadow-2xl pointer-events-none transition-opacity duration-200"
            style={{ opacity: shoulderFade }}
          />

          {/* Phase 3 — the DaVinci Resolve timeline activates and takes over the frame */}
          <div
            className="absolute inset-0 transition-opacity duration-200 will-change-transform"
            style={{
              opacity: timelineMix,
            }}
          >
            <CinematicBackdrop
              src={clips[2]?.fallback || content.editorSequence.fallback}
              alt="DaVinci Resolve timeline filling the monitor"
              mode="full"
              scale={timelinePush}
            />
            {/* The playhead sweeping the activated timeline */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_14px_#ef4444] pointer-events-none"
              style={{ left: `${18 + Math.max(0, (t - 0.62) / 0.38) * 66}%` }}
            />
          </div>

          {/* DaVinci session chrome while the timeline is live */}
          <div
            className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-400/30 pointer-events-none transition-opacity duration-300"
            style={{ opacity: timelineMix }}
          >
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[11px] tracking-[0.2em] text-cyan-300 uppercase font-bold">
              DaVinci Resolve — Master_Showreel_Timeline
            </span>
            <span className="font-mono text-[11px] text-amber-400">24 FPS</span>
          </div>
        </div>
      )}

      {/* Mad Dogs Kinetic Quote & Sticker */}
      <div className="absolute top-24 sm:top-28 left-8 sm:left-14 z-30 pointer-events-none flex flex-col items-start gap-3">
        <StickerBadge text="TIMELINE ACTIVATION" tag="CATALYST // 03" rotate={-2} variant="green" />
        <KineticText
          text="THE CATALYST"
          active={opacity > 0.1}
          as="h2"
          className="font-bricolage text-3xl sm:text-5xl font-black tracking-tight text-white uppercase text-glow-white"
        />
        {/* Handwriting annotation in Caveat font */}
        <p className="font-caveat text-xl sm:text-2xl text-[#7FFF68] -rotate-2 tracking-wide font-bold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          "Every cut reshapes the narrative."
        </p>
      </div>

      {/* ============ KEYBOARD SHORTCUT TRIGGER (fires with or without real clips) ============ */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-150"
        style={{ opacity: hotkeyPop }}
      >
        <div className="flex items-center space-x-2.5">
          {['⌘', '⇧', 'E'].map((key) => (
            <div
              key={key}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-zinc-950 border-2 border-[#5EB423] shadow-[0_0_35px_rgba(94,180,35,0.6),inset_0_-3px_0_rgba(0,0,0,0.8)] flex items-center justify-center font-bricolage text-2xl sm:text-3xl font-black text-white"
            >
              {key}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center space-x-2 bg-black/90 border border-[#5EB423] px-5 py-2 rounded-full shadow-[0_0_20px_rgba(94,180,35,0.4)]">
          <Command className="w-4 h-4 text-[#7FFF68]" />
          <span className="font-mono text-xs text-white tracking-[0.25em] uppercase font-bold">
            Timeline Online // Sequence 03
          </span>
        </div>
      </div>

      {/* Cinematic shot badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-300 font-mono text-xs">
        <span className="text-[#7FFF68] font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span className="font-bricolage tracking-wider uppercase font-semibold">{beat.name}</span>
      </div>
    </div>
  );
};
