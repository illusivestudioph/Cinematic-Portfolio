import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { PINNED_SCENES } from '../../config/timeline';
import { ScrollFrameSequence } from '../media/ScrollFrameSequence';

export const Scene01Editor: React.FC = () => {
  const { progress, content } = usePortfolio();
  const scene = PINNED_SCENES.editor;

  // Scene 01 is active from start (0.0) up to its global threshold + small crossfade buffer
  const globalEnd = 250 / 1950; // 0.128
  const isVisible = progress <= globalEnd + 0.04;
  if (!isVisible) return null;

  // Local progress inside Scene 01 (0.0 to 1.0)
  const t = Math.max(0, Math.min(1, progress / globalEnd));

  // TITLE IDENT OVERLAY OPACITY:
  // Starts at 100% opacity on page load. Fades out smoothly as the user begins scrolling (0.0 to 0.18).
  const titleOpacity = Math.max(0, 1 - t / 0.18);

  // EDITOR MOVEMENT CHOREOGRAPHY:
  // Phase 1 (0.00 - 0.15): Seated, looking at monitor.
  // Phase 2 (0.15 - 0.45): Editor stretches arm upward; camera follows arm.
  // Phase 3 (0.45 - 0.65): Arm comes down; camera follows downward toward desk.
  // Phase 4 (0.65 - 0.82): Camera redirects toward primary grading monitor.
  // Phase 5 (0.82 - 1.00): Camera accelerates rapidly into monitor screen.

  let armTranslateY = 0;
  let armRotate = 0;
  let cameraFollowY = 0;
  let monitorScale = 1.0;
  let pushZ = 0;

  if (t < 0.15) {
    // Initial seated pose
    armTranslateY = 0;
    armRotate = 0;
    cameraFollowY = 0;
    monitorScale = 1.0;
    pushZ = t * 100;
  } else if (t < 0.45) {
    // Stretch upward: arm raises, camera follows upward
    const p = (t - 0.15) / 0.30;
    armTranslateY = -p * 70;
    armRotate = -p * 28;
    cameraFollowY = -p * 35; // camera looks up with the stretch
    monitorScale = 1.0 + p * 0.15;
    pushZ = 100 + p * 150;
  } else if (t < 0.65) {
    // Arm lowers back down: camera follows down to desk
    const p = (t - 0.45) / 0.20;
    armTranslateY = -70 + p * 70;
    armRotate = -28 + p * 28;
    cameraFollowY = -35 + p * 45; // camera follows down toward desk level
    monitorScale = 1.15 + p * 0.15;
    pushZ = 250 + p * 200;
  } else if (t < 0.82) {
    // Redirect toward monitor
    const p = (t - 0.65) / 0.17;
    cameraFollowY = 10 - p * 10;
    monitorScale = 1.3 + p * 0.35;
    pushZ = 450 + p * 300;
  } else {
    // Rapid acceleration directly toward monitor glass
    const p = (t - 0.82) / 0.18;
    const accel = Math.pow(p, 2.2);
    cameraFollowY = 0;
    monitorScale = 1.65 + accel * 3.5; // monitor expands to fill screen
    pushZ = 750 + accel * 1200;
  }

  // Crossfade out at very end into Scene 02 (The Editing Environment)
  const sceneOpacity = t > 0.92 ? Math.max(0, (1 - t) / 0.08) : 1;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100"
      style={{
        opacity: sceneOpacity,
      }}
    >
      {/* 3D Moving Camera Stage for Scene 01 */}
      <div
        className="relative w-[92vw] max-w-6xl h-[80vh] flex items-center justify-center preserve-3d will-change-transform"
        style={{
          transform: `translate3d(0, ${cameraFollowY}px, ${pushZ}px)`,
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
              alt="The Editor at Desk"
            />
          </div>
        ) : (
          /* ================= CINEMATIC EDIT SUITE SET ================= */
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {/* Ambient Lighting & Atmosphere */}
            <div className="absolute inset-0 bg-radial from-cyan-950/30 via-[#050608]/90 to-transparent rounded-3xl pointer-events-none" />
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Acoustic Diffusers on Back Wall (Depth Z = -200) */}
            <div
              className="absolute inset-x-4 top-4 h-48 border-b border-white/5 flex items-center justify-between px-8 sm:px-16 opacity-35 preserve-3d pointer-events-none"
              style={{ transform: 'translateZ(-200px)' }}
            >
              {[...Array(18)].map((_, i) => (
                <div key={i} className="w-1.5 h-32 bg-gradient-to-b from-slate-700/60 to-slate-900/60 rounded-xs" />
              ))}
            </div>

            {/* Desktop & Monitors Rig */}
            <div className="relative z-10 flex flex-col items-center preserve-3d">
              {/* Displays Array */}
              <div className="flex items-center space-x-6 preserve-3d">
                {/* Secondary Vectorscope Reference Display (Left) */}
                <div
                  className="hidden md:block w-72 h-44 rounded-lg bg-black/90 border border-white/10 p-2 shadow-2xl preserve-3d transition-transform duration-100"
                  style={{
                    transform: `rotateY(14deg) translateZ(-60px) scale(${1 - t * 0.3})`,
                    opacity: Math.max(0, 1 - t * 1.5),
                  }}
                >
                  <div className="w-full h-full rounded bg-slate-900/90 overflow-hidden flex flex-col justify-between p-2">
                    <div className="flex justify-between items-center text-[9px] font-mono text-cyan-400">
                      <span>VECTORSCOPE</span>
                      <span>ACEScct</span>
                    </div>
                    <div className="w-24 h-24 rounded-full border border-cyan-500/30 mx-auto flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-dashed border-cyan-400/50 animate-spin-slow" />
                    </div>
                    <div className="text-[9px] font-mono text-slate-500">10-BIT SDI SIGNAL LOCK</div>
                  </div>
                </div>

                {/* Primary Grading Monitor (The Central Portal) */}
                <div
                  className="w-[84vw] sm:w-[580px] md:w-[660px] h-76 sm:h-92 rounded-2xl bg-black border-2 border-cyan-500/40 shadow-[0_0_80px_rgba(56,189,248,0.3)] p-3.5 flex flex-col justify-between relative overflow-hidden preserve-3d will-change-transform"
                  style={{
                    transform: `scale(${monitorScale})`,
                  }}
                >
                  {/* Monitor Screen Glass Glare & CRT scanlines */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/10 via-transparent to-purple-500/10 pointer-events-none" />
                  <div className="absolute inset-0 crt-scanlines opacity-25 pointer-events-none" />

                  {/* Monitor Status Header */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/10 pb-1.5">
                    <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      ILLUSIVE_BAY_A // 4K DCI
                    </span>
                    <span className="text-amber-400 font-bold">
                      SMPTE 00:00:0{Math.min(9, Math.floor(t * 10))}:12
                    </span>
                  </div>

                  {/* Monitor Footage Content Preview */}
                  <div className="relative flex-1 my-2 rounded-lg bg-slate-950/90 overflow-hidden border border-white/15 flex items-center justify-center">
                    <img
                      src={content.editorSequence.fallback}
                      alt="Monitor View"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    
                    {/* Reticle / Track overlay that activates as camera accelerates */}
                    <div
                      className="absolute inset-0 border border-cyan-400/30 flex items-center justify-center transition-opacity duration-300"
                      style={{ opacity: t > 0.6 ? 1 : 0.3 }}
                    >
                      <div className="w-24 h-24 rounded-full border border-dashed border-cyan-400/60 flex items-center justify-center animate-spin-slow">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom Timeline Preview Track */}
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
                    <span>READY FOR INGEST</span>
                  </div>
                </div>

                {/* Studio Monitor Speaker (Right) */}
                <div
                  className="hidden lg:flex w-24 h-48 rounded-lg bg-slate-900 border border-white/10 flex-col items-center justify-around py-4 shadow-2xl preserve-3d"
                  style={{
                    transform: `rotateY(-14deg) translateZ(-60px) scale(${1 - t * 0.3})`,
                    opacity: Math.max(0, 1 - t * 1.5),
                  }}
                >
                  <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-black" />
                  <div className="w-16 h-16 rounded-full border-2 border-cyan-500/40 bg-black/90 shadow-[0_0_15px_rgba(56,189,248,0.2)]" />
                </div>
              </div>

              {/* Foreground: Desk, Keyboard & Seated Editor Silhouette */}
              <div
                className="mt-6 flex flex-col items-center preserve-3d will-change-transform"
                style={{
                  transform: `translateZ(60px) translateY(${armTranslateY * 0.5}px)`,
                  opacity: Math.max(0, 1 - t * 1.3),
                }}
              >
                {/* Grading Console & Backlit Editing Keyboard */}
                <div className="w-96 sm:w-[500px] h-10 rounded-lg bg-slate-950 border border-white/10 shadow-lg flex items-center justify-between px-6">
                  <div className="flex space-x-1">
                    {[...Array(18)].map((_, i) => (
                      <div key={i} className="w-4 h-3 rounded-xs bg-slate-800/80 border border-white/5" />
                    ))}
                  </div>
                  {/* Color grading trackballs */}
                  <div className="flex space-x-3">
                    <div className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-400/50 shadow-[0_0_8px_#38bdf8]" />
                    <div className="w-5 h-5 rounded-full bg-slate-900 border border-white/20" />
                    <div className="w-5 h-5 rounded-full bg-purple-950 border border-purple-400/50 shadow-[0_0_8px_#c084fc]" />
                  </div>
                </div>

                {/* Editor Shoulders & Stretch Arm Silhouette */}
                <div className="relative w-48 sm:w-64 flex justify-center -mt-2">
                  {/* Torso/Shoulders */}
                  <div className="w-48 sm:w-60 h-28 bg-gradient-to-t from-black via-[#08090d] to-slate-900/70 rounded-t-full border-t border-white/10 shadow-2xl" />

                  {/* Stretching Arm Graphic */}
                  <div
                    className="absolute right-4 bottom-12 w-6 h-28 bg-gradient-to-t from-slate-900 to-slate-800 rounded-full border border-white/15 origin-bottom will-change-transform shadow-xl"
                    style={{
                      transform: `translateY(${armTranslateY}px) rotate(${armRotate}deg)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= WEBSITE TITLE OVERLAY (ILLUSIVE STUDIO) ================= */}
      {/* 
        Belongs strictly to the website UI, NOT rendered into footage.
        Prominently overlays the editor seated at desk on first arrival.
        Fades out cleanly as the user begins scrolling.
      */}
      <div
        className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-30 transition-opacity duration-150"
        style={{
          opacity: titleOpacity,
          visibility: titleOpacity <= 0.01 ? 'hidden' : 'visible',
        }}
      >
        <div className="flex flex-col items-center text-center px-6">
          {/* Film slate tag */}
          <div className="flex items-center space-x-3 mb-4 opacity-80">
            <span className="h-[1px] w-8 bg-cyan-400" />
            <span className="font-mono text-[11px] sm:text-xs tracking-[0.35em] text-cyan-400 uppercase">
              CINEMATIC PORTFOLIO REEL
            </span>
            <span className="h-[1px] w-8 bg-cyan-400" />
          </div>

          {/* Grand Studio Title */}
          <h1 className="font-syne text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase select-none text-glow-white">
            {content.studioName}
          </h1>

          <p className="mt-3 sm:mt-5 font-mono text-xs sm:text-sm md:text-base tracking-[0.4em] text-slate-400 uppercase">
            {content.tagline}
          </p>

          <div className="w-64 sm:w-96 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent mt-6 shadow-[0_0_15px_#38bdf8]" />

          {/* Scroll instruction indicator */}
          <div className="mt-12 flex flex-col items-center opacity-70 animate-pulse">
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-400 uppercase mb-2">
              SCROLL TO CONTROL CAMERA
            </span>
            <div className="w-4 h-7 rounded-full border border-slate-500/70 flex justify-center p-1">
              <div className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Shot Badge */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">SHOT {scene.code}</span>
        <span className="text-slate-600">//</span>
        <span>{scene.name}</span>
      </div>
    </div>
  );
};
