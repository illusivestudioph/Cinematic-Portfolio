import React, { useMemo } from 'react';
import type { FrameSequenceClip } from '../../config/content';
import { ScrollFrameSequence } from './ScrollFrameSequence';

interface ScrollClipSequenceProps {
  /**
   * Multiple ~8s source clips chained into one continuous cinematic movement.
   * Each clip is an independent Supabase WebP frame sequence with its own
   * frame count; scroll progress is distributed evenly across the chain.
   */
  clips: FrameSequenceClip[];
  /** Beat-local progress 0.0 -> 1.0 across the whole chained movement */
  progress: number;
  className?: string;
  /** Show a "SHOT 02 // PULL UP CHAIR" movement chip over the footage */
  showShotLabel?: boolean;
}

export const ScrollClipSequence: React.FC<ScrollClipSequenceProps> = ({
  clips,
  progress,
  className = '',
  showShotLabel = true,
}) => {
  const usableClips = useMemo(
    () => clips.filter((c) => c.baseUrl && c.frameCount > 0),
    [clips]
  );

  const { activeIndex, clipProgress, activeClip } = useMemo(() => {
    if (usableClips.length === 0) {
      return { activeIndex: 0, clipProgress: 0, activeClip: null as FrameSequenceClip | null };
    }
    const p = Math.max(0, Math.min(1, progress));
    // Even scroll share per clip — clips are each ~8 seconds of movement
    const scaled = p * usableClips.length;
    const idx = Math.min(usableClips.length - 1, Math.floor(scaled));
    const local = usableClips.length === 1 ? p : scaled - idx;
    return { activeIndex: idx, clipProgress: Math.max(0, Math.min(1, local)), activeClip: usableClips[idx] };
  }, [usableClips, progress]);

  if (!activeClip) return null;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Active source clip — remounts on cut, cross-dissolving into the next clip */}
      <div
        key={`${activeClip.label}-${activeIndex}`}
        className="absolute inset-0 w-full h-full animate-clip-cut"
      >
        <ScrollFrameSequence
          baseUrl={activeClip.baseUrl}
          frameCount={activeClip.frameCount}
          padding={activeClip.padding}
          fallback={activeClip.fallback}
          progress={clipProgress}
          alt={activeClip.label}
        />
      </div>

      {/* Movement label chip — the choreography readout */}
      {showShotLabel && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-3 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-[11px] tracking-[0.25em] text-white uppercase">
            Shot {String(activeIndex + 1).padStart(2, '0')}
            <span className="text-slate-600 mx-2">//</span>
            <span className="text-cyan-300">{activeClip.label}</span>
          </span>
        </div>
      )}
    </div>
  );
};
