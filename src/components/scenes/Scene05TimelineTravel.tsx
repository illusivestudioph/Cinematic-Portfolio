import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SCENES } from '../../config/timeline';
import { Target, Crosshair } from 'lucide-react';

export const Scene05TimelineTravel: React.FC = () => {
  const { progress } = usePortfolio();
  const { start, end } = SCENES.timeline;

  const isVisible = progress >= start - 0.03 && progress <= end + 0.03;
  if (!isVisible) return null;

  // Local progress (0.40 to 0.52)
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));

  // Opacity: smoothly fades in, stays locked during spatial travel, hands off to Scene 06
  const opacity = t < 0.15 ? t / 0.15 : t > 0.88 ? Math.max(0, (1 - t) / 0.12) : 1;

  // Spatial Waypoints that the camera passes through:
  // 1. RAW FOOTAGE (t: 0.0 - 0.18)
  // 2. CUTS (t: 0.18 - 0.36)
  // 3. B-ROLL (t: 0.36 - 0.54)
  // 4. AUDIO (t: 0.54 - 0.72)
  // 5. MOTION & COLOR (t: 0.72 - 0.88)
  // 6. TARGET DESTINATION CLIP LOCK (t: 0.88 - 1.0)
  const travelX = -t * 800;
  const travelZ = -200 + t * 600;
  const travelY = Math.sin(t * Math.PI) * 40;

  // Active waypoint label
  let activePhase = 'RAW FOOTAGE';
  if (t > 0.85) activePhase = 'LOCKING TARGET CLIP';
  else if (t > 0.70) activePhase = 'COLOR & TEXTURE';
  else if (t > 0.52) activePhase = 'MOTION & VFX';
  else if (t > 0.35) activePhase = 'AUDIO STEMS';
  else if (t > 0.18) activePhase = 'DYNAMIC CUTS';

  return (
    <div
      className="absolute inset-0 flex items-center justify-center preserve-3d pointer-events-none transition-opacity duration-100"
      style={{
        opacity,
      }}
    >
      <div
        className="relative w-[180vw] max-w-none h-[80vh] flex items-center preserve-3d will-change-transform"
        style={{
          transform: `translate3d(${travelX}px, ${travelY}px, ${travelZ}px) rotateY(${-t * 12}deg)`,
        }}
      >
        {/* Floating Dimension Guides and Track Metas */}
        <div className="absolute top-12 left-1/4 flex items-center space-x-3 text-xs font-mono text-cyan-400 bg-black/60 px-4 py-1.5 rounded-full border border-cyan-500/30">
          <Crosshair className="w-4 h-4 animate-spin-slow" />
          <span>WAYPOINT: {activePhase}</span>
        </div>

        {/* ================= STATION 1: RAW FOOTAGE ================= */}
        <div 
          className="w-[420px] h-[280px] rounded-xl bg-slate-950/90 border border-slate-700/50 p-4 flex flex-col justify-between shadow-2xl mx-12 shrink-0 preserve-3d"
          style={{ transform: 'translateZ(-100px) rotateY(15deg)' }}
        >
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span className="text-cyan-400">01 // RAW LOG REEL</span>
            <span>ACESproxy</span>
          </div>
          <div className="relative flex-1 my-2 rounded bg-black overflow-hidden border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80"
              alt="Raw Ingest"
              className="w-full h-full object-cover opacity-60 grayscale"
            />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white/80 bg-black/40">
              [ FLAT S-LOG3 SENSOR FEED ]
            </div>
          </div>
          <div className="text-[9px] font-mono text-slate-400 flex justify-between">
            <span>BITRATE: 400 Mbps</span>
            <span>SHUTTER: 180°</span>
          </div>
        </div>

        {/* ================= STATION 2: CUTS & RHYTHM ================= */}
        <div 
          className="w-[440px] h-[300px] rounded-xl bg-slate-950/90 border border-cyan-500/40 p-4 flex flex-col justify-between shadow-2xl mx-12 shrink-0 preserve-3d"
          style={{ transform: 'translateZ(0px)' }}
        >
          <div className="flex justify-between text-[10px] font-mono text-cyan-400">
            <span>02 // KINETIC CUTS</span>
            <span className="text-amber-400">MATCH CUT LOCKED</span>
          </div>
          <div className="relative flex-1 my-2 rounded bg-black overflow-hidden border border-white/10 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80"
              alt="Cuts in action"
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute bottom-2 left-2 text-[9px] font-mono text-white/90 bg-black/70 px-2 py-0.5 rounded">
              SPEED: 140% -&gt; 40% (OPTICAL FLOW)
            </div>
          </div>
          <div className="text-[9px] font-mono text-slate-400 flex justify-between">
            <span>FRAME SPLICE: #14092</span>
            <span>SNAP TO GRID: ACTIVE</span>
          </div>
        </div>

        {/* ================= STATION 3: AUDIO & FOLEY ================= */}
        <div 
          className="w-[420px] h-[280px] rounded-xl bg-slate-950/90 border border-emerald-500/40 p-4 flex flex-col justify-between shadow-2xl mx-12 shrink-0 preserve-3d"
          style={{ transform: 'translateZ(-60px) rotateY(-10deg)' }}
        >
          <div className="flex justify-between text-[10px] font-mono text-emerald-400">
            <span>03 // SUB-BASS IMPACTS</span>
            <span>32-BIT FLOAT</span>
          </div>
          <div className="relative flex-1 my-2 rounded bg-black overflow-hidden border border-white/10 p-3 flex flex-col justify-center items-center">
            <div className="flex items-end space-x-1 h-20 w-full justify-center">
              {[8, 14, 26, 45, 62, 78, 55, 30, 68, 85, 42, 20, 10, 48, 70, 92, 40, 15].map((h, i) => (
                <div 
                  key={i} 
                  className="w-2.5 rounded-t bg-gradient-to-t from-emerald-500 to-cyan-400"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-2 text-[9px] font-mono text-emerald-300">SUB DROP @ 40Hz</div>
          </div>
          <div className="text-[9px] font-mono text-slate-400 flex justify-between">
            <span>LUFS: -14.2</span>
            <span>TRUE PEAK: -1.0 dB</span>
          </div>
        </div>

        {/* ================= STATION 4: MOTION & COLOR ================= */}
        <div 
          className="w-[440px] h-[300px] rounded-xl bg-slate-950/90 border border-purple-500/40 p-4 flex flex-col justify-between shadow-2xl mx-12 shrink-0 preserve-3d"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="flex justify-between text-[10px] font-mono text-purple-400">
            <span>04 // FILM PRINT & HALATION</span>
            <span>ACES 2065-1</span>
          </div>
          <div className="relative flex-1 my-2 rounded bg-black overflow-hidden border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
              alt="Grade preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-purple-600/30 mix-blend-color-dodge" />
          </div>
          <div className="text-[9px] font-mono text-slate-400 flex justify-between">
            <span>KODAK 5219 STOCK</span>
            <span>DCI-P3 GAMUT LOCK</span>
          </div>
        </div>

        {/* ================= STATION 5: DESTINATION HERO CLIP ================= */}
        <div 
          className="w-[500px] h-[320px] rounded-2xl bg-black border-2 border-cyan-400 shadow-[0_0_80px_rgba(56,189,248,0.5)] p-4 flex flex-col justify-between mx-16 shrink-0 preserve-3d relative"
          style={{ 
            transform: `translateZ(${100 + (t > 0.8 ? (t - 0.8) * 400 : 0)}px) scale(${1 + (t > 0.8 ? (t - 0.8) * 0.8 : 0)})`,
          }}
        >
          {/* Target Reticle Lock */}
          <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-xs shadow-lg animate-bounce">
            <Target className="w-5 h-5" />
          </div>

          <div className="flex justify-between text-xs font-mono text-cyan-300">
            <span className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              DESTINATION: HERO SHOWREEL
            </span>
            <span className="text-amber-400">READY FOR PUNCH-IN</span>
          </div>

          <div className="relative flex-1 my-2 rounded-lg bg-black overflow-hidden border border-cyan-400/40 flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1280&q=80"
              alt="Destination Reel Clip"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            
            {/* Cinematic crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border border-cyan-400/80 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-300 flex justify-between">
            <span>MASTER REEL 00:01:00:00</span>
            <span className="text-cyan-400 font-bold">SCROLL TO ENTER FOOTAGE</span>
          </div>
        </div>
      </div>

      {/* Cinematic Scene Label */}
      <div className="absolute bottom-8 left-8 sm:left-12 flex items-center space-x-3 text-slate-400 font-mono text-xs">
        <span className="text-cyan-400 font-bold">SHOT 05</span>
        <span className="text-slate-600">//</span>
        <span>TIMELINE TRAVERSAL & CLIP LOCK</span>
      </div>
    </div>
  );
};
