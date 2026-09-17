import React, { useRef } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { useScrollTimeline } from './hooks/useScrollTimeline';
import { TOTAL_PIN_DISTANCE_VH } from './config/timeline';
import { CameraRig } from './components/camera/CameraRig';
import { CinematicHUD } from './components/ui/CinematicHUD';
import { AdminGateModal } from './components/admin/AdminGateModal';

// Pinned Cinematic Sequence Chapters
import { Scene01Editor } from './components/scenes/Scene01Editor';
import { Scene02Timeline } from './components/scenes/Scene02Timeline';
import { Scene03Showreel } from './components/scenes/Scene03Showreel';
import { Scene04PullOut } from './components/scenes/Scene04PullOut';
import { Scene05Projects } from './components/scenes/Scene05Projects';
import { Scene06Process } from './components/scenes/Scene06Process';
import { Scene07About } from './components/scenes/Scene07About';
import { Scene08CTA } from './components/scenes/Scene08CTA';

const PortfolioReelApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useScrollTimeline(containerRef);

  return (
    <div ref={containerRef} className="relative w-full bg-[#050608]">
      {/* 
        Master Scroll Track:
        Provides generous physical scroll distance (~1950vh) so each pinned camera sequence
        has comfortable, precise scrub control without passing content too quickly.
      */}
      <div 
        style={{ height: `${TOTAL_PIN_DISTANCE_VH}vh` }} 
        className="w-full pointer-events-none" 
      />

      {/* 2.5D Spatial Camera Rig & Pinned Scene Sets */}
      <CameraRig>
        <Scene01Editor />
        <Scene02Timeline />
        <Scene03Showreel />
        <Scene04PullOut />
        <Scene05Projects />
        <Scene06Process />
        <Scene07About />
        <Scene08CTA />
      </CameraRig>

      {/* Persistent Cinematic HUD Overlay */}
      <CinematicHUD />

      {/* Hidden Admin Gate Modal (5 clicks on Developer in footer) */}
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
