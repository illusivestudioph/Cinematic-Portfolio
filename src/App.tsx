import React, { useRef } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { useScrollTimeline } from './hooks/useScrollTimeline';
import { TOTAL_PIN_DISTANCE_VH } from './config/timeline';
import { CameraRig } from './components/camera/CameraRig';
import { CinematicHUD } from './components/ui/CinematicHUD';
import { CustomCursor } from './components/ui/CustomCursor';
import { AdminGateModal } from './components/admin/AdminGateModal';
import { NoiseBurstOverlay } from './components/animation/NoiseBurstOverlay';

// The 7 Continuous Cinematic Beats
import { Beat01StaticIllusion } from './components/scenes/Beat01StaticIllusion';
import { Beat02BreakFrame } from './components/scenes/Beat02BreakFrame';
import { Beat03Catalyst } from './components/scenes/Beat03Catalyst';
import { Beat04ShowreelPeak } from './components/scenes/Beat04ShowreelPeak';
import { Beat05Deconstruction } from './components/scenes/Beat05Deconstruction';
import { Beat06CTAAnchor } from './components/scenes/Beat06CTAAnchor';
import { Beat07FooterFade } from './components/scenes/Beat07FooterFade';

const PortfolioReelApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { activeScene } = usePortfolio();
  useScrollTimeline(containerRef);

  return (
    <div ref={containerRef} className="relative w-full bg-[#050608]">
      {/* Cinematic Transition Noise Burst */}
      <NoiseBurstOverlay activeScene={activeScene.id} />
      {/* 
        Master Scroll Track:
        Provides generous physical scroll distance (~2000vh) across all 7 cinematic beats.
        The footer is reached only after experiencing all 7 beats.
      */}
      <div 
        style={{ height: `${TOTAL_PIN_DISTANCE_VH}vh` }} 
        className="w-full pointer-events-none" 
      />

      {/* 2.5D Spatial Camera Rig & Pinned Beat Sequences */}
      <CameraRig>
        <Beat01StaticIllusion />
        <Beat02BreakFrame />
        <Beat03Catalyst />
        <Beat04ShowreelPeak />
        <Beat05Deconstruction />
        <Beat06CTAAnchor />
        <Beat07FooterFade />
      </CameraRig>

      {/* Persistent Cinematic HUD Overlay */}
      <CinematicHUD />

      {/* Fluid Interactive Director Cursor */}
      <CustomCursor />

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
