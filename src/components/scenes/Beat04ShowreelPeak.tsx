import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS } from '../../config/timeline';
import { CinematicVideoPlayer } from '../media/CinematicVideoPlayer';

export const Beat04ShowreelPeak: React.FC = () => {
  const { progress, content, setIsReelPlaying } = usePortfolio();
  const beat = PINNED_BEATS.showreelPeak;

  // Beat 04 range: 900/2000 (0.450) to 1150/2000 (0.575)
  const globalStart = 900 / 2000;
  const globalEnd = 1150 / 2000;

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity: smoothly enters from DaVinci timeline expansion, holds dominant, hands off to deconstruction
  const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-150 z-30"
      style={{ opacity }}
    >
      {/* Viewport dominant showreel experience (85-100% fullscreen montage) */}
      <div className="w-[96vw] max-w-7xl h-[75vh] sm:h-[84vh] flex flex-col justify-center pointer-events-auto shadow-[0_0_140px_rgba(0,0,0,0.95)]">
        <CinematicVideoPlayer
          videoUrl={content.showreel.videoUrl}
          posterUrl={content.showreel.posterUrl}
          title={content.showreel.title}
          subtitle={content.showreel.subtitle}
          aspectRatio="16/9"
          isActive={progress >= globalStart && progress <= globalEnd}
          allowScrollLock={true}
          onPlayStateChange={(playing) => setIsReelPlaying(playing)}
          className="w-full h-full border-cyan-500/50 shadow-[0_0_90px_rgba(56,189,248,0.3)]"
        />
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span>{beat.name} (REAL MP4 MONTAGE)</span>
      </div>
    </div>
  );
};
