import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';
import { CinematicBackdrop } from '../media/CinematicBackdrop';
import { KineticText } from '../animation/KineticText';
import { StickerBadge } from '../animation/StickerBadge';

/**
 * BEAT 01 — STATIC ILLUSION
 *
 * Opens immediately on the cinematic editor scene: a full-screen professional
 * editing studio. The editor sits completely still on the RIGHT of the
 * composition — like a polished professional profile photograph — with clean
 * negative space on the LEFT carrying the ILLUSIVE STUDIO ident.
 * No black intro: the lit studio frame is the very first thing on screen.
 */
export const Beat01StaticIllusion: React.FC = () => {
  const { progress, content } = usePortfolio();
  const beat = PINNED_BEATS.staticIllusion;

  if (!isSceneVisible(beat.id, progress, 0.04)) return null;

  const { localT: t } = getSceneWindow(beat.id, progress);

  // Studio ident: full prominence in the LEFT negative space, dissolving as the
  // visitor begins to scroll (the illusion is about to break).
  const titleOpacity = Math.max(0, 1 - t / 0.45);
  const beatOpacity = t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;
  // Beat 01 sequence: dedicated per-beat config wins, editorSequence is the alias
  const seqConfig = content.sequences?.beat01Static?.baseUrl
    ? content.sequences.beat01Static
    : content.editorSequence;
  const hasSequence = Boolean(seqConfig.baseUrl);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-20"
      style={{ opacity: beatOpacity }}
    >
      {/* ============ FULL-SCREEN PROFESSIONAL EDITING STUDIO ============ */}
      {/* Editor on the RIGHT, still as a photograph. When a Supabase WebP
          sequence is configured its first frame IS the static portrait;
          otherwise the cinematic studio still is used. */}
      <div className="absolute inset-0">
        {hasSequence ? (
          <ScrollFrameSequence
            baseUrl={seqConfig.baseUrl}
            frameCount={seqConfig.frameCount}
            padding={seqConfig.padding}
            fallback={seqConfig.fallback}
            progress={0} // completely still — the stillness is the illusion
            alt="Professional editor, completely still in the editing studio"
          />
        ) : (
          <CinematicBackdrop
            src={content.editorSequence.fallback}
            alt="Professional editor, completely still in the editing studio"
            mode="anchored"
          />
        )}

        {/* Cinematic grade: keep the LEFT negative space deep and quiet so the
            ident lives there, while the editor stays lit on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/80 via-[#050608]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/85 via-transparent to-[#050608]/35" />
      </div>

      {/* ============ LEFT NEGATIVE SPACE — STUDIO IDENT ============ */}
      <div className="relative w-full h-full flex items-center">
        <div
          className="pl-6 sm:pl-12 md:pl-20 lg:pl-28 flex flex-col items-start max-w-xl text-left pointer-events-auto select-none preserve-3d"
          style={{
            opacity: titleOpacity,
            transform: `translate3d(0, ${t * 40}px, ${t * 120}px) rotateX(${t * 6}deg)`,
            transformOrigin: 'left center',
          }}
        >
          {/* Studio Category Badge */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <StickerBadge text="COMMERCIAL & FILM POST" tag="POST-PRODUCTION STUDIO" rotate={-2} variant="green" />
            <span className="hidden sm:inline-block font-mono text-xs tracking-[0.25em] text-[#7FFF68] uppercase font-bold drop-shadow-[0_0_10px_rgba(94,180,35,0.8)]">
              // EDITORIAL · COLOR · SOUND
            </span>
          </div>

          {/* Grand studio typography with Kinetic line masking */}
          <KineticText
            text={content.studioName}
            active={titleOpacity > 0.1}
            as="h1"
            className="font-bricolage text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-none"
            wordClassName="text-glow-white"
            stagger={0.04}
          />

          {/* Clear, punchy statement of what this site is offering */}
          <p className="mt-4 sm:mt-6 font-bricolage text-sm sm:text-base md:text-lg text-slate-200 font-semibold leading-snug max-w-lg">
            High-impact video editing, DaVinci Resolve color science, and dynamic sound design for commercial campaigns, music videos, and cinematic films.
          </p>

          {/* Mad Dogs Style Action Pills */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 5.0, behavior: 'smooth' })}
              className="maddogs-cta-pill cursor-pointer"
            >
              <span>VIEW SHOWREEL</span>
              <span className="text-black">↗</span>
            </button>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 15.0, behavior: 'smooth' })}
              className="maddogs-pill cursor-pointer"
            >
              <span>HIRE STUDIO</span>
              <span className="text-[#7FFF68]">✦</span>
            </button>
          </div>

          <div className="w-48 sm:w-72 h-[1px] bg-gradient-to-r from-[#5EB423] via-[#7FFF68]/40 to-transparent mt-8 shadow-[0_0_15px_#5EB423]" />

          {/* Scroll prompt */}
          <div className="mt-8 flex items-center space-x-3 opacity-80">
            <div className="w-5 h-8 rounded-full border-2 border-white/40 flex justify-center p-1 backdrop-blur-md">
              <div className="w-1.5 h-2.5 bg-[#7FFF68] rounded-full animate-bounce shadow-[0_0_8px_#7FFF68]" />
            </div>
            <span className="font-bricolage text-xs uppercase tracking-[0.25em] text-slate-300 font-bold">
              Scroll down to explore services & work
            </span>
          </div>
        </div>
      </div>

      {/* Global studio footer badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-[#7FFF68] font-bold">ILLUSIVE STUDIO</span>
        <span className="text-slate-600">//</span>
        <span className="font-bricolage tracking-wider uppercase font-semibold text-slate-300">
          Commercials · Narrative · Music Videos
        </span>
      </div>

      <div className="absolute bottom-6 right-8 sm:right-12 hidden sm:flex items-center space-x-2 font-mono text-[10px] tracking-widest text-slate-400 uppercase">
        <span className="w-2 h-2 rounded-full bg-[#5EB423] animate-pulse" />
        <span>Accepting Projects for 2026</span>
      </div>
    </div>
  );
};
