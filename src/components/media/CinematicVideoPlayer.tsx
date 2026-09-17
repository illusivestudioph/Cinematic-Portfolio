import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Film, Lock, Unlock } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface CinematicVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  title?: string;
  subtitle?: string;
  aspectRatio?: string;
  isActive: boolean; // whether this scene is in focus
  autoPauseOnInactive?: boolean;
  allowScrollLock?: boolean; // whether to show hold-scroll toggle
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
}

export const CinematicVideoPlayer: React.FC<CinematicVideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  title,
  subtitle,
  aspectRatio = '16/9',
  isActive,
  autoPauseOnInactive = true,
  allowScrollLock = false,
  onPlayStateChange,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { scrollPaused, setScrollPaused } = usePortfolio();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  // Auto-pause if scrolled away
  useEffect(() => {
    if (!isActive && autoPauseOnInactive && isPlaying) {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        onPlayStateChange?.(false);
      }
    }
  }, [isActive, autoPauseOnInactive, isPlaying, onPlayStateChange]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      onPlayStateChange?.(false);
      // Release the scroll lock when the visitor pauses the reel
      if (allowScrollLock && scrollPaused) {
        setScrollPaused(false);
      }
    } else {
      // First interaction: unmute if user clicks play, providing real audio experience
      if (!hasStarted) {
        video.muted = false;
        setIsMuted(false);
        setHasStarted(true);
      }
      video.play().then(() => {
        setIsPlaying(true);
        onPlayStateChange?.(true);
        // If scroll lock is enabled, hold the camera automatically on play
        if (allowScrollLock && !scrollPaused) {
          setScrollPaused(true);
        }
      }).catch((err) => {
        console.warn('Playback prevented:', err);
      });
    }
  }, [isPlaying, hasStarted, onPlayStateChange, allowScrollLock, scrollPaused, setScrollPaused]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMute = !isMuted;
    video.muted = nextMute;
    setIsMuted(nextMute);
    if (!nextMute && video.volume === 0) {
      video.volume = 0.85;
      setVolume(0.85);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Format seconds into SMPTE timecode (HH:MM:SS:FF at 24fps)
  const formatSMPTE = (seconds: number) => {
    if (isNaN(seconds)) return '00:00:00:00';
    const totalFrames = Math.floor(seconds * 24);
    const hrs = Math.floor(totalFrames / (3600 * 24));
    const mins = Math.floor((totalFrames % (3600 * 24)) / (60 * 24));
    const secs = Math.floor((totalFrames % (60 * 24)) / 24);
    const frames = totalFrames % 24;

    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-black border border-white/10 shadow-2xl flex items-center justify-center pointer-events-auto ${className}`}
      style={{ aspectRatio }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        playsInline
        muted={isMuted}
        onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
        onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
        onEnded={() => {
          setIsPlaying(false);
          onPlayStateChange?.(false);
          // The reel finished — release the scroll lock so the journey continues
          if (allowScrollLock && scrollPaused) {
            setScrollPaused(false);
          }
        }}
        onClick={togglePlay}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Top Bar Header */}
      {(title || allowScrollLock) && (
        <div
          className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-30 ${
            showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
            <div>
              {title && <h3 className="font-syne text-sm sm:text-base font-bold tracking-wider text-white uppercase">{title}</h3>}
              {subtitle && <p className="text-xs font-mono text-cyan-300/80">{subtitle}</p>}
            </div>
          </div>

          {allowScrollLock && (
            <button
              onClick={() => setScrollPaused(!scrollPaused)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
                scrollPaused
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'bg-black/60 text-slate-400 border-white/10 hover:border-white/30'
              }`}
            >
              {scrollPaused ? <Lock className="w-3.5 h-3.5 text-cyan-400" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{scrollPaused ? 'Flight Locked (Watching Reel)' : 'Lock Camera Flight'}</span>
            </button>
          )}
        </div>
      )}

      {/* Big Initial Center Play Button */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer transition-all duration-300 z-20 hover:bg-black/20"
        >
          <div className="relative group/btn flex items-center justify-center">
            {/* Outer animated rings */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/40 to-purple-600/40 blur-md opacity-70 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-500" />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-black/80 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-2xl transition-transform duration-300 group-hover/btn:scale-105 group-hover/btn:border-cyan-400">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1 transition-colors group-hover/btn:text-cyan-400 group-hover/btn:fill-cyan-400" />
            </div>
          </div>
          <p className="mt-4 text-xs sm:text-sm font-mono uppercase tracking-widest text-slate-300 group-hover:text-cyan-300 transition-colors">
            Click to Play Film Reel
          </p>
        </div>
      )}

      {/* Custom Bottom Cinematic Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col gap-2 transition-opacity duration-300 z-30 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Bar */}
        <div className="relative flex items-center w-full group/scrub">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.01}
            value={currentTime}
            onChange={handleSeek}
            className="w-full cinematic-slider cursor-pointer"
          />
          {/* Progress fill visual */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded pointer-events-none"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-cyan-400 transition-colors focus:outline-none"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>

            {/* Audio Toggle & Volume */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-cyan-400 transition-colors focus:outline-none"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 cinematic-slider hidden sm:block"
                aria-label="Volume"
              />
            </div>

            {/* SMPTE Timecode */}
            <div className="text-[11px] sm:text-xs font-mono tracking-wider text-slate-300">
              <span className="text-cyan-300">{formatSMPTE(currentTime)}</span>
              <span className="text-slate-600 mx-1.5">/</span>
              <span className="text-slate-400">{formatSMPTE(duration)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded border border-white/5">
              <Film className="w-3 h-3 text-cyan-400" />
              <span>24.000 FPS</span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-cyan-400 transition-colors focus:outline-none"
              aria-label="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
