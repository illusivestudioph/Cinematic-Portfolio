import React, { useEffect, useRef, useCallback } from 'react';

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

  // Draw image to canvas with crisp scaling & optional cinematic frame metadata overlay
  const drawFrameToCanvas = useCallback((img: HTMLImageElement | null, frameIndex: number, currentProgress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Use container dimensions or natural image dimensions
    const width = img?.naturalWidth || 1920;
    const height = img?.naturalHeight || 1080;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    if (img && img.complete && img.naturalWidth > 0) {
      // If we are in sequence placeholder mode (no baseUrl yet), apply dynamic scroll framing
      if (!baseUrl) {
        ctx.save();
        // Subtle optical zoom & pan driven by scroll progress
        const zoom = 1.0 + currentProgress * 0.06;
        const panX = Math.sin(currentProgress * Math.PI) * 15;
        const panY = currentProgress * -10;
        
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-width / 2 + panX, -height / 2 + panY);
        ctx.drawImage(img, 0, 0, width, height);
        ctx.restore();

        // Overlay subtle cinematic film registration graticules
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1.5;

        // 2.39:1 Cinema scope crop guides
        const scopeHeight = width / 2.39;
        const scopeTop = (height - scopeHeight) / 2;
        ctx.strokeRect(30, scopeTop, width - 60, scopeHeight);

        // Technical sequence stamp
        const padFrame = String(frameIndex).padStart(padding, '0');
        const padTotal = String(frameCount).padStart(padding, '0');
        ctx.font = '14px monospace';
        ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.fillText(`SEQ_PLACEHOLDER // FRAME: ${padFrame}/${padTotal} (24 FPS)`, 45, height - 40);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText(`CANVAS SCRUB: ${(currentProgress * 100).toFixed(1)}% // [DOG FRAMES READY]`, width - 450, height - 40);

        ctx.restore();
      } else {
        // Direct clean frame render for real WebP sequences
        ctx.drawImage(img, 0, 0, width, height);
      }
    } else {
      // Dark slate void before image finishes loading
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, width, height);
    }
  }, [baseUrl, frameCount, padding]);

  // Preload fallback image
  useEffect(() => {
    const img = new Image();
    img.src = fallback;
    img.onload = () => {
      fallbackImgRef.current = img;
      drawFrameToCanvas(img, 1, 0);
    };
  }, [fallback, drawFrameToCanvas]);

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
      }
    }
  }, [baseUrl, frameCount, getFrameUrl]);

  // Continuous rAF render loop with smooth interpolation
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      // Smooth damping (0.18 factor gives responsive, silky feel)
      const diff = targetProgressRef.current - currentProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.18;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      // Convert interpolated progress to frame index (1-based)
      const frameIdx = Math.max(1, Math.min(frameCount, Math.round(currentProgressRef.current * (frameCount - 1)) + 1));

      // Trigger preloading around current frame if baseUrl configured
      if (baseUrl) {
        preloadSurroundingFrames(frameIdx);
      }

      // Render frame
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
          drawFrameToCanvas(img, frameIdx, currentProgressRef.current);
          renderedFrameRef.current = frameIdx;
        } else if (fallbackImgRef.current) {
          drawFrameToCanvas(fallbackImgRef.current, frameIdx, currentProgressRef.current);
          renderedFrameRef.current = frameIdx;
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
  }, [baseUrl, drawFrameToCanvas, frameCount, preloadSurroundingFrames]);

  return (
    <div className={`relative overflow-hidden w-full h-full flex items-center justify-center ${className}`}>
      {/* High performance Canvas rendering surface */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none pointer-events-none will-change-transform"
        aria-label={alt}
      />
    </div>
  );
};
