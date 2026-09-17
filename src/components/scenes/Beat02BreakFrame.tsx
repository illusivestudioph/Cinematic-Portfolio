import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { ScrollClipSequence } from '../media/ScrollClipSequence';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';
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
        /* ============ SERVICES & CAPABILITIES GRID ============ */
        <div className="relative w-full h-full flex items-center justify-center p-6 sm:p-12 z-20">
          <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pointer-events-auto">
            {[
              {
                step: '01',
                title: 'OFFLINE EDITING',
                desc: 'Rhythmic commercial cutting, narrative pacing, multi-cam sync, and documentary storytelling.',
                tag: 'Commercials & Film',
              },
              {
                step: '02',
                title: 'COLOR GRADING',
                desc: 'DaVinci Resolve ACES pipeline, 35mm film emulation, custom LUT development, and shot matching.',
                tag: 'Color Science',
              },
              {
                step: '03',
                title: 'SOUND DESIGN',
                desc: 'Dynamic cinematic soundscapes, foley sculpting, vocal treatment, and broadcast-ready loudness mixing.',
                tag: 'Audio Stems',
              },
              {
                step: '04',
                title: 'FINAL DELIVERY',
                desc: 'Cinema DCP, Apple ProRes 4444 XQ, social aspect ratios (9:16, 1:1), and web delivery.',
                tag: 'Mastering',
              },
            ].map((srv) => (
              <div
                key={srv.step}
                className="group relative p-6 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-xl hover:border-[#5EB423] transition-all duration-300 shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-xs text-[#7FFF68] mb-3">
                    <span className="font-bold">{srv.step}</span>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400">{srv.tag}</span>
                  </div>
                  <h3 className="font-bricolage text-xl font-extrabold text-white tracking-tight uppercase group-hover:text-[#7FFF68] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans font-medium">
                    {srv.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>CAPABILITY</span>
                  <span className="text-[#5EB423] group-hover:translate-x-1 transition-transform">PROCEED ↗</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kinetic Scene Title & Badge Overlay */}
      <div className="absolute top-20 sm:top-24 left-8 sm:left-14 z-30 pointer-events-none flex flex-col items-start gap-2">
        <StickerBadge text="STUDIO CAPABILITIES" tag="SERVICES // 02" rotate={1.5} variant="green" />
        <KineticText
          text="FULL-CYCLE POST PRODUCTION"
          active={opacity > 0.1}
          as="h2"
          className="font-bricolage text-3xl sm:text-5xl font-black tracking-tight text-white uppercase text-glow-white"
        />
        <p className="font-bricolage text-sm text-slate-200 font-semibold tracking-wide uppercase">
          From Raw Sensor Rushes to High-Fidelity Broadcast Master
        </p>
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
