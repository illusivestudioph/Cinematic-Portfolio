import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';

export const Scene02Editor: React.FC = () => {
  const { progress, content } = usePortfolio();
  const { start, end } = SCENES.editor;

  // Active range extends slightly into next scene for smooth crossfade
  const isVisible = progress >= start - 0.02 && progress <= end + 0.05;
  if (!isVisible) return null;

  // Normalized local progress (0.05 to 0.15)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Reveal gradually as camera dollies in
  const opacity = t < 0.2 ? t / 0.2 : t > 0.85 ? Math.max(0, (1 - t) / 0.15) : 1;

  // Dolly scale and translation
  const dollyScale = 1.0 + t * 0.25;
  const dollyZ = -200 + t * 400; // Moving toward the camera

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-150"
      style={{
        opacity,
        transform: `translate3d(0, 0, ${dollyZ}px) scale(${dollyScale})`,
      }}
    >
      {/* If WebP sequence is configured */}
      {content.editorSequence.baseUrl ? (
        <div className="w-[85vw] max-w-5xl h-[70vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <ScrollFrameSequence
            baseUrl={content.editorSequence.baseUrl}
            frameCount={content.editorSequence.frameCount}
            fallback={content.editorSequence.fallback}
            progress={t}
            alt="The Editor at Work"
          />
        </div>
      ) : (
        /* Cinematic Procedural Studio Edit Suite Set */
        <div className="relative w-[90vw] max-w-6xl h-[75vh] flex items-center justify-center preserve-3d">
          {/* Ambient Room Lighting: Blue/Cyan wall wash + warm tungsten desk lamps */}
          <div className="absolute inset-0 bg-radial from-cyan-950/30 via-slate-950/80 to-transparent rounded-3xl" />
          <div className="absolute top-12 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Acoustic Wall Diffusers (Background layer at depth z = -150) */}
          <div 
            className="absolute inset-x-8 top-8 h-48 border-b border-white/5 flex items-center justify-between px-12 opacity-30 preserve-3d"
            style={{ transform: 'translateZ(-150px)' }}
          >
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-1.5 h-32 bg-gradient-to-b from-slate-700/50 to-slate-900/50 rounded-sm" />
            ))}
          </div>

          {/* Edit Suite Desk & Gear Layer */}
          <div className="relative z-10 flex flex-col items-center preserve-3d">
            {/* Dual Studio Grading Monitors */}
            <div className="flex items-center space-x-6 preserve-3d">
              {/* Secondary Reference Display */}
              <div 
                className="hidden md:block w-72 h-44 rounded-lg bg-black/90 border border-white/10 p-2 shadow-2xl preserve-3d"
                style={{ transform: 'rotateY(12deg) translateZ(-40px)' }}
              >
                <div className="w-full h-full rounded bg-slate-900/80 overflow-hidden flex flex-col justify-between p-2">
                  <div className="flex justify-between items-center text-[9px] font-mono text-cyan-400">
                    <span>VECTORSCOPE</span>
                    <span>ACEScct</span>
                  </div>
                  {/* Circular vectorscope graphic */}
                  <div className="w-24 h-24 rounded-full border border-cyan-500/30 mx-auto flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-dashed border-cyan-400/40 animate-spin-slow" />
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">10-BIT SDI SIGNAL LOCK</div>
                </div>
              </div>

              {/* Main Primary Grading Monitor */}
              <div 
                className="w-[80vw] sm:w-[540px] md:w-[620px] h-72 sm:h-88 rounded-xl bg-black border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(56,189,248,0.2)] p-3 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Glow from monitor screen */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

                {/* Top status bar */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-1.5">
                  <span className="text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ILLUSIVE_EDIT_BAY_A
                  </span>
                  <span>4K DCI 24FPS</span>
                  <span className="text-amber-400">SMPTE 00:00:12:08</span>
                </div>

                {/* Central Monitor Footage Preview */}
                <div className="relative flex-1 my-2 rounded bg-slate-950/90 overflow-hidden border border-white/10 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1280&q=80"
                    alt="Monitor View"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                  <div className="absolute top-3 left-3 text-[10px] font-mono text-white/70 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                    SCENE 02 // SEQUENCE_ASSEMBLE
                  </div>
                </div>

                {/* Bottom audio / mini timeline bar */}
                <div className="h-6 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-white/10 pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400">CH 1-2</span>
                    <div className="flex space-x-0.5">
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-2.5 rounded-xs ${
                            i < 8 ? 'bg-cyan-500' : i < 10 ? 'bg-amber-400' : 'bg-red-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span>PLAYHEAD 00:00:12:08</span>
                </div>
              </div>

              {/* Audio Studio Monitor Speaker (Right) */}
              <div 
                className="hidden lg:flex w-24 h-48 rounded-lg bg-slate-900 border border-white/10 flex-col items-center justify-around py-4 shadow-2xl preserve-3d"
                style={{ transform: 'rotateY(-15deg) translateZ(-30px)' }}
              >
                <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-black" />
                <div className="w-16 h-16 rounded-full border-2 border-cyan-500/40 bg-black/90 shadow-[0_0_15px_rgba(56,189,248,0.2)]" />
              </div>
            </div>

            {/* Silhouette of the Editor seated at desk in foreground */}
            <div 
              className="mt-6 flex flex-col items-center preserve-3d"
              style={{ transform: 'translateZ(60px)' }}
            >
              {/* Keyboard with RGB Backlight & Color Grading Console */}
              <div className="w-96 sm:w-[480px] h-10 rounded bg-slate-950 border border-white/10 shadow-lg flex items-center justify-between px-6">
                <div className="flex space-x-1">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="w-4 h-3 rounded-xs bg-slate-800/80 border border-white/5" />
                  ))}
                </div>
                {/* 3 Color grading trackballs */}
                <div className="flex space-x-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/50 shadow-[0_0_8px_#38bdf8]" />
                  <div className="w-5 h-5 rounded-full bg-slate-900 border border-white/20" />
                  <div className="w-5 h-5 rounded-full bg-purple-950 border border-purple-400/50 shadow-[0_0_8px_#c084fc]" />
                </div>
              </div>

              {/* Editor Back / Shoulders Silhouette */}
              <div className="w-48 sm:w-60 h-28 bg-gradient-to-t from-black via-[#08090d] to-slate-900/60 rounded-t-full border-t border-white/10 -mt-2 shadow-2xl" />
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">SHOT 02</span>
        <span className="text-slate-600">//</span>
        <span>THE EDIT SUITE</span>
      </div>
    </div>
  );
};
