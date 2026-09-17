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

      {/* Clean Cinematic Vignette - No CRT scanlines or static */}
      <div className="fixed inset-0 pointer-events-none z-40 cinematic-vignette opacity-50" />

    </div>
  );
};
