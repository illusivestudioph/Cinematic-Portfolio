import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS } from '../../config/timeline';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';

export const Beat01StaticIllusion: React.FC = () => {
  const { progress, content } = usePortfolio();
  const beat = PINNED_BEATS.staticIllusion;

  // Beat 01: 0 to 250/2000 (0.125)
  const globalEnd = 250 / 2000;
  const isVisible = progress <= globalEnd + 0.04;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, progress / globalEnd));

  // Studio ident title overlay:
  // Starts at full prominence in the LEFT negative space, fades out smoothly as user scrolls
  const titleOpacity = Math.max(0, 1 - t / 0.45);
  const beatOpacity = t > 0.9 ? Math.max(0, (1 - t) / 0.1) : 1;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-100 z-20"
      style={{ opacity: beatOpacity }}
    >
      {/* Fullscreen Composition: Clean Negative Space on LEFT, Editor on RIGHT */}
      <div className="relative w-full h-full flex items-center justify-between px-6 sm:px-12 md:px-20 lg:px-28">
        {/* LEFT NEGATIVE SPACE: Website Typography Overlay */}
        <div
          className="relative z-30 flex flex-col items-start max-w-xl text-left pointer-events-auto select-none transition-all duration-150"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${t * 30}px)`,
          }}
        >
          {/* Film Production Tag */}
          <div className="flex items-center space-x-3 mb-4 opacity-85">
            <span className="h-[2px] w-6 bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            <span className="font-mono text-xs tracking-[0.35em] text-cyan-400 uppercase font-bold">
              ILLUSIVE STUDIO // REEL
            </span>
          </div>

          {/* Grand Studio Typography */}
          <h1 className="font-syne text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase text-glow-white leading-none">
            {content.studioName}
          </h1>

          <p className="mt-4 sm:mt-6 font-mono text-xs sm:text-sm md:text-base tracking-[0.35em] text-slate-400 uppercase leading-relaxed max-w-md">
            {content.tagline}
          </p>

          <div className="w-48 sm:w-72 h-[1px] bg-gradient-to-r from-cyan-400/90 via-cyan-400/40 to-transparent mt-6 shadow-[0_0_15px_#38bdf8]" />

          {/* Scroll Prompt */}
          <div className="mt-10 flex items-center space-x-3 opacity-75">
            <div className="w-4 h-7 rounded-full border border-slate-500 flex justify-center p-1">
              <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.3em] text-slate-400 uppercase">
              SCROLL TO BREAK FRAME
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: The Static Editor Portrait */}
        {/* Completely still pose, atmospheric studio lighting */}
        <div className="relative w-full lg:w-1/2 h-[75vh] flex items-center justify-end">
          {content.editorSequence.baseUrl ? (
            <div className="w-full max-w-xl h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <ScrollFrameSequence
                baseUrl={content.editorSequence.baseUrl}
                frameCount={content.editorSequence.frameCount}
                fallback={content.editorSequence.fallback}
                progress={0} // completely still in Beat 1
                alt="Static Editor Portrait"
              />
            </div>
          ) : (
            <div className="relative w-full max-w-xl h-full flex flex-col items-center justify-center">
              {/* Soft studio backlighting */}
              <div className="absolute inset-0 bg-radial from-cyan-950/20 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
              
              {/* Grading Monitor Glow & Desktop Silhouette */}
              <div className="relative w-[85%] h-[60%] rounded-2xl bg-black border-2 border-cyan-500/30 shadow-[0_0_80px_rgba(56,189,248,0.25)] p-3 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-1.5">
                  <span className="text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    STANDBY // 24FPS
                  </span>
                  <span>DAVINCI RESOLVE</span>
                </div>

                <div className="relative flex-1 my-2 rounded bg-slate-950 overflow-hidden flex items-center justify-center">
                  <img
                    src={content.editorSequence.fallback}
                    alt="Edit suite setup"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
              </div>

              {/* Seated Editor in foreground (Still Portrait) */}
              <div className="relative -mt-12 flex flex-col items-center">
                <div className="w-52 sm:w-64 h-32 bg-gradient-to-t from-black via-[#08090d] to-slate-900/80 rounded-t-full border-t border-white/10 shadow-2xl" />
                <div className="w-72 sm:w-80 h-3 bg-slate-950 border-t border-white/10" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span>{beat.name}</span>
      </div>
    </div>
  );
};
