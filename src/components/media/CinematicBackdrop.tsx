import React from 'react';

interface CinematicBackdropProps {
  src: string;
  alt: string;
  /**
   * 'anchored' — the frame sits full-height on the RIGHT of the composition and
   *               its left edge falls off into darkness (clean negative space).
   *               This is aspect-ratio-agnostic: portrait, square or landscape
   *               source stills all compose correctly.
   * 'full'     — the frame fills the entire viewport (object-cover), for close
   *               camera moves where immersion matters more than composition.
   */
  mode?: 'anchored' | 'full';
  /** CSS filter string (e.g. progressive darkening in the footer fade) */
  filter?: string;
  /** Uniform scale (camera push / settle) */
  scale?: number;
  /** Horizontal object position for 'full' mode */
  objectPosition?: string;
  className?: string;
}

/**
 * A cinematic film frame used as a scene backdrop. Handles any source aspect
 * ratio gracefully — the scene always reads as one continuous composition with
 * the editor on the right and quiet negative space on the left.
 */
export const CinematicBackdrop: React.FC<CinematicBackdropProps> = ({
  src,
  alt,
  mode = 'anchored',
  filter,
  scale = 1,
  objectPosition = 'center',
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Ambient base — the edit suite falling into darkness */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 72% 45%, rgba(13,20,28,0.9), rgba(5,6,8,1) 78%)',
        }}
      />

      {mode === 'anchored' ? (
        /* The frame, full height, anchored right — fading into the darkness on the left */
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute right-0 top-0 h-full w-auto max-w-none will-change-transform"
          style={{
            filter,
            transform: `scale(${scale})`,
            transformOrigin: 'right center',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 14%, black 40%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 14%, black 40%)',
          }}
        />
      ) : (
        /* Full-bleed frame — close camera moves */
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ filter, transform: `scale(${scale})`, objectPosition }}
        />
      )}
    </div>
  );
};
