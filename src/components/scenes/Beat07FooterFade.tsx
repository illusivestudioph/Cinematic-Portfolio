import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS } from '../../config/timeline';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';

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

  const silhouetteDarken = Math.min(1, t * 1.5);
  const footerReveal = Math.min(1, Math.max(0, (t - 0.35) / 0.5));

  const seqConfig = content.sequences?.beat07FooterFade || content.editorSequence;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between pointer-events-none transition-opacity duration-150 z-30"
      style={{ opacity: 1 }}
    >
      {/* Top / Center Visual: Editor as Silhouette facing the monitor in deep shadow */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center">
        {seqConfig.baseUrl ? (
          <div className="w-[85vw] max-w-4xl h-[60vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <ScrollFrameSequence
              baseUrl={seqConfig.baseUrl}
              frameCount={seqConfig.frameCount}
              padding={seqConfig.padding}
              fallback={seqConfig.fallback}
              progress={t}
              alt="Editor Silhouette Sequence"
            />
          </div>
        ) : (
          <div
            className="relative w-[85vw] max-w-3xl h-[55vh] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_90px_rgba(0,0,0,0.9)] flex items-center justify-center transition-all duration-300"
            style={{
              filter: `brightness(${Math.max(0.15, 1 - silhouetteDarken * 0.85)})`,
            }}
          >
            <img
              src={seqConfig.fallback}
              alt="Editor in Deep Silhouette"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            
            <div className="absolute top-4 left-4 font-mono text-[10px] text-slate-500 bg-black/80 px-3 py-1 rounded border border-white/5 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60" />
              <span>SESSION_ARCHIVED // 00:02:12:00</span>
            </div>
          </div>
        )}
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
