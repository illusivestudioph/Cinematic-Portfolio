import React from 'react';

interface CameraRigProps {
  children: React.ReactNode;
}

export const CameraRig: React.FC<CameraRigProps> = ({ children }) => {

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-[#050608] z-0 select-none">
      {/* Pinned Stage Container matching Mad Dogs architecture */}
      <div className="relative w-full h-full flex items-center justify-center">
        {children}
      </div>

      {/* Clean Cinematic Vignette */}
      <div className="fixed inset-0 pointer-events-none z-30 cinematic-vignette opacity-40" />
    </div>
  );
};
