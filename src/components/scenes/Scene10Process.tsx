import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';
import { Layers, Sliders, Volume2, Sparkles, Film, CheckCircle2 } from 'lucide-react';


export const Scene10Process: React.FC = () => {
  const { progress, content } = usePortfolio();
  const { start, end } = SCENES.process;

  const [activeStageId, setActiveStageId] = useState<string>('raw');

  const isVisible = progress >= start - 0.03 && progress <= end + 0.03;
  if (!isVisible) return null;

  // Local progress (0.90 to 0.96)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Opacity
  const opacity = t < 0.1 ? t / 0.1 : t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;

  // Automatically sync active stage with scroll progress unless user clicked a tab
  const stageIndex = Math.min(
    content.processStages.length - 1,
    Math.floor(t * content.processStages.length)
  );
  const currentStage = content.processStages.find(s => s.id === activeStageId) || content.processStages[stageIndex];

  // Camera translation along the process corridor
  const corridorX = -t * 300;

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
                  onClick={() => setActiveStageId(stage.id)}
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

        {/* The Central Interactive Process Chamber */}
        <div className="relative flex-1 my-4 flex flex-col lg:flex-row items-center gap-8 preserve-3d">
          {/* Visual Interactive Chamber (Left) */}
          <div className="w-full lg:w-3/5 h-full rounded-2xl bg-slate-950/90 border border-white/10 p-6 flex flex-col justify-between overflow-hidden shadow-2xl relative pointer-events-auto">
            <div className="flex justify-between items-center text-xs font-mono border-b border-white/10 pb-3">
              <span className="text-cyan-400 font-bold flex items-center gap-2">
                {getStageIcon(currentStage.id)}
                STAGE {currentStage.step} // {currentStage.title}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40 text-cyan-300">
                {currentStage.visualMetric}
              </span>
            </div>

            {/* Stage Visual Simulation */}
            <div className="relative flex-1 my-4 rounded-xl bg-black border border-white/10 overflow-hidden flex flex-col items-center justify-center p-4">
              {/* Dynamic visual per stage */}
              {currentStage.id === 'raw' && (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="grid grid-cols-3 gap-3 w-full h-44">
                    {[1, 2, 3].map((cam) => (
                      <div key={cam} className="rounded bg-slate-900 border border-white/10 p-2 flex flex-col justify-between">
                        <span className="text-[10px] font-mono text-cyan-400">CAM {cam} // SONY FX6</span>
                        <div className="text-[9px] font-mono text-slate-500">SYNC LOCKED 00:04:18:00</div>
                      </div>
                    ))}
                  </div>
                  <div className="font-mono text-xs text-slate-400 tracking-wider">
                    INGESTING MULTI-CAM TIMECODE STRINGOUTS
                  </div>
                </div>
              )}

              {currentStage.id === 'edit' && (
                <div className="w-full h-full flex flex-col justify-center items-center space-y-3">
                  <div className="w-full h-10 bg-cyan-950/60 border border-cyan-400/50 rounded flex items-center px-4 justify-between font-mono text-xs text-cyan-200">
                    <span>CUT #084: HERO REACTION</span>
                    <span className="text-amber-400">-3 FRAMES TRIMMED</span>
                  </div>
                  <div className="w-full h-10 bg-sky-950/60 border border-sky-400/50 rounded flex items-center px-4 justify-between font-mono text-xs text-sky-200">
                    <span>CUT #085: IMPACT ACTION</span>
                    <span className="text-cyan-300">MATCH CUT LOCKED</span>
                  </div>
                  <div className="w-full h-10 bg-cyan-950/60 border border-cyan-400/50 rounded flex items-center px-4 justify-between font-mono text-xs text-cyan-200">
                    <span>CUT #086: ANAMORPHIC WIDE</span>
                    <span className="text-purple-300">SPEED RAMP 180%</span>
                  </div>
                </div>
              )}

              {currentStage.id === 'color' && (
                <div className="w-full h-full relative rounded overflow-hidden flex">
                  {/* Split Screen Log vs Graded */}
                  <div className="w-1/2 h-full bg-slate-800 flex items-center justify-center relative overflow-hidden border-r-2 border-cyan-400">
                    <img
                      src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80"
                      alt="Log preview"
                      className="w-full h-full object-cover grayscale opacity-70"
                    />
                    <span className="absolute bottom-3 left-3 text-[10px] font-mono bg-black/80 px-2 py-1 rounded text-slate-300">
                      BEFORE: FLAT LOG
                    </span>
                  </div>
                  <div className="w-1/2 h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80"
                      alt="Grade preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-purple-600/30 mix-blend-color-dodge" />
                    <span className="absolute bottom-3 right-3 text-[10px] font-mono bg-black/80 px-2 py-1 rounded text-cyan-300">
                      AFTER: ACES 2383 PRINT
                    </span>
                  </div>
                </div>
              )}

              {(currentStage.id === 'motion' || currentStage.id === 'sound' || currentStage.id === 'final') && (
                <div className="w-full h-full flex flex-col justify-center items-center p-6 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full border-2 border-cyan-400/60 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                    {getStageIcon(currentStage.id)}
                  </div>
                  <p className="font-syne text-lg font-bold text-white uppercase">
                    {currentStage.tagline}
                  </p>
                  <span className="font-mono text-xs text-cyan-300">
                    SURGICAL RIGOR AT 24.000 FPS
                  </span>
                </div>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              PHILOSOPHY: &quot;{currentStage.tagline}&quot;
            </div>
          </div>

          {/* Detailed Deliverables & Execution Specs (Right) */}
          <div className="w-full lg:w-2/5 h-full rounded-2xl bg-slate-950/90 border border-white/10 p-6 flex flex-col justify-between shadow-2xl pointer-events-auto space-y-4">
            <div>
              <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
                METHODOLOGY & EXECUTION
              </span>
              <h3 className="font-syne text-2xl font-black text-white mt-1 uppercase">
                {currentStage.title}
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed font-sans">
                {currentStage.description}
              </p>
            </div>

            {/* Deliverables Checklist */}
            <div className="space-y-2.5">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                STAGE DELIVERABLES & VERIFICATIONS
              </span>
              {currentStage.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-2.5 rounded-lg bg-black/60 border border-white/5"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs font-mono text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-mono text-slate-400">
              <span>ACTIVE ENVIRONMENT</span>
              <span className="text-cyan-400">STAGE {currentStage.step} / 06</span>
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2 pointer-events-none">
          <span>SPATIAL WORKFLOW STATION</span>
          <span className="text-cyan-400">SCROLL TO MEET THE EDITOR</span>
        </div>
      </div>

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">SHOT 10</span>
        <span className="text-slate-600">//</span>
        <span>BEHIND THE EDIT: PIPELINE</span>
      </div>
    </div>
  );
};
