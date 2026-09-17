import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENE_LIST } from '../../config/timeline';
import { Volume2, VolumeX } from 'lucide-react';

export const CinematicHUD: React.FC = () => {
  const {
    progress,
    activeScene,
    isMuted,
    setIsMuted,
    handleDeveloperClick,
    developerClicks,
  } = usePortfolio();

  const isIntroTitle = progress < 0.02;

  return (
    <header className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-4 sm:p-6 transition-opacity duration-300">
      {/* Top Bar HUD */}
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between w-full">
        {/* Studio Brand Ident */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-xl hover:border-[#5EB423] transition-all"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#5EB423] shadow-[0_0_10px_#5EB423]" />
            <span className="font-bricolage font-extrabold text-sm tracking-wider text-white uppercase">
              ILLUSIVE STUDIO
            </span>
            <span className="hidden sm:inline font-mono text-[10px] text-zinc-400 border-l border-white/20 pl-2">
              POST-PRODUCTION
            </span>
          </a>
        </div>

        {/* Studio Navigation & Audio Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3 pointer-events-auto">
          <nav className="hidden md:flex items-center gap-1 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 shadow-xl text-xs font-bricolage font-bold uppercase tracking-wider text-zinc-300">
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' })}
              className="px-3 py-1 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Services
            </button>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 5.0, behavior: 'smooth' })}
              className="px-3 py-1 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Showreel
            </button>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 9.0, behavior: 'smooth' })}
              className="px-3 py-1 rounded-full hover:text-white hover:bg-white/10 transition-colors"
            >
              Workflow
            </button>
            <button
              onClick={() => window.scrollTo({ top: window.innerHeight * 15.0, behavior: 'smooth' })}
              className="px-3 py-1 rounded-full text-[#7FFF68] hover:bg-[#5EB423]/20 transition-colors"
            >
              Contact
            </button>
          </nav>

          {/* Quick Audio Mute Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center space-x-2 bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/15 hover:border-[#5EB423] text-zinc-300 hover:text-[#7FFF68] transition-all shadow-xl font-bricolage font-bold text-xs"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-zinc-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#7FFF68]" />}
            <span className="hidden sm:inline uppercase tracking-wider text-[11px]">
              {isMuted ? 'SOUND OFF' : 'SOUND ON'}
            </span>
          </button>

          {/* Mad Dogs Circular Menu / Drawer Button */}
          <button
            onClick={() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' })}
            className="w-9 h-9 rounded-full bg-black/80 backdrop-blur-md border border-white/20 hover:border-[#7FFF68] flex flex-col items-center justify-center gap-1 transition-all shadow-xl cursor-pointer"
            title="Menu"
          >
            <span className="w-4 h-[1.5px] bg-white rounded-full" />
            <span className="w-4 h-[1.5px] bg-[#7FFF68] rounded-full" />
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
              <span className="absolute right-6 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-[#7FFF68] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {scene.code} {scene.name}
              </span>
              <div
                className={`w-1.5 transition-all duration-300 rounded-full ${
                  isCurrent ? 'h-6 bg-[#7FFF68] shadow-[0_0_10px_#7FFF68]' : 'h-1.5 bg-zinc-700 hover:bg-zinc-500'
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
              className="h-full bg-gradient-to-r from-[#5EB423] to-[#7FFF68] rounded-full transition-all duration-75 shadow-[0_0_10px_#7FFF68]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">
            {Math.round(progress * 100)}% REEL
          </span>
        </div>

        {/* Hidden Developer Trigger in footer (Click 5 times) */}
        <div className="pointer-events-auto">
          <button
            onClick={handleDeveloperClick}
            className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors tracking-widest px-2 py-1 rounded cursor-pointer select-none"
            title={developerClicks > 0 ? `${5 - developerClicks} clicks to admin` : 'Developer'}
          >
            Developer
            {developerClicks > 0 && (
              <span className="ml-1 text-[#7FFF68]">({developerClicks}/5)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
