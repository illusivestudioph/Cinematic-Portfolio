import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS } from '../../config/timeline';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';

export const Beat02BreakFrame: React.FC = () => {
  const { progress, content } = usePortfolio();
  const beat = PINNED_BEATS.breakFrame;

  // Beat 02 range: 250/2000 (0.125) to 550/2000 (0.275)
  const globalStart = 250 / 2000;
  const globalEnd = 550 / 2000;

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity
  const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  // ANIMATION CHOREOGRAPHY:
  // Phase 1 (0.00 - 0.25): Blink, head micro-adjustment, breaking the illusion of stillness
  // Phase 2 (0.25 - 0.60): Breaks rigid pose, hands shift, chair rolls/adjusts
  // Phase 3 (0.60 - 1.00): Sits directly into the edit desk, leaning into keyboard & color grading wheels

  let chairY = 0;
  let chairRotate = 0;
  let bodyLeanZ = 0;
  let cameraDollyZ = t * 350;

  if (t < 0.25) {
    const p = t / 0.25;
    chairY = -p * 8;
  } else if (t < 0.60) {
    const p = (t - 0.25) / 0.35;
    chairY = -8 + p * 20;
    chairRotate = -p * 6;
  } else {
    const p = (t - 0.60) / 0.40;
    chairY = 12 - p * 12;
    chairRotate = -6 + p * 6;
    bodyLeanZ = p * 40;
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100 z-20"
      style={{ opacity }}
    >
      <div
        className="relative w-[94vw] max-w-6xl h-[80vh] flex items-center justify-center preserve-3d will-change-transform"
        style={{
          transform: `translate3d(0, 0, ${cameraDollyZ}px)`,
        }}
      >
        {content.editorSequence.baseUrl ? (
          <div className="w-[85vw] max-w-5xl h-[70vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <ScrollFrameSequence
              baseUrl={content.editorSequence.baseUrl}
              frameCount={content.editorSequence.frameCount}
              fallback={content.editorSequence.fallback}
              progress={t}
              alt="Breaking The Frame"
            />
          </div>
        ) : (
          /* ================= PROCEDURAL CHOREOGRAPHY SET ================= */
          <div className="relative w-full h-full flex flex-col items-center justify-center preserve-3d">
            {/* Monitor glow expanding */}
            <div className="relative w-[80vw] sm:w-[620px] h-72 sm:h-88 rounded-2xl bg-black border-2 border-cyan-500/40 shadow-[0_0_80px_rgba(56,189,248,0.3)] p-3.5 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-1.5">
                <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  BAY_A // SESSION_INIT
                </span>
                <span className="text-amber-400 font-bold">00:00:18:04</span>
              </div>

              <div className="relative flex-1 my-2 rounded bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src={content.editorSequence.fallback}
                  alt="Editor Monitor View"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              <div className="h-5 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-white/10 pt-1">
                <span>PROJECT: MASTER_SHOWREEL_TIMELINE</span>
                <span className="text-cyan-400">READY</span>
              </div>
            </div>

            {/* Editor Breaking Pose at Desk */}
            <div
              className="mt-6 flex flex-col items-center preserve-3d will-change-transform"
              style={{
                transform: `translate3d(0, ${chairY}px, ${bodyLeanZ}px) rotateZ(${chairRotate}deg)`,
              }}
            >
              {/* Keyboard & Trackballs */}
              <div className="w-96 sm:w-[500px] h-10 rounded-lg bg-slate-950 border border-white/10 shadow-lg flex items-center justify-between px-6">
                <div className="flex space-x-1">
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className="w-4 h-3 rounded-xs bg-slate-800/80 border border-white/5" />
                  ))}
                </div>
                <div className="flex space-x-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/50 shadow-[0_0_8px_#38bdf8]" />
                  <div className="w-5 h-5 rounded-full bg-slate-900 border border-white/20" />
                  <div className="w-5 h-5 rounded-full bg-purple-950 border border-purple-400/50 shadow-[0_0_8px_#c084fc]" />
                </div>
              </div>

              {/* Moving Shoulders / Chair Back */}
              <div className="w-56 sm:w-64 h-28 bg-gradient-to-t from-black via-[#090b10] to-slate-900/80 rounded-t-full border-t border-white/10 shadow-2xl -mt-2" />
            </div>
          </div>
        )}
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span>{beat.name} (PULL CHAIR & SIT)</span>
      </div>
    </div>
  );
};
