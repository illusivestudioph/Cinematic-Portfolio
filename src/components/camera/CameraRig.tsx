import React, { useMemo } from 'react';
import { interpolateCamera } from '../../config/timeline';
import { usePortfolio } from '../../context/PortfolioContext';

interface CameraRigProps {
  children: React.ReactNode;
}

export const CameraRig: React.FC<CameraRigProps> = ({ children }) => {
  const { progress } = usePortfolio();

  const camera = useMemo(() => {
    return interpolateCamera(progress);
  }, [progress]);

  // CSS 3D transform for cinematic camera rig
  // Camera moves in 3D world space:
  // - Panning camera right (+x) translates world left (-x)
  // - Tilting camera down (+rotateX) pitches world up (-rotateX)
  // - Panning camera right (+rotateY) rotates world left (-rotateY)
  // - Dollying camera in (+z) brings world closer (+z)
  const cameraTransform = `
    translate3d(${-camera.x}px, ${-camera.y}px, ${camera.z}px)
    rotateX(${-camera.rotateX}deg)
    rotateY(${-camera.rotateY}deg)
    rotateZ(${-camera.rotateZ}deg)
    scale(${camera.scale})
  `;

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#050608] z-0 select-none">
      {/* 3D Perspective Stage */}
      <div 
        className="w-full h-full perspective-stage flex items-center justify-center preserve-3d"
        style={{ perspective: '1200px' }}
      >
        {/* World Space Container */}
        <div
          className="w-full h-full preserve-3d will-change-transform flex items-center justify-center"
          style={{
            transform: cameraTransform,
          }}
        >
          {children}
        </div>
      </div>

      {/* Cinematic Overlays: Vignette & Film Grain */}
      <div className="fixed inset-0 pointer-events-none z-40 cinematic-vignette opacity-80" />
      <div className="fixed inset-0 pointer-events-none z-40 film-grain opacity-25 mix-blend-screen" />
      <div className="fixed inset-0 pointer-events-none z-40 crt-scanlines opacity-10" />

      {/* Subtle Anamorphic Lens Streak on fast movement */}
      <div 
        className="fixed top-1/2 left-0 right-0 h-[2px] pointer-events-none z-40 anamorphic-flare transition-opacity duration-300"
        style={{
          opacity: Math.min(0.7, Math.abs(camera.rotateY) * 0.15 + (progress > 0.5 && progress < 0.7 ? 0.3 : 0)),
        }}
      />
    </div>
  );
};
