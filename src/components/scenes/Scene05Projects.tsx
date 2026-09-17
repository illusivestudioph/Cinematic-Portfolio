import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_SCENES } from '../../config/timeline';
import { CinematicVideoPlayer } from '../media/CinematicVideoPlayer';
import { ChevronRight } from 'lucide-react';

export const Scene05Projects: React.FC = () => {
  const { progress, content } = usePortfolio();
  const scene = PINNED_SCENES.projects;

  // Scene 05 range: 1000/1950 (0.513) to 1300/1950 (0.667)
  const globalStart = 1000 / 1950;
  const globalEnd = 1300 / 1950;

  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity
  const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  // SPATIAL TRAVEL TO CRIMEXBT DESTINATION:
  // Phase 1 (0.0 to 0.45): Camera travels laterally through studio and approaches CRIMEXBT monitor
  // Phase 2 (0.45 to 0.85): CRIMEXBT monitor expands to dominant view (interactive video & editorial dossier)
  // Phase 3 (0.85 to 1.00): Camera gently floats and prepares handoff to Process chamber
  const currentProject = content.projects[activeProjectIdx] || content.projects[0];

  const scale = t < 0.5 ? 0.88 + (t / 0.5) * 0.22 : 1.10 - ((t - 0.5) / 0.5) * 0.05;
  const lateralX = t < 0.4 ? (t / 0.4) * -120 : -120;
  const depthZ = t < 0.5 ? (t / 0.5) * 300 : 300;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-100 z-30"
      style={{
        opacity,
      }}
    >
      <div
        className="w-[94vw] max-w-6xl h-[82vh] flex flex-col justify-between preserve-3d will-change-transform"
        style={{
          transform: `translate3d(${lateralX}px, 0, ${depthZ}px) scale(${scale})`,
        }}
      >
        {/* Destination Waypoint Selector / Studio HUD */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/85 border border-white/10 rounded-xl backdrop-blur-md pointer-events-auto shadow-2xl">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
              PROJECT DESTINATION // 0{activeProjectIdx + 1} OF 0{content.projects.length}
            </span>
          </div>

          {/* Spatial Station Buttons */}
          <div className="flex items-center space-x-2">
            {content.projects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => setActiveProjectIdx(idx)}
                className={`px-3 py-1 rounded-lg font-mono text-xs tracking-wider transition-all duration-200 flex items-center space-x-1.5 border ${
                  activeProjectIdx === idx
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                    : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
                }`}
              >
                <span>{proj.title}</span>
                {activeProjectIdx === idx && <ChevronRight className="w-3 h-3 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* The Dominant Destination Screen */}
        <div className="relative flex-1 my-3 flex flex-col lg:flex-row items-center gap-6 preserve-3d">
          {/* Main Video Monitor */}
          <div className="w-full lg:w-2/3 h-full flex flex-col justify-center pointer-events-auto">
            <CinematicVideoPlayer
              key={currentProject.id}
              videoUrl={currentProject.videoUrl}
              posterUrl={currentProject.thumbnailUrl}
              title={currentProject.title}
              subtitle={`${currentProject.category} // ${currentProject.year}`}
              aspectRatio="16/9"
              isActive={progress >= globalStart && progress <= globalEnd}
              className="w-full h-full border-cyan-500/40 shadow-[0_0_60px_rgba(56,189,248,0.25)]"
            />
          </div>

          {/* Project Editorial Dossier */}
          <div className="w-full lg:w-1/3 flex flex-col justify-between p-5 rounded-xl bg-slate-950/90 border border-white/10 backdrop-blur-md pointer-events-auto shadow-2xl space-y-4">
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-white/10 pb-2 mb-3">
                <span className="text-cyan-400 uppercase font-bold">{currentProject.client}</span>
                <span>{currentProject.year}</span>
              </div>

              <h2 className="font-syne text-2xl font-black text-white tracking-wide uppercase">
                {currentProject.title}
              </h2>
              <p className="text-xs font-mono text-cyan-300/80 mt-1">
                {currentProject.role}
              </p>

              <p className="text-xs font-sans text-slate-300 mt-3 leading-relaxed">
                {currentProject.description}
              </p>
            </div>

            {/* Metrics Chips */}
            {currentProject.metrics && (
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
                {currentProject.metrics.map((m, i) => (
                  <div key={i} className="p-2 rounded bg-black/60 border border-white/5 flex flex-col">
                    <span className="text-[10px] font-mono text-slate-400">{m.label}</span>
                    <span className="text-xs font-mono font-bold text-cyan-300 mt-0.5">{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Toolkit Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {currentProject.tools.map((tool, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-slate-400"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">SHOT {scene.code}</span>
        <span className="text-slate-600">//</span>
        <span>{scene.name} (CRIMEXBT & SELECTS)</span>
      </div>
    </div>
  );
};
