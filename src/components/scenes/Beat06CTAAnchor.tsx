import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { CinematicBackdrop } from '../media/CinematicBackdrop';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';
import { Mail, ArrowUpRight, Check, Send } from 'lucide-react';
import { KineticText } from '../animation/KineticText';
import { StickerBadge } from '../animation/StickerBadge';

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
  const ctaOpacity = Math.min(1, Math.max(0, (t - 0.55) / 0.25));
  // The editor-looks-into-camera frame (the BLINK clip's still, swappable via CMS)
  const lookFrame = content.breakFrame.clips[0]?.fallback || content.sequences?.beat06CTAAnchor?.fallback || content.editorSequence.fallback;

  // Per-beat WebP sequence: when configured, the real pull-back footage plays
  // full-screen and the stills below are skipped
  const seqConfig = content.sequences?.beat06CTAAnchor;

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
        {seqConfig?.baseUrl ? (
          /* Real pull-back footage — the sequence IS the original composition */
          <div className="absolute inset-0 will-change-transform" style={{ transform: `scale(${settleScale})` }}>
            <ScrollFrameSequence
              baseUrl={seqConfig.baseUrl}
              frameCount={seqConfig.frameCount}
              padding={seqConfig.padding}
              fallback={seqConfig.fallback}
              progress={t}
              alt="Camera pulling back to the original desk composition"
            />
          </div>
        ) : (
          /* Direct, steady editor look frame — no popping of Beat 01 studioOpening */
          <CinematicBackdrop
            src={lookFrame}
            alt="The editor at the desk looking directly into the camera"
            mode="anchored"
            scale={settleScale}
          />
        )}

        {/* Same cinematic grade as the opening — LEFT negative space stays quiet */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/80 via-[#050608]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/85 via-transparent to-[#050608]/30" />
      </div>

      {/* ============ EXPORT MOMENT (right side, over the desk) ============ */}
      <div
        className="absolute right-6 sm:right-12 lg:right-20 top-[16%] sm:top-[20%] w-64 sm:w-80 bg-black/85 backdrop-blur-md rounded-2xl border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(127,255,104,0.15)] p-4 pointer-events-none transition-all duration-300"
        style={{ opacity: t >= 0.33 && t <= 0.8 ? 1 : 0, transform: `translateY(${t >= 0.33 ? 0 : 12}px)` }}
      >
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-2">
          <span className="text-[#7FFF68] font-bold flex items-center gap-1.5">
            <Send className="w-3 h-3" />
            DELIVERY QUEUE // EXPORT
          </span>
          <span className={exportDone ? 'text-[#7FFF68] font-bold' : 'text-zinc-400'}>
            {exportDone ? '100%' : `${Math.round(exportT * 100)}%`}
          </span>
        </div>

        <div className="mt-3 space-y-2 font-mono text-[10px]">
          <div className="flex justify-between text-slate-400">
            <span>ProRes 4444 XQ Master</span>
            <span className={exportDone ? 'text-[#7FFF68] font-bold' : 'text-slate-500'}>{exportDone ? 'DONE' : 'ENCODING'}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-150 ${exportDone ? 'bg-[#7FFF68]' : 'bg-[#5EB423]'}`}
              style={{ width: `${exportT * 100}%`, boxShadow: exportDone ? '0 0 12px #7FFF68' : '0 0 12px #5EB423' }}
            />
          </div>
          {exportDone && (
            <div className="flex items-center space-x-1.5 text-[#7FFF68] font-bold animate-pulse">
              <Check className="w-3 h-3" />
              <span>MASTER EXPORTED — READY FOR BROADCAST</span>
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
          {/* Mad Dogs Sticker Badge */}
          <div className="mb-4">
            <StickerBadge text="FINAL DELIVERY" tag="COMMISSION // 2026" rotate={-2} variant="green" />
          </div>

          <KineticText
            text={content.contact.headline}
            active={ctaOpacity > 0.1}
            as="h2"
            className="font-bricolage text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-none"
            wordClassName="text-glow-white"
          />

          <p className="mt-4 sm:mt-6 font-caveat text-2xl sm:text-4xl text-[#7FFF68] font-bold tracking-wide -rotate-1 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {content.contact.subheadline}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            {/* Mad Dogs Solid Neon CTA Pill */}
            <a
              href={`mailto:${content.contact.email}?subject=Project%20Inquiry%20—%20ILLUSIVE%20STUDIO`}
              className="maddogs-cta-pill"
            >
              <span>{content.contact.ctaButtonText}</span>
              <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
            </a>

            {/* Social Pills */}
            <div className="flex items-center gap-3">
              <button
                onClick={copyEmail}
                className="maddogs-pill cursor-pointer"
              >
                <span>{isCopied ? 'COPIED' : 'EMAIL'}</span>
                {isCopied ? <Check className="w-4 h-4 text-[#7FFF68]" /> : <Mail className="w-4 h-4 text-white" />}
              </button>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="maddogs-pill"
              >
                <span>Instagram</span>
                <span className="text-[#7FFF68]">↗</span>
              </a>
            </div>
          </div>

          <div className="mt-8 flex items-center space-x-2 text-xs font-mono text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7FFF68] animate-ping" />
            <span className="font-bricolage tracking-widest uppercase font-bold text-white/90">
              {content.contact.availability}
            </span>
          </div>
        </div>
      </div>

      {/* Cinematic shot badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-[#7FFF68] font-bold">ILLUSIVE STUDIO</span>
        <span className="text-slate-600">//</span>
        <span className="font-bricolage uppercase font-semibold text-slate-300">Direct Commission & Bookings</span>
      </div>
    </div>
  );
};
