import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_SCENES } from '../../config/timeline';
import { Mail, ArrowUpRight, Check } from 'lucide-react';

export const Scene08CTA: React.FC = () => {
  const { progress, content } = usePortfolio();
  const scene = PINNED_SCENES.cta;

  // Scene 08 range: 1750/1950 (0.897) to 1.00
  const globalStart = 1750 / 1950;
  const globalEnd = 1.00;

  const [isCopied, setIsCopied] = useState(false);

  const isVisible = progress >= globalStart - 0.02;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // CTA REVEAL PROGRESSION:
  // Phase 1 (0.00 to 0.25): "GOT FOOTAGE?" reveals prominently
  // Phase 2 (0.25 to 0.50): "LET'S MAKE SOMETHING OUT OF IT." reveals
  // Phase 3 (0.50 to 0.80): "START A PROJECT" action button and email copy
  // Phase 4 (0.80 to 1.00): Camera moves into deep space and fades completely into TRUE BLACK!
  // "BLACK IS THE END, NOT THE INTRO."

  let contentOpacity = 1;
  let blackOverlayOpacity = 0;

  if (t < 0.1) {
    contentOpacity = t / 0.1;
  } else if (t > 0.80) {
    // Camera travels forward into infinity, fading out into black
    contentOpacity = Math.max(0, (1 - t) / 0.20);
    blackOverlayOpacity = Math.min(1, (t - 0.80) / 0.18);
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(content.contact.email);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-100 z-30"
      style={{
        opacity: contentOpacity,
      }}
    >
      <div className="w-[92vw] max-w-4xl flex flex-col items-center text-center preserve-3d">
        {/* Step 1: GOT FOOTAGE? */}
        <span
          className="font-syne text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-tight transition-all duration-300"
          style={{
            opacity: t >= 0.05 ? 1 : t / 0.05,
            transform: `scale(${t >= 0.05 ? 1 : 0.95})`,
          }}
        >
          {content.contact.headline}
        </span>

        {/* Step 2: LET'S MAKE SOMETHING OUT OF IT. */}
        <p
          className="mt-4 sm:mt-6 font-syne text-xl sm:text-3xl md:text-4xl font-bold text-cyan-400 uppercase tracking-wide text-glow-cyan transition-all duration-300"
          style={{
            opacity: t >= 0.22 ? 1 : Math.max(0, (t - 0.08) / 0.14),
            transform: `translateY(${t >= 0.22 ? 0 : 20}px)`,
          }}
        >
          {content.contact.subheadline}
        </p>

        {/* Step 3: START A PROJECT & Action Links */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto transition-all duration-300"
          style={{
            opacity: t >= 0.40 ? 1 : Math.max(0, (t - 0.25) / 0.15),
            transform: `translateY(${t >= 0.40 ? 0 : 30}px)`,
          }}
        >
          <a
            href={`mailto:${content.contact.email}?subject=Project%20Inquiry%20—%20ILLUSIVE%20STUDIO`}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-syne font-black text-sm tracking-widest uppercase flex items-center space-x-3 shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_50px_rgba(56,189,248,0.7)] hover:scale-105 transition-all duration-300"
          >
            <span>{content.contact.ctaButtonText}</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <button
            onClick={copyEmail}
            className="px-6 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 font-mono text-xs tracking-wider flex items-center space-x-2 transition-all duration-200"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4 text-cyan-400" />}
            <span>{isCopied ? 'EMAIL COPIED' : content.contact.email}</span>
          </button>
        </div>

        {/* Availability Badge */}
        <div
          className="mt-8 flex items-center space-x-2 text-xs font-mono text-slate-400 pointer-events-auto"
          style={{
            opacity: t >= 0.45 ? 1 : 0,
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{content.contact.availability}</span>
        </div>

        {/* Social Stems */}
        <div
          className="mt-12 flex items-center space-x-6 text-xs font-mono text-slate-500 pointer-events-auto"
          style={{
            opacity: t >= 0.55 ? 1 : 0,
          }}
        >
          <a
            href={content.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors uppercase tracking-widest"
          >
            Instagram
          </a>
          <span className="text-slate-800">/</span>
          <a
            href={content.contact.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors uppercase tracking-widest"
          >
            Twitter
          </a>
          <span className="text-slate-800">/</span>
          <a
            href={content.contact.vimeo}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors uppercase tracking-widest"
          >
            Vimeo
          </a>
        </div>
      </div>

      {/* ================= TRUE BLACK FINALE ================= */}
      {/* 
        "BLACK IS THE END, NOT THE INTRO."
        At the conclusion of the entire portfolio reel (t > 0.80), the screen fades to true black.
      */}
      <div
        className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-200"
        style={{
          opacity: blackOverlayOpacity,
          visibility: blackOverlayOpacity > 0.01 ? 'visible' : 'hidden',
        }}
      />

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">SHOT {scene.code}</span>
        <span className="text-slate-600">//</span>
        <span>{scene.name}</span>
      </div>
    </div>
  );
};
