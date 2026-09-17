import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface NoiseBurstOverlayProps {
  activeScene: string;
}

export const NoiseBurstOverlay: React.FC<NoiseBurstOverlayProps> = ({ activeScene }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const prevSceneRef = useRef<string>(activeScene);

  useEffect(() => {
    // Only burst when changing between distinct scenes
    if (prevSceneRef.current !== activeScene) {
      prevSceneRef.current = activeScene;
      const el = overlayRef.current;
      if (!el) return;

      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        {
          opacity: 0.85,
          scale: 1.05,
        },
        {
          opacity: 0,
          scale: 1,
          duration: 0.38,
          ease: 'power2.out',
        }
      );
    }
  }, [activeScene]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 opacity-0 overflow-hidden mix-blend-screen"
    >
      {/* High-contrast film noise video overlay */}
      <video
        src="https://mad-dogs.cdn.prismic.io/mad-dogs/IwlvAM3OAfdbL_JR_Noise-1-.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover filter contrast-150 brightness-125"
      />
    </div>
  );
};
