import React, { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollFrameSequenceProps {
  baseUrl: string;
  frameCount: number;
  padding?: number;
  fallback: string;
  progress: number; // 0.0 to 1.0 within this sequence's active window
  className?: string;
  alt?: string;
}

export const ScrollFrameSequence: React.FC<ScrollFrameSequenceProps> = ({
  baseUrl,
  frameCount,
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

  // Helper to construct frame URL: baseUrl/frame_0001.webp or baseUrl_0001.webp
  const getFrameUrl = useCallback((index: number) => {
    if (!baseUrl) return fallback;
    const padded = String(index).padStart(padding, '0');
    // If baseUrl ends with a slash or has placeholder
    if (baseUrl.includes('{index}')) {
      return baseUrl.replace('{index}', padded);
    }
    const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${cleanBase}frame_${padded}.webp`;
  }, [baseUrl, fallback, padding]);

  // Determine current frame index (1-based)
  const currentFrameIndex = Math.max(1, Math.min(frameCount, Math.round(progress * (frameCount - 1)) + 1));

  // Preload fallback image
  useEffect(() => {
    const img = new Image();
    img.src = fallback;
    img.onload = () => {
      fallbackImgRef.current = img;
      renderCurrentFrame();
    };
  }, [fallback]);

  // Selective sliding window preloader: load current frame ± 5 frames
  useEffect(() => {
    if (!baseUrl) {
      setUsingFallback(true);
      return;
    }

    setUsingFallback(false);
    const windowSize = 5;
    const start = Math.max(1, currentFrameIndex - windowSize);
    const end = Math.min(frameCount, currentFrameIndex + windowSize);

    for (let i = start; i <= end; i++) {
      if (!cacheRef.current.has(i)) {
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          cacheRef.current.set(i, img);
          if (i === currentFrameIndex) {
            renderCurrentFrame();
          }
        };
        img.onerror = () => {
          // If frame fails, mark for fallback
          if (i === currentFrameIndex) {
            setUsingFallback(true);
          }
        };
      }
    }
  }, [baseUrl, currentFrameIndex, frameCount, getFrameUrl]);

  // Render to canvas
  const renderCurrentFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let targetImg: HTMLImageElement | undefined | null = cacheRef.current.get(currentFrameIndex);

    if (!targetImg || usingFallback) {
      targetImg = fallbackImgRef.current;
    }

    if (targetImg && targetImg.complete && targetImg.naturalWidth > 0) {
      if (canvas.width !== targetImg.naturalWidth || canvas.height !== targetImg.naturalHeight) {
        canvas.width = targetImg.naturalWidth;
        canvas.height = targetImg.naturalHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(targetImg, 0, 0);
    }
  }, [currentFrameIndex, usingFallback]);

  useEffect(() => {
    renderCurrentFrame();
  }, [currentFrameIndex, renderCurrentFrame]);

  return (
    <div className={`relative overflow-hidden w-full h-full flex items-center justify-center ${className}`}>
      {/* Canvas for sequence rendering */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover select-none pointer-events-none"
        aria-label={alt}
      />

      {/* Fallback image if canvas not ready */}
      {usingFallback && (
        <img
          src={fallback}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          loading="lazy"
        />
      )}
    </div>
  );
};
