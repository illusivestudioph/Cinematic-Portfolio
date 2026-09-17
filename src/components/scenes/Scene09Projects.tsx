import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';
import { CinematicVideoPlayer } from '../media/CinematicVideoPlayer';
import { Sparkles, ChevronRight } from 'lucide-react';


export const Scene09Projects: React.FC = () => {
  const { progress, content } = usePortfolio();
  const { start, end } = SCENES.projects;

  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  const isVisible = progress >= start - 0.03 && progress <= end + 0.03;
  if (!isVisible) return null;

  // Local progress (0.80 to 0.90)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Opacity
  const opacity = t < 0.1 ? t / 0.1 : t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;

  // Spatial corridor navigation:
  // t: 0.0 to 0.5 -> focused on primary destination CRIMEXBT (approaches, becomes dominant)
  // t: 0.5 to 1.0 -> camera dollies laterally to secondary project destinations
  const currentProject = content.projects[activeProjectIdx] || content.projects[0];

  // Camera approach to CRIMEXBT:
  const scale = t < 0.5 ? 0.9 + (t / 0.5) * 0.2 : 1.1 - ((t - 0.5) / 0.5) * 0.05;
  const lateralX = t < 0.4 ? 0 : -(t - 0.4) * 200;

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
          transform: `translate3d(${lateralX}px, 0, 0) scale(${scale})`,
        }}
      >
        {/* Destination Switcher / Corridor Waypoint HUD */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/80 border border-white/10 rounded-xl backdrop-blur-md pointer-events-auto shadow-2xl">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
              PROJECT DESTINATION // 0{activeProjectIdx + 1} OF 0{content.projects.length}
            </span>
          </div>

          {/* Destination Tabs (Spatial Stations) */}
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
          {/* Main Video Screen */}
          <div className="w-full lg:w-2/3 h-full flex flex-col justify-center pointer-events-auto">
            <CinematicVideoPlayer
              key={currentProject.id}
              videoUrl={currentProject.videoUrl}
              posterUrl={currentProject.thumbnailUrl}
              title={currentProject.title}
              subtitle={`${currentProject.category} // ${currentProject.year}`}
              aspectRatio="16/9"
              isActive={progress >= start && progress <= end}
              className="w-full h-full border-cyan-500/40 shadow-[0_0_50px_rgba(56,189,248,0.25)]"
            />
          </div>

          {/* Project Editorial Dossier / Spatial Meta Sidebar */}
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

              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentProject.description}
              </p>
            </div>

            {/* Editorial Metrics */}
            {currentProject.metrics && (
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/10">
                {currentProject.metrics.map((m, i) => (
                  <div key={i} className="text-center p-2 rounded bg-black/50 border border-white/5">
                    <div className="font-mono text-[10px] text-slate-400 uppercase">{m.label}</div>
                    <div className="font-mono text-xs font-bold text-cyan-300 mt-0.5">{m.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tools Used */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentProject.tools.map((tool, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2 pointer-events-none">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CLICK PLAY TO RUN FULL AUDIO & EDITORIAL TIMELINE</span>
          </div>
          <span className="text-cyan-400">SCROLL TO TRAVEL TO EDITING PROCESS</span>
        </div>
      </div>

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">SHOT 09</span>
        <span className="text-slate-600">//</span>
        <span>SELECTED WORK DESTINATIONS</span>
      </div>
    </div>
  );
};
