import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_BEATS, getSceneWindow, isSceneVisible } from '../../config/timeline';
import { CinematicBackdrop } from '../media/CinematicBackdrop';

/**
 * BEAT 07 — FOOTER FADE
 *
 * The CTA moment continues. The editor turns back toward the monitor; the
 * monitor illuminates the scene one last time, then the editor gradually
 * becomes a silhouette as the lower part of the scene progressively darkens —
 * the darkness blending naturally into the footer, the final destination of
 * the entire cinematic journey.
 *
 *   Editor -> turns to monitor -> silhouette -> scene darkens -> footer
 */
export const Beat07FooterFade: React.FC = () => {
  const { progress, content, handleDeveloperClick, developerClicks } = usePortfolio();
  const beat = PINNED_BEATS.footerFade;

  if (!isSceneVisible(beat.id, progress, 0.02)) return null;

  const { localT: t } = getSceneWindow(beat.id, progress);

  // CHOREOGRAPHY:
  // Phase 1 (0.00-0.35): the editor turns back toward the monitor
  // Phase 2 (0.30-0.70): monitor glow illuminates the scene, then the editor
  //                      dissolves into a silhouette as light withdraws
  // Phase 3 (0.55-1.00): the lower scene darkens progressively into the footer
  const turnBackMix = Math.min(1, t / 0.3); // editor turns away from camera
  const silhouette = Math.min(1, Math.max(0, (t - 0.25) / 0.45)); // 0 lit -> 1 silhouette
  const monitorGlow = Math.sin((1 - t) * Math.PI) * 0.55; // rises, then withdraws
  const lowerDarkness = Math.min(1, Math.max(0, (t - 0.45) / 0.5));
  const footerReveal = Math.min(1, Math.max(0, (t - 0.4) / 0.45));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      {/* ============ THE SCENE — TURNING BACK TO THE MONITOR ============ */}
      <div className="absolute inset-0">
        {/* Back at the desk; the look-at-camera frame dissolves back to the suite.
            The editor gradually becomes a silhouette as the light withdraws. */}
        <CinematicBackdrop
          src={content.editorSequence.fallback}
          alt="The editor turning back toward the monitor"
          mode="anchored"
          scale={1 + turnBackMix * 0.03}
          filter={`brightness(${1 - silhouette * 0.88}) contrast(${1 + silhouette * 0.25}) saturate(${1 - silhouette * 0.55})`}
        />

        {/* The monitor illuminates the scene — a cyan pool of light that
            lingers on the editor, then withdraws with the darkening */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: monitorGlow,
            background:
              'radial-gradient(ellipse 42% 55% at 68% 44%, rgba(56,189,248,0.32), rgba(56,189,248,0.08) 55%, transparent 75%)',
          }}
        />

        {/* The scene progressively darkens — from the bottom up */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to top, rgba(5,6,8,1) 0%, rgba(5,6,8,${0.72 + lowerDarkness * 0.28}) ${18 + lowerDarkness * 30}%, rgba(5,6,8,${0.15 + lowerDarkness * 0.55}) ${45 + lowerDarkness * 25}%, transparent 85%)`,
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none bg-[#050608]"
          style={{ opacity: Math.pow(lowerDarkness, 1.6) * 0.55 }}
        />
      </div>

      {/* Session archived — the last flicker of the workstation */}
      <div
        className="absolute top-[18%] left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 font-mono text-[10px] tracking-[0.25em] uppercase"
        style={{ opacity: Math.max(0, 1 - t * 2.2) }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
        <span className="text-slate-400">Session archived — 00:02:12:00</span>
      </div>

      {/* ============ SEAMLESS CINEMATIC FOOTER ============ */}
      {/* Emerges from the darkness at the bottom — the final destination */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050608] via-[#050608]/92 to-transparent pt-14 pb-6 px-6 sm:px-12 flex flex-col items-center space-y-4 pointer-events-auto transition-all duration-300"
        style={{
          opacity: footerReveal,
          transform: `translateY(${(1 - footerReveal) * 24}px)`,
        }}
      >
        <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-slate-400 gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold tracking-wider">{content.studioName}</span>
            <span className="text-slate-600">//</span>
            <span>{content.tagline}</span>
          </div>

          <div className="flex items-center space-x-6 text-[11px] text-slate-500">
            <a
              href={content.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              INSTAGRAM
            </a>
            <a
              href={content.contact.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              X / TWITTER
            </a>
            <a
              href={content.contact.vimeo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              VIMEO
            </a>

            {/* Hidden developer trigger (5 clicks opens the admin gate) */}
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
          <span>END OF REEL — BEAT {beat.code} // {beat.name}</span>
        </div>
      </div>

      {/* Cinematic shot badge */}
      <div
        className="absolute bottom-6 left-8 sm:left-12 flex items-center space-x-3 text-slate-500 font-mono text-xs transition-opacity duration-300"
        style={{ opacity: 1 - footerReveal }}
      >
        <span className="text-cyan-400/80 font-bold">BEAT {beat.code}</span>
        <span className="text-slate-700">//</span>
        <span>{beat.name}</span>
      </div>
    </div>
  );
};
