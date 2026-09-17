import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollFrameSequenceProps {
  baseUrl: string;
  frameCount?: number; // Configurable frame count (defaults to 120, typically 100–140)
  padding?: number;
  fallback: string;
  progress: number; // 0.0 to 1.0 within this sequence's active pinned window
  className?: string;
  alt?: string;
}

export const ScrollFrameSequence: React.FC<ScrollFrameSequenceProps> = ({
  baseUrl,
  frameCount = 120,
  padding = 4,
  fallback,
  progress,
  className = '',
  alt = 'Cinematic sequence frame',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const [usingFallback, setUsingFallback] = useState(!baseUrl);
  const fallbackImgRef = useRef<HTMLImageElement | null>(null);

  // Smooth rAF interpolation states
  const targetProgressRef = useRef(progress);
  const currentProgressRef = useRef(progress);
  const rafIdRef = useRef<number | null>(null);
  const renderedFrameRef = useRef<number>(-1);

  // Update target progress whenever prop changes
  useEffect(() => {
    targetProgressRef.current = Math.max(0, Math.min(1, progress));
  }, [progress]);

  // Helper to construct frame URL: baseUrl/frame_0001.webp or custom pattern
  const getFrameUrl = useCallback((index: number) => {
    if (!baseUrl) return fallback;
    const padded = String(index).padStart(padding, '0');
    if (baseUrl.includes('{index}')) {
      return baseUrl.replace('{index}', padded);
    }
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${cleanBase}frame_${padded}.webp`;
  }, [baseUrl, fallback, padding]);

  // Preload fallback image
  useEffect(() => {
    const img = new Image();
    img.src = fallback;
    img.onload = () => {
      fallbackImgRef.current = img;
      drawFrameToCanvas(img);
    };
  }, [fallback]);

  // Draw image to canvas with crisp scaling
  const drawFrameToCanvas = useCallback((img: HTMLImageElement | null) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    if (canvas.width !== img.naturalWidth || canvas.height !== img.naturalHeight) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.drawImage(img, 0, 0);
  }, []);

  // Preloader: maintain a sliding window of frames around current target
  const preloadSurroundingFrames = useCallback((centerFrame: number) => {
    if (!baseUrl) return;
    const windowSize = 8;
    const start = Math.max(1, centerFrame - windowSize);
    const end = Math.min(frameCount, centerFrame + windowSize);

    for (let i = start; i <= end; i++) {
      if (!cacheRef.current.has(i)) {
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          cacheRef.current.set(i, img);
        };
        img.onerror = () => {
          // If frame cannot be loaded, fallback is preserved
        };
      }
    }
  }, [baseUrl, frameCount, getFrameUrl]);

  // Continuous rAF render loop with smooth interpolation
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      // Smooth damping (0.15 factor gives responsive, silky feel)
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0002) {
        currentProgressRef.current += diff * 0.15;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      // Convert interpolated progress to frame index (1-based)
      const frameIdx = Math.max(1, Math.min(frameCount, Math.round(currentProgressRef.current * (frameCount - 1)) + 1));

      // Trigger preloading around current frame
      preloadSurroundingFrames(frameIdx);

      // Only draw if frame changed or hasn't rendered yet
      if (renderedFrameRef.current !== frameIdx || renderedFrameRef.current === -1) {
        let img = cacheRef.current.get(frameIdx);
        if (!img || !img.complete) {
          // If target frame not ready in cache, check closest loaded frame
          for (let offset = 1; offset <= 4; offset++) {
            const before = cacheRef.current.get(frameIdx - offset);
            if (before && before.complete) {
              img = before;
              break;
            }
            const after = cacheRef.current.get(frameIdx + offset);
            if (after && after.complete) {
              img = after;
              break;
            }
          }
        }

        if (img && img.complete) {
          drawFrameToCanvas(img);
          renderedFrameRef.current = frameIdx;
          if (usingFallback) setUsingFallback(false);
        } else if (fallbackImgRef.current) {
          drawFrameToCanvas(fallbackImgRef.current);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawFrameToCanvas, frameCount, preloadSurroundingFrames, usingFallback]);

  return (
    <div className={`relative overflow-hidden w-full h-full flex items-center justify-center ${className}`}>
      {/* High performance Canvas rendering surface */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none pointer-events-none"
        aria-label={alt}
      />

      {/* Fallback image when no frames are active or while initial asset loads */}
      {usingFallback && (
        <img
          src={fallback}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
          loading="eager"
        />
      )}
    </div>
  );
};
