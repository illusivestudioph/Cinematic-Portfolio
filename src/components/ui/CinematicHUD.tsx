import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENE_LIST, interpolateCamera } from '../../config/timeline';
import { Volume2, VolumeX, Disc3, Camera } from 'lucide-react';

export const CinematicHUD: React.FC = () => {
  const {
    progress,
    activeScene,
    isMuted,
    setIsMuted,
    handleDeveloperClick,
    developerClicks,
  } = usePortfolio();


  // Fade in HUD gently as user starts interacting, subduing it slightly while initial studio title is prominent
  const isIntroTitle = progress < 0.02;

  // Calculate master SMPTE timecode (normalized across ~2:12 duration)
  const totalSeconds = progress * 132; // 2 minutes 12 seconds = 132 seconds
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  const frames = Math.floor((totalSeconds % 1) * 24);
  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedTimecode = `00:${pad(mins)}:${pad(secs)}:${pad(frames)}`;

  const camera = interpolateCamera(progress);

  return (
    <header className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-4 sm:p-6 transition-opacity duration-300">
      {/* Top Bar HUD */}
      <div 
        className={`flex items-center justify-between transition-opacity duration-500 ${
          isIntroTitle ? 'opacity-40 hover:opacity-100' : 'opacity-100'
        }`}
      >
        {/* Active Shot & Chapter */}
        <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-auto shadow-lg">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
          <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider">
            BEAT {activeScene.code}
          </span>
          <span className="text-slate-600 font-mono text-xs">//</span>
          <span className="font-mono text-xs text-slate-300 tracking-wider uppercase hidden sm:inline">
            {activeScene.name}
          </span>
        </div>

        {/* Master Timeline Timecode & Camera Telemetry & Audio Toggle */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          {/* Live 3D Camera Telemetry Badge */}
          <div className="hidden lg:flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg font-mono text-[11px] text-slate-400 select-none">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-cyan-300 font-bold tracking-wider">CAM RIG</span>
            <span className="text-slate-600">//</span>
            <span>Z: <span className="text-slate-200">{camera.z >= 0 ? `+${Math.round(camera.z)}` : Math.round(camera.z)}</span></span>
            <span className="text-slate-600">//</span>
            <span>YAW: <span className="text-slate-200">{camera.rotateY.toFixed(1)}°</span></span>
            <span className="text-slate-600">//</span>
            <span>PITCH: <span className="text-slate-200">{camera.rotateX.toFixed(1)}°</span></span>
          </div>

          {/* Timecode Badge */}
          <div className="hidden md:flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            <Disc3 className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="font-mono text-xs text-slate-300 tracking-widest">
              TC <span className="text-cyan-400 font-bold">{formattedTimecode}</span>
              <span className="text-slate-600 mx-1.5">/</span>
              <span className="text-slate-500">00:02:12:00</span>
            </span>
          </div>

          {/* Quick Audio Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all duration-200 shadow-lg"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span className="font-mono text-[11px] tracking-wider uppercase hidden sm:inline">
              {isMuted ? 'MUTED' : 'AUDIO ON'}
            </span>
          </button>
        </div>
      </div>

      {/* Right Edge: Subtle Chapter Index Dots */}
      <div 
        className={`fixed right-4 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center space-y-2 pointer-events-auto transition-opacity duration-500 ${
          isIntroTitle ? 'opacity-30' : 'opacity-60 hover:opacity-100'
        }`}
      >
        {SCENE_LIST.map((scene) => {
          const isCurrent = activeScene.id === scene.id;
          return (
            <div
              key={scene.id}
              className={`group relative flex items-center justify-end cursor-pointer`}
              title={`${scene.code} - ${scene.name}`}
            >
              <span className="absolute right-6 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-cyan-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {scene.code} {scene.name}
              </span>
              <div
                className={`w-1.5 transition-all duration-300 rounded-full ${
                  isCurrent ? 'h-6 bg-cyan-400 shadow-[0_0_10px_#38bdf8]' : 'h-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Bar */}
      <div 
        className={`flex items-center justify-between text-xs font-mono text-slate-500 transition-opacity duration-500 ${
          isIntroTitle || progress > 0.90 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Progress Bar & Percentage */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="w-24 sm:w-36 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-75"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {Math.round(progress * 100)}% REEL
          </span>
        </div>

        {/* Hidden Developer Trigger in footer (Click 5 times) */}
        <div className="pointer-events-auto">
          <button
            onClick={handleDeveloperClick}
            className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors tracking-widest px-2 py-1 rounded cursor-pointer select-none"
            title={developerClicks > 0 ? `${5 - developerClicks} clicks to admin` : 'Developer'}
          >
            Developer
            {developerClicks > 0 && (
              <span className="ml-1 text-cyan-400">({developerClicks}/5)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
