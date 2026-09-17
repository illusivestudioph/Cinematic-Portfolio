import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';
import { CinematicVideoPlayer } from '../media/CinematicVideoPlayer';

export const Scene07Showreel: React.FC = () => {
  const { progress, content, setIsReelPlaying } = usePortfolio();
  const { start, end } = SCENES.showreel;

  // Active range extends slightly before and after for continuous film feel
  const isVisible = progress >= start - 0.03 && progress <= end + 0.04;
  if (!isVisible) return null;

  // Local progress (0.60 to 0.72)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Opacity: smoothly enters from Scene 06, maintains prominence, then segues into Scene 08
  const opacity = t < 0.1 ? t / 0.1 : t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;

  // Camera holds rock-solid while watching the reel, with subtle cinematic floating
  const scale = 1.0;
  const depthZ = 0;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-150 z-30"
      style={{
        opacity,
      }}
    >
      <div 
        className="w-[94vw] max-w-6xl h-[72vh] sm:h-[80vh] flex flex-col justify-center pointer-events-auto shadow-[0_0_100px_rgba(0,0,0,0.9)]"
        style={{
          transform: `translate3d(0, 0, ${depthZ}px) scale(${scale})`,
        }}
      >
        <CinematicVideoPlayer
          videoUrl={content.showreel.videoUrl}
          posterUrl={content.showreel.posterUrl}
          title={content.showreel.title}
          subtitle={content.showreel.subtitle}
          aspectRatio="16/9"
          isActive={progress >= start && progress <= end}
          allowScrollLock={true}
          onPlayStateChange={(playing) => setIsReelPlaying(playing)}
          className="w-full h-full border-cyan-500/30 shadow-[0_0_60px_rgba(56,189,248,0.2)]"
        />
      </div>

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">SHOT 07</span>
        <span className="text-slate-600">//</span>
        <span>THE MASTER EDITORIAL SHOWREEL</span>
      </div>
    </div>
  );
};
