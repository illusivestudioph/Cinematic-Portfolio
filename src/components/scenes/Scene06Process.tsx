import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_SCENES } from '../../config/timeline';
import { Layers, Sliders, Volume2, Sparkles, Film, CheckCircle2 } from 'lucide-react';

export const Scene06Process: React.FC = () => {
  const { progress, content } = usePortfolio();
  const scene = PINNED_SCENES.process;

  // Scene 06 range: 1300/1950 (0.667) to 1550/1950 (0.795)
  const globalStart = 1300 / 1950;
  const globalEnd = 1550 / 1950;

  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity
  const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  // Automatically sync active milestone stage with camera travel unless user clicked a tab
  const autoIndex = Math.min(
    content.processStages.length - 1,
    Math.floor(t * content.processStages.length)
  );
  const currentStage = selectedStageId 
    ? content.processStages.find(s => s.id === selectedStageId) || content.processStages[autoIndex]
    : content.processStages[autoIndex];

  // Camera translation along the process corridor in the studio world
  const corridorX = -t * 260;

  const getStageIcon = (id: string) => {
    switch (id) {
      case 'raw': return <Film className="w-4 h-4 text-cyan-400" />;
      case 'edit': return <Layers className="w-4 h-4 text-sky-400" />;
      case 'motion': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'sound': return <Volume2 className="w-4 h-4 text-emerald-400" />;
      case 'color': return <Sliders className="w-4 h-4 text-amber-400" />;
      case 'final': return <CheckCircle2 className="w-4 h-4 text-rose-400" />;
      default: return <Film className="w-4 h-4 text-cyan-400" />;
    }
  };

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
          transform: `translate3d(${corridorX}px, 0, 0)`,
        }}
      >
        {/* Header HUD */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-3 bg-black/85 border border-white/10 rounded-xl backdrop-blur-md pointer-events-auto shadow-2xl gap-2">
          <div>
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              POST-PRODUCTION ANATOMY // 6 SPATIAL MILESTONES
            </span>
            <h2 className="font-syne text-xl font-bold text-white uppercase tracking-wide">
              BEHIND THE EDIT
            </h2>
          </div>

          {/* 6 Stages Navigation Bar */}
          <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {content.processStages.map((stage) => {
              const isActive = currentStage.id === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs tracking-wider transition-all duration-200 flex items-center space-x-1.5 border whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/20'
                  }`}
                >
                  {getStageIcon(stage.id)}
                  <span>{stage.step} {stage.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Central Interactive Process Chamber */}
        <div className="relative flex-1 my-4 flex flex-col lg:flex-row items-center gap-8 preserve-3d">
          {/* Visual Interactive Chamber (Left) */}
          <div className="w-full lg:w-3/5 h-full rounded-2xl bg-slate-950/90 border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl relative pointer-events-auto">
            <div className="flex justify-between items-center text-xs font-mono border-b border-white/10 pb-3">
              <span className="text-cyan-400 font-bold flex items-center gap-2">
                {getStageIcon(currentStage.id)}
                STAGE {currentStage.step} // {currentStage.title}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
                BENCHMARK: {currentStage.visualMetric}
              </span>
            </div>

            {/* Simulated Stage Visual Workspace */}
            <div className="relative flex-1 my-4 rounded-xl bg-black/80 border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              <div className="absolute inset-0 bg-radial from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 crt-scanlines opacity-20 pointer-events-none" />

              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                {getStageIcon(currentStage.id)}
              </div>

              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest">
                {currentStage.tagline}
              </span>
              <p className="mt-3 text-sm font-sans text-slate-300 max-w-lg leading-relaxed">
                {currentStage.description}
              </p>
            </div>

            {/* Deliverables Stems */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono">
              <span className="text-slate-400 uppercase">Deliverables:</span>
              <div className="flex flex-wrap gap-2">
                {currentStage.deliverables.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300 text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Corridor Pipeline Station Progression */}
          <div className="w-full lg:w-2/5 flex flex-col space-y-2.5 pointer-events-auto">
            {content.processStages.map((st) => {
              const isSelected = st.id === currentStage.id;
              return (
                <div
                  key={st.id}
                  onClick={() => setSelectedStageId(st.id)}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400/60 shadow-[0_0_20px_rgba(56,189,248,0.15)] translate-x-1'
                      : 'bg-slate-950/60 border-white/5 hover:border-white/15 opacity-60 hover:opacity-90'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-cyan-400">{st.step}</span>
                    <div>
                      <div className="font-syne text-xs font-bold text-white uppercase">{st.title}</div>
                      <div className="font-mono text-[10px] text-slate-400">{st.visualMetric}</div>
                    </div>
                  </div>
                  {getStageIcon(st.id)}
                </div>
              );
            })}
          </div>
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
