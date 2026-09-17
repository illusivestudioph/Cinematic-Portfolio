import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';
import { Mail, ArrowUpRight, Check } from 'lucide-react';

export const Scene12CTA: React.FC = () => {
  const { progress, content } = usePortfolio();
  const { start, end } = SCENES.contact;

  const [isCopied, setIsCopied] = useState(false);


  const isVisible = progress >= start - 0.01;
  if (!isVisible) return null;

  // Local progress (0.98 to 1.00)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Sequential text reveal timing:
  // Phase 1 (t: 0.0 to 0.25): "GOT FOOTAGE?" reveals
  // Phase 2 (t: 0.25 to 0.55): "LET'S MAKE SOMETHING OUT OF IT." reveals
  // Phase 3 (t: 0.55 to 0.85): "START A PROJECT" button and contact links active
  // Phase 4 (t: 0.85 to 1.00): Camera continues movement, fades out completely into TRUE BLACK!
  
  let contentOpacity = 1;
  if (t > 0.85) {
    // Fade into pure black at the very end
    contentOpacity = Math.max(0, (1 - t) / 0.15);
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
            opacity: t >= 0.25 ? 1 : Math.max(0, (t - 0.1) / 0.15),
            transform: `translateY(${t >= 0.25 ? 0 : 20}px)`,
          }}
        >
          {content.contact.subheadline}
        </p>

        {/* Step 3: START A PROJECT & Action Links */}
        <div
          className="mt-10 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto transition-all duration-300"
          style={{
            opacity: t >= 0.45 ? 1 : Math.max(0, (t - 0.3) / 0.15),
            transform: `translateY(${t >= 0.45 ? 0 : 30}px)`,
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
            opacity: t >= 0.5 ? 1 : 0,
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{content.contact.availability}</span>
        </div>

        {/* Social Links */}
        <div
          className="flex items-center space-x-6 mt-8 font-mono text-xs text-slate-400 pointer-events-auto"
          style={{
            opacity: t >= 0.55 ? 1 : 0,
          }}
        >
          <a href={content.contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            INSTAGRAM
          </a>
          <span>/</span>
          <a href={content.contact.vimeo} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            VIMEO
          </a>
          <span>/</span>
          <a href={content.contact.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            X (TWITTER)
          </a>
        </div>
      </div>

      {/* Cinematic Final Blackout Overlay (at t > 0.90, fades into pure black) */}
      <div 
        className="fixed inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{
          opacity: t > 0.88 ? (t - 0.88) / 0.12 : 0,
        }}
      />

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs pointer-events-none">
        <span className="text-cyan-400 font-bold">SHOT 12</span>
        <span className="text-slate-600">//</span>
        <span>FINAL CTA & FADE TO BLACK</span>
      </div>
    </div>
  );
};
