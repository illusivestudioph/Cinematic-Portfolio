import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_SCENES } from '../../config/timeline';

export const Scene07About: React.FC = () => {
  const { progress, content } = usePortfolio();
  const scene = PINNED_SCENES.about;

  // Scene 07 range: 1550/1950 (0.795) to 1750/1950 (0.897)
  const globalStart = 1550 / 1950;
  const globalEnd = 1750 / 1950;

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity: camera holds rock-solid while About copy is revealed and read
  const opacity = t < 0.1 ? t / 0.1 : t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;

  // Gentle floating depth
  const depthZ = -80 + t * 160;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-100 z-30"
      style={{
        opacity,
      }}
    >
      <div
        className="w-[90vw] max-w-5xl flex flex-col items-center text-center preserve-3d will-change-transform"
        style={{
          transform: `translate3d(0, 0, ${depthZ}px)`,
        }}
      >
        {/* Category Tag */}
        <div className="flex items-center space-x-3 mb-6">
          <span className="w-8 h-[1px] bg-cyan-400" />
          <span className="font-mono text-xs text-cyan-400 uppercase tracking-[0.35em]">
            THE PERSON BEHIND THE TIMELINE
          </span>
          <span className="w-8 h-[1px] bg-cyan-400" />
        </div>

        {/* Headline */}
        <h2 className="font-syne text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase tracking-tight max-w-4xl text-glow-white leading-tight">
          &quot;{content.about.headline}&quot;
        </h2>

        {/* Narrative Statement */}
        <div className="mt-8 max-w-3xl space-y-4 text-slate-300 font-sans text-sm sm:text-base md:text-lg leading-relaxed pointer-events-auto">
          {content.about.bio.map((paragraph, idx) => (
            <p key={idx} className="opacity-90">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mt-10 w-full max-w-3xl pt-8 border-t border-white/10 pointer-events-auto">
          {content.about.stats.map((st, i) => (
            <div key={i} className="flex flex-col items-center p-3.5 rounded-xl bg-slate-950/70 border border-white/5 shadow-xl">
              <span className="font-mono text-2xl sm:text-3xl font-bold text-cyan-400">
                {st.value}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400 mt-1">
                {st.label}
              </span>
            </div>
          ))}
        </div>

        {/* Toolkit Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8 pointer-events-auto">
          {content.about.software.map((sw, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-slate-300"
            >
              {sw}
            </span>
          ))}
        </div>
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">SHOT {scene.code}</span>
        <span className="text-slate-600">//</span>
        <span>{scene.name}</span>
      </div>
    </div>
  );
};
