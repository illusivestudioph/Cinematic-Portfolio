import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';
import { CinematicBackdrop } from '../media/CinematicBackdrop';

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
  const hasSequence = Boolean(content.editorSequence.baseUrl);

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
            baseUrl={content.editorSequence.baseUrl}
            frameCount={content.editorSequence.frameCount}
            padding={content.editorSequence.padding}
            fallback={content.editorSequence.fallback}
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
          className="pl-6 sm:pl-12 md:pl-20 lg:pl-28 flex flex-col items-start max-w-xl text-left pointer-events-auto select-none"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${t * 30}px)`,
          }}
        >
          {/* Film production tag */}
          <div className="flex items-center space-x-3 mb-4 opacity-85">
            <span className="h-[2px] w-6 bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="font-mono text-xs tracking-[0.35em] text-cyan-400 uppercase font-bold">
              Illusive Studio // Reel
            </span>
          </div>

          {/* Grand studio typography */}
          <h1 className="font-syne text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase text-glow-white leading-none">
            {content.studioName}
          </h1>

          <p className="mt-4 sm:mt-6 font-mono text-xs sm:text-sm md:text-base tracking-[0.35em] text-slate-400 uppercase leading-relaxed max-w-md">
            {content.tagline}
          </p>

          <div className="w-48 sm:w-72 h-[1px] bg-gradient-to-r from-cyan-400/90 via-cyan-400/40 to-transparent mt-6 shadow-[0_0_15px_#38bdf8]" />

          {/* Scroll prompt */}
          <div className="mt-10 flex items-center space-x-3 opacity-75">
            <div className="w-4 h-7 rounded-full border border-slate-500 flex justify-center p-1">
              <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.3em] text-slate-400 uppercase">
              Scroll to break frame
            </span>
          </div>
        </div>
      </div>

      {/* Stillness marker — reinforces the "photograph" illusion */}
      <div className="absolute bottom-6 right-8 sm:right-12 flex items-center space-x-2 font-mono text-[10px] tracking-[0.25em] text-slate-500 uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
        <span>Still — 1/48 Shutter — ISO 800</span>
      </div>

      {/* Cinematic shot badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span>{beat.name}</span>
      </div>
    </div>
  );
};
