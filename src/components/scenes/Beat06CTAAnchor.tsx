import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS } from '../../config/timeline';
import { Mail, ArrowUpRight, Check, Send } from 'lucide-react';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';

export const Beat06CTAAnchor: React.FC = () => {
  const { progress, content } = usePortfolio();
  const beat = PINNED_BEATS.ctaAnchor;

  // Beat 06 range: 1500/2000 (0.750) to 1800/2000 (0.900)
  const globalStart = 1500 / 2000;
  const globalEnd = 1800 / 2000;

  const [isCopied, setIsCopied] = useState(false);

  const isVisible = progress >= globalStart - 0.03 && progress <= globalEnd + 0.03;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // Opacity
  const opacity = t < 0.1 ? t / 0.1 : t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  // CHOREOGRAPHY PROGRESSION:
  // Phase 1 (0.00 - 0.35): Camera pulls back smoothly to the original desk composition
  // Phase 2 (0.35 - 0.60): Editor hits "EXPORT" (rendering 100% complete)
  // Phase 3 (0.60 - 1.00): Editor looks directly at camera; CTA appears in LEFT negative space

  const ctaLeftOpacity = Math.min(1, Math.max(0, (t - 0.35) / 0.25));
  const isExportComplete = t >= 0.40;

  const copyEmail = () => {
    navigator.clipboard.writeText(content.contact.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100 z-20"
      style={{ opacity }}
    >
      {/* Reconstructed Original Composition: LEFT Negative Space + RIGHT Editor Desk */}
      <div className="relative w-full h-full flex items-center justify-between px-6 sm:px-12 md:px-20 lg:px-28">
        {/* LEFT NEGATIVE SPACE: The CTA Destination */}
        <div
          className="relative z-30 flex flex-col items-start max-w-xl text-left pointer-events-auto select-none transition-all duration-300"
          style={{
            opacity: ctaLeftOpacity,
            transform: `translateY(${ctaLeftOpacity >= 1 ? 0 : (1 - ctaLeftOpacity) * 25}px)`,
          }}
        >
          {/* Step 1: Headline */}
          <span className="font-syne text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight leading-none">
            {content.contact.headline}
          </span>

          {/* Step 2: Subheadline */}
          <p className="mt-4 sm:mt-6 font-syne text-xl sm:text-3xl md:text-4xl font-bold text-cyan-400 uppercase tracking-wide text-glow-cyan">
            {content.contact.subheadline}
          </p>

          {/* Step 3: START A PROJECT & Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href={`mailto:${content.contact.email}?subject=Project%20Inquiry%20—%20ILLUSIVE%20STUDIO`}
              className="w-full sm:w-auto group px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-syne font-black text-xs sm:text-sm tracking-widest uppercase flex items-center justify-center space-x-2.5 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.7)] hover:scale-105 transition-all duration-300"
            >
              <span>{content.contact.ctaButtonText}</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <button
              onClick={copyEmail}
              className="w-full sm:w-auto px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 font-mono text-xs tracking-wider flex items-center justify-center space-x-2 transition-all duration-200"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4 text-cyan-400" />}
              <span>{isCopied ? 'COPIED' : content.contact.email}</span>
            </button>
          </div>

          {/* Availability */}
          <div className="mt-6 flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{content.contact.availability}</span>
          </div>
        </div>

        {/* RIGHT SIDE: The Editor at Desk (Presses Export, Turns & Looks at Camera) */}
        <div className="relative w-full lg:w-1/2 h-[75vh] flex flex-col items-end justify-center pointer-events-auto">
          {(() => {
            const seqConfig = content.sequences?.beat06CTAAnchor || content.editorSequence;
            return seqConfig.baseUrl ? (
              <div className="w-full max-w-xl h-[70vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <ScrollFrameSequence
                  baseUrl={seqConfig.baseUrl}
                  frameCount={seqConfig.frameCount}
                  padding={seqConfig.padding}
                  fallback={seqConfig.fallback}
                  progress={t}
                  alt="Editor Export and Direct Look Sequence"
                />
              </div>
            ) : (
              <div className="relative w-full max-w-xl h-[68vh] rounded-2xl bg-black border border-cyan-500/40 shadow-[0_0_80px_rgba(56,189,248,0.2)] p-4 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-2">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-cyan-400" />
                    DELIVERY QUEUE // EXPORT
                  </span>
                  <span className={isExportComplete ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {isExportComplete ? 'STATUS: 100% COMPLETE' : 'RENDERING MASTER...'}
                  </span>
                </div>

                <div className="relative flex-1 my-2 rounded-xl bg-slate-950 overflow-hidden flex flex-col items-center justify-center p-4">
                  <img
                    src={seqConfig.fallback}
                    alt="Delivery Suite View"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  {/* Export Complete Graphic */}
                  <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-950/90 border border-emerald-400/80 flex items-center justify-center shadow-[0_0_25px_#34d399] mb-2.5">
                      <Check className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      ProRes 4444 XQ Master Exported
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-1">
                      Ready for Client Distribution
                    </div>
                    <div className="w-full bg-white/15 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="w-full h-full bg-emerald-400 rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="h-4 flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-white/10 pt-1.5">
                  <span>BAY_A // WORKSTATION CLEAR</span>
                  <span className="text-cyan-400 font-bold">READY</span>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-600">//</span>
        <span>{beat.name} (LOOK INTO CAMERA & CTA)</span>
      </div>
    </div>
  );
};
