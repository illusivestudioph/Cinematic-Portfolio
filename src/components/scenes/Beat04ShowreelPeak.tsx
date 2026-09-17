import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { CinematicVideoPlayer } from '../media/CinematicVideoPlayer';
import { StickerBadge } from '../animation/StickerBadge';
import { Volume2 } from 'lucide-react';

/**
 * BEAT 04 — SHOWREEL PEAK
 *
 * The editing timeline becomes the transition point into the finished work:
 * the real showreel MP4 expands out of the timeline until it occupies the
 * screen — the major visual peak of the whole experience.
 */
export const Beat04ShowreelPeak: React.FC = () => {
  const { progress, content, setIsReelPlaying, isReelPlaying } = usePortfolio();
  const beat = PINNED_BEATS.showreelPeak;

  if (!isSceneVisible(beat.id, progress)) return null;

  const { localT: t, globalStart, globalEnd } = getSceneWindow(beat.id, progress);

  // Continuous hand-off: born from the timeline push of Beat 03, dissolving into Beat 05
  const opacity = t < 0.1 ? t / 0.1 : t > 0.93 ? Math.max(0, (1 - t) / 0.07) : 1;

  // EXPANSION: the video grows out of the timeline until it occupies the screen
  const expand = Math.min(1, t / 0.35);
  const easedExpand = 1 - Math.pow(1 - expand, 3); // ease-out cubic
  const scale = 0.65 + easedExpand * 0.35;
  const riseY = (1 - easedExpand) * 50;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30"
      style={{ opacity }}
    >
      {/* Viewport-dominant showreel — expands from the timeline into the peak */}
      <div
        className="w-[96vw] max-w-[110rem] flex flex-col items-center justify-center will-change-transform"
        style={{
          transform: `translateY(${riseY}px) scale(${scale})`,
        }}
      >
        {/* Mad Dogs Badge above video */}
        <div className="mb-4 pointer-events-auto">
          <StickerBadge text="COMMERCIAL SHOWREEL" tag="FEATURED CUTS // 2024–2026" rotate={-1.5} />
        </div>

        <CinematicVideoPlayer
          videoUrl={content.showreel.videoUrl}
          posterUrl={content.showreel.posterUrl}
          title={content.showreel.title}
          subtitle={content.showreel.subtitle}
          aspectRatio="16/9"
          isActive={progress >= globalStart && progress <= globalEnd}
          allowScrollLock={true}
          onPlayStateChange={(playing) => setIsReelPlaying(playing)}
          className="w-full max-h-[76vh] sm:max-h-[82vh] border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(127,255,104,0.12)]"
        />

        {/* Intentional-play notice — real MP4, audio preserved */}
        {!isReelPlaying && (
          <div className="mt-4 flex items-center space-x-2.5 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15 pointer-events-none shadow-xl">
            <Volume2 className="w-3.5 h-3.5 text-[#7FFF68]" />
            <span className="font-bricolage text-[11px] sm:text-xs tracking-wider text-slate-200 uppercase font-bold">
              Full Studio Showreel — Sound begins on play
            </span>
          </div>
        )}
      </div>

      {/* Cinematic shot badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-[#7FFF68] font-bold">ILLUSIVE STUDIO</span>
        <span className="text-slate-600">//</span>
        <span className="font-bricolage uppercase font-semibold text-slate-300">Commercial & Narrative Showcase</span>
      </div>
    </div>
  );
};
