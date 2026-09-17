import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { ScrollClipSequence } from '../media/ScrollClipSequence';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';
import { CinematicBackdrop } from '../media/CinematicBackdrop';
import { KineticText } from '../animation/KineticText';
import { StickerBadge } from '../animation/StickerBadge';

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
        <div className="absolute inset-0">
          <CinematicBackdrop
            src={content.editorSequence.fallback}
            alt="Post-production editorial suite"
            mode="anchored"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/90 via-[#050608]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 via-transparent to-[#050608]/30" />
        </div>
      )}

      {/* ============ LEFT-PINNED NARRATIVE COLUMN (Mad Dogs Layout) ============ */}
      <div className="relative w-full h-full flex items-center">
        <div className="pl-6 sm:pl-12 md:pl-20 lg:pl-28 flex flex-col items-start max-w-xl text-left pointer-events-auto select-none">
          {/* Sticker Badge */}
          <div className="mb-3">
            <StickerBadge text="FULL POST PIPELINE" tag="SERVICES // 02" rotate={1.5} variant="green" />
          </div>

          <KineticText
            text="POST-PRODUCTION ARCHITECTURE"
            active={opacity > 0.1}
            as="h2"
            className="font-bricolage text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight leading-none"
            wordClassName="text-glow-white"
          />

          <p className="mt-3 font-bricolage text-sm sm:text-base text-zinc-300 font-semibold leading-relaxed">
            From rough assembly to final theatrical picture lock. We handle offline cuts, precision color grading, and broadcast-ready audio.
          </p>

          {/* Capabilities Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
            {[
              { num: '01', title: 'OFFLINE EDITING', sub: 'Commercials · Film · Pacing' },
              { num: '02', title: 'COLOR SCIENCE', sub: 'DaVinci ACES · Film Print' },
              { num: '03', title: 'SOUND DESIGN', sub: 'Foley · Stems · Mix' },
              { num: '04', title: 'FINAL MASTERING', sub: 'ProRes 4444 · Cinema DCP' },
            ].map((c) => (
              <div
                key={c.num}
                className="p-3 rounded-xl bg-black/75 border border-white/15 backdrop-blur-md flex flex-col justify-center"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#7FFF68]">
                  <span>{c.num}</span>
                  <span className="text-zinc-500">READY</span>
                </div>
                <span className="font-bricolage font-extrabold text-white text-xs sm:text-sm uppercase tracking-wide mt-0.5">
                  {c.title}
                </span>
                <span className="text-[11px] text-zinc-400 font-sans">{c.sub}</span>
              </div>
            ))}
          </div>

          {/* Action Pills */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 5.0, behavior: 'smooth' })}
              className="maddogs-cta-pill cursor-pointer text-xs py-2.5 px-6"
            >
              <span>SEE OUR SHOWREEL</span>
              <span>↗</span>
            </button>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 15.0, behavior: 'smooth' })}
              className="maddogs-pill cursor-pointer text-xs py-2.5 px-5"
            >
              <span>DISCUSS RATES</span>
              <span className="text-[#7FFF68]">✦</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cinematic shot badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-300 font-mono text-xs">
        <span className="text-[#7FFF68] font-bold">SERVICES</span>
        <span className="text-slate-600">//</span>
        <span className="font-bricolage tracking-wider uppercase font-semibold">Post-Production Pipeline</span>
      </div>
    </div>
  );
};
