import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { CinematicVideoPlayer } from '../media/CinematicVideoPlayer';
import { Volume2 } from 'lucide-react';

/**
 * BEAT 04 — SHOWREEL PEAK
 *
 * The editing timeline becomes the transition point into the finished work:
 * the real showreel MP4 expands out of the timeline until it occupies the
 * screen — the major visual peak of the whole experience.
 *
 * The showreel stays a real MP4 with audio preserved. Playback is intentional:
 * sound only begins when the visitor chooses to play, never from scrolling.
 */
export const Beat04ShowreelPeak: React.FC = () => {
  const { progress, content, setIsReelPlaying, isReelPlaying } = usePortfolio();
  const beat = PINNED_BEATS.showreelPeak;

  if (!isSceneVisible(beat.id, progress)) return null;

  const { localT: t, globalStart, globalEnd } = getSceneWindow(beat.id, progress);

  // Continuous hand-off: born from the timeline push of Beat 03, dissolving
  // into the rewind of Beat 05.
  const opacity = t < 0.1 ? t / 0.1 : t > 0.93 ? Math.max(0, (1 - t) / 0.07) : 1;

  // EXPANSION: the video grows out of the timeline until it occupies the screen
  const expand = Math.min(1, t / 0.35);
  const easedExpand = 1 - Math.pow(1 - expand, 3); // ease-out cubic
  const scale = 0.55 + easedExpand * 0.45;
  const riseY = (1 - easedExpand) * 60;

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
        <CinematicVideoPlayer
          videoUrl={content.showreel.videoUrl}
          posterUrl={content.showreel.posterUrl}
          title={content.showreel.title}
          subtitle={content.showreel.subtitle}
          aspectRatio="16/9"
          isActive={progress >= globalStart && progress <= globalEnd}
          allowScrollLock={true}
          onPlayStateChange={(playing) => setIsReelPlaying(playing)}
          className="w-full max-h-[76vh] sm:max-h-[82vh] border-cyan-500/40 shadow-[0_0_120px_rgba(0,0,0,0.95),0_0_60px_rgba(56,189,248,0.18)]"
        />

        {/* Intentional-play notice — real MP4, audio preserved, sound on click */}
        {!isReelPlaying && (
          <div className="mt-4 flex items-center space-x-2.5 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 pointer-events-none">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] text-slate-300 uppercase">
              Real showreel MP4 — sound starts when you press play
            </span>
          </div>
        )}
      </div>

      {/* Cinematic shot badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span>{beat.name}</span>
      </div>
    </div>
  );
};
