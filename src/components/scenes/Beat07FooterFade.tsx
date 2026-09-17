import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS } from '../../config/timeline';

export const Beat07FooterFade: React.FC = () => {
  const { progress, content, handleDeveloperClick, developerClicks } = usePortfolio();
  const beat = PINNED_BEATS.footerFade;

  // Beat 07 range: 1800/2000 (0.900) to 1.00
  const globalStart = 1800 / 2000;
  const globalEnd = 1.00;

  const isVisible = progress >= globalStart - 0.02;
  if (!isVisible) return null;

  // Local progress (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, (progress - globalStart) / (globalEnd - globalStart)));

  // CHOREOGRAPHY:
  // Phase 1 (0.00 - 0.40): Editor turns head back toward monitor
  // Phase 2 (0.40 - 0.75): Backlighting fades, editor dissolves into deep silhouette
  // Phase 3 (0.75 - 1.00): Bottom darkens into true black seamlessly becoming the footer

  const turnBackDegree = Math.max(0, 25 - t * 50);
  const silhouetteDarken = Math.min(1, t * 1.5);
  const footerReveal = Math.min(1, Math.max(0, (t - 0.35) / 0.5));

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none transition-opacity duration-150 z-30"
      style={{ opacity: 1 }}
    >
      {/* Top / Center Visual: Editor as Silhouette facing the glowing monitor */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center preserve-3d">
        {/* Glow from monitor fading into deep shadow */}
        <div
          className="relative w-[75vw] sm:w-[580px] h-64 sm:h-80 rounded-2xl bg-black border border-white/10 shadow-[0_0_80px_rgba(56,189,248,0.15)] p-3 flex flex-col justify-between overflow-hidden transition-opacity duration-300"
          style={{
            opacity: Math.max(0.2, 1 - t * 0.7),
          }}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-b border-white/5 pb-1">
            <span>SESSION_ARCHIVED</span>
            <span>00:02:12:00</span>
          </div>

          <div className="relative flex-1 my-2 rounded bg-slate-950/80 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-cyan-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-cyan-400/50" />
            </div>
          </div>
        </div>

        {/* Editor Silhouette in foreground (facing forward back to monitor) */}
        <div
          className="relative -mt-16 flex flex-col items-center will-change-transform transition-all duration-200"
          style={{
            transform: `rotateY(${turnBackDegree}deg)`,
            filter: `brightness(${1 - silhouetteDarken * 0.8})`,
          }}
        >
          <div className="w-14 h-18 rounded-full bg-black border border-white/5 mb-1" />
          <div className="w-56 sm:w-68 h-32 bg-black rounded-t-full border-t border-white/5 shadow-2xl" />
        </div>
      </div>

      {/* ================= SEAMLESS CINEMATIC FOOTER ================= */}
      {/* Emerges at the bottom as the screen darkens into the finale */}
      <div
        className="w-full bg-gradient-to-t from-black via-black/95 to-transparent pt-12 pb-6 px-6 sm:px-12 flex flex-col items-center space-y-4 pointer-events-auto transition-all duration-300"
        style={{
          opacity: footerReveal,
          transform: `translateY(${(1 - footerReveal) * 20}px)`,
        }}
      >
        <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-slate-400 gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold tracking-wider">{content.studioName}</span>
            <span className="text-slate-600">//</span>
            <span>{content.tagline}</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px] text-slate-500">
            <a href={content.contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              INSTAGRAM
            </a>
            <a href={content.contact.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              X / TWITTER
            </a>
            <a href={content.contact.vimeo} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              VIMEO
            </a>

            {/* Hidden Developer Trigger (Click 5 times) */}
            <button
              onClick={handleDeveloperClick}
              className="text-slate-600 hover:text-slate-400 transition-colors cursor-pointer select-none"
              title={developerClicks > 0 ? `${5 - developerClicks} clicks to admin` : 'Developer'}
            >
              Developer
              {developerClicks > 0 && <span className="ml-1 text-cyan-400">({developerClicks}/5)</span>}
            </button>
          </div>
        </div>

        <div className="text-[10px] font-mono text-slate-600 flex items-center space-x-3">
          <span>© {new Date().getFullYear()} {content.studioName}. ALL RIGHTS RESERVED.</span>
          <span className="text-slate-700">//</span>
          <span>BEAT {beat.code} // {beat.name}</span>
        </div>
      </div>
    </div>
  );
};
