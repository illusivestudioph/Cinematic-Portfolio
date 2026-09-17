import React, { useRef } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { useScrollTimeline } from './hooks/useScrollTimeline';
import { CameraRig } from './components/camera/CameraRig';
import { CinematicHUD } from './components/ui/CinematicHUD';
import { AdminGateModal } from './components/admin/AdminGateModal';

// The 12 Shots of the Cinematic Portfolio Reel
import { Scene01Ident } from './components/scenes/Scene01Ident';
import { Scene02Editor } from './components/scenes/Scene02Editor';
import { Scene03Stretch } from './components/scenes/Scene03Stretch';
import { Scene04EditWorld } from './components/scenes/Scene04EditWorld';
import { Scene05TimelineTravel } from './components/scenes/Scene05TimelineTravel';
import { Scene06EnterFootage } from './components/scenes/Scene06EnterFootage';
import { Scene07Showreel } from './components/scenes/Scene07Showreel';
import { Scene08PullOut } from './components/scenes/Scene08PullOut';
import { Scene09Projects } from './components/scenes/Scene09Projects';
import { Scene10Process } from './components/scenes/Scene10Process';
import { Scene11About } from './components/scenes/Scene11About';
import { Scene12CTA } from './components/scenes/Scene12CTA';

const PortfolioReelApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useScrollTimeline(containerRef);

  return (
    <div ref={containerRef} className="relative w-full bg-[#050608]">
      {/* 
        Master Scroll Track:
        Provides the physical scroll distance (800vh) that Lenis and GSAP ScrollTrigger 
        map to the 0.00 -> 1.00 normalized master timeline.
      */}
      <div className="h-[850vh] w-full pointer-events-none" />

      {/* 2.5D Spatial Camera Rig & All 12 Scene Sets */}
      <CameraRig>
        <Scene01Ident />
        <Scene02Editor />
        <Scene03Stretch />
        <Scene04EditWorld />
        <Scene05TimelineTravel />
        <Scene06EnterFootage />
        <Scene07Showreel />
        <Scene08PullOut />
        <Scene09Projects />
        <Scene10Process />
        <Scene11About />
        <Scene12CTA />
      </CameraRig>

      {/* Persistent Cinematic HUD Overlay */}
      <CinematicHUD />

      {/* Hidden Admin Gate Modal (5 clicks on Developer) */}
      <AdminGateModal />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioReelApp />
    </PortfolioProvider>
  );
}
