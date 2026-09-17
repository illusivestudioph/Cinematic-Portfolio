import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { CinematicBackdrop } from '../media/CinematicBackdrop';
import { Mail, ArrowUpRight, Check, Send } from 'lucide-react';

/**
 * BEAT 06 — CTA ANCHOR
 *
 * The camera pulls back from the editing environment and the scene returns to
 * the ORIGINAL desk composition — the same frame the experience opened on
 * (visual callback to Beat 01). The editor presses EXPORT, then looks
 * directly into the camera, and the CTA appears in the LEFT negative space —
 * part of the cinematic moment, not a conventional contact section.
 */
export const Beat06CTAAnchor: React.FC = () => {
  const { progress, content } = usePortfolio();
  const beat = PINNED_BEATS.ctaAnchor;

  // Local copy state (email copy chip)
  const [isCopied, setIsCopied] = useState(false);

  if (!isSceneVisible(beat.id, progress)) return null;

  const { localT: t } = getSceneWindow(beat.id, progress);

  // Continuous hand-off from the deconstruction into the footer fade
  const opacity = t < 0.08 ? t / 0.08 : t > 0.95 ? Math.max(0, (1 - t) / 0.05) : 1;

  // CHOREOGRAPHY:
  // Phase 1 (0.00-0.35): camera settles back into the original composition
  // Phase 2 (0.35-0.58): editor presses EXPORT — render bar climbs to 100%
  // Phase 3 (0.58-0.80): editor looks directly into the camera
  // Phase 4 (0.55-1.00): CTA rises into the LEFT negative space
  const settleScale = 1.12 - Math.min(1, t / 0.35) * 0.12; // pull-back settle
  const exportT = Math.max(0, Math.min(1, (t - 0.35) / 0.2));
  const exportDone = exportT >= 1;
  const lookMix = Math.max(0, Math.min(1, (t - 0.58) / 0.16));
  const ctaOpacity = Math.min(1, Math.max(0, (t - 0.55) / 0.25));
  // The editor-looks-into-camera frame (the BLINK clip's still, swappable via CMS)
  const lookFrame = content.breakFrame.clips[0]?.fallback || content.editorSequence.fallback;

  const copyEmail = () => {
    navigator.clipboard.writeText(content.contact.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-20"
      style={{ opacity }}
    >
      {/* ============ THE ORIGINAL COMPOSITION — CALLBACK TO BEAT 01 ============ */}
      <div className="absolute inset-0">
        {/* The opening desk frame, returned to (camera settling back) */}
        <CinematicBackdrop
          src={content.editorSequence.fallback}
          alt="The editor back at the original desk composition"
          mode="anchored"
          scale={settleScale}
        />
        {/* The editor looks directly into the camera */}
        <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: lookMix }}>
          <CinematicBackdrop
            src={lookFrame}
            alt="The editor looking directly into the camera"
            mode="anchored"
          />
        </div>

        {/* Same cinematic grade as the opening — LEFT negative space stays quiet */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/80 via-[#050608]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/85 via-transparent to-[#050608]/30" />
      </div>

      {/* ============ EXPORT MOMENT (right side, over the desk) ============ */}
      <div
        className="absolute right-6 sm:right-12 lg:right-20 top-[16%] sm:top-[20%] w-64 sm:w-80 bg-black/80 backdrop-blur-md rounded-xl border border-cyan-500/40 shadow-[0_0_40px_rgba(56,189,248,0.2)] p-4 pointer-events-none transition-all duration-300"
        style={{ opacity: t >= 0.33 && t <= 0.8 ? 1 : 0, transform: `translateY(${t >= 0.33 ? 0 : 12}px)` }}
      >
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-2">
          <span className="text-cyan-400 font-bold flex items-center gap-1.5">
            <Send className="w-3 h-3" />
            DELIVERY QUEUE // EXPORT
          </span>
          <span className={exportDone ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
            {exportDone ? '100%' : `${Math.round(exportT * 100)}%`}
          </span>
        </div>

        <div className="mt-3 space-y-2 font-mono text-[10px]">
          <div className="flex justify-between text-slate-400">
            <span>ProRes 4444 XQ Master</span>
            <span className={exportDone ? 'text-emerald-400' : 'text-slate-500'}>{exportDone ? 'DONE' : 'RENDERING'}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-150 ${exportDone ? 'bg-emerald-400' : 'bg-cyan-400'}`}
              style={{ width: `${exportT * 100}%`, boxShadow: exportDone ? '0 0 12px #34d399' : '0 0 12px #38bdf8' }}
            />
          </div>
          {exportDone && (
            <div className="flex items-center space-x-1.5 text-emerald-300 animate-clip-cut">
              <Check className="w-3 h-3" />
              <span>MASTER EXPORTED — READY FOR CLIENT</span>
            </div>
          )}
        </div>
      </div>

      {/* ============ LEFT NEGATIVE SPACE — THE CTA ============ */}
      <div className="relative w-full h-full flex items-center">
        <div
          className="pl-6 sm:pl-12 md:pl-20 lg:pl-28 flex flex-col items-start max-w-xl text-left pointer-events-auto select-none transition-all duration-300"
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${(1 - ctaOpacity) * 25}px)`,
          }}
        >
          <span className="font-syne text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
            {content.contact.headline}
          </span>

          <p className="mt-4 sm:mt-6 font-syne text-xl sm:text-3xl md:text-4xl font-bold text-cyan-400 uppercase tracking-wide text-glow-cyan">
            {content.contact.subheadline}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href={`mailto:${content.contact.email}?subject=Project%20Inquiry%20—%20ILLUSIVE%20STUDIO`}
              className="w-full sm:w-auto group px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-syne font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center space-x-2.5 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.7)] hover:scale-105 transition-all duration-300"
            >
              <span>{content.contact.ctaButtonText}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <button
              onClick={copyEmail}
              className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 font-mono text-xs tracking-wider flex items-center justify-center space-x-2 transition-all duration-200"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4 text-cyan-400" />}
              <span>{isCopied ? 'COPIED' : content.contact.email}</span>
            </button>
          </div>

          <div className="mt-6 flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{content.contact.availability}</span>
          </div>
        </div>
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
