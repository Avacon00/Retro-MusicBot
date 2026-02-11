import React from 'react';
import { PlayerState } from '../types';

interface ControlsProps {
  playerState: PlayerState;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Controls: React.FC<ControlsProps> = ({ 
  playerState, 
  onPlayPause, 
  onNext, 
  onPrev,
  volume,
  onVolumeChange,
  currentTime,
  duration,
  onSeek
}) => {
  const isPlaying = playerState === PlayerState.PLAYING;

  // Metallic button style
  const buttonClass = "group relative w-12 h-12 rounded-lg bg-gradient-to-b from-zinc-200 to-zinc-400 active:from-zinc-400 active:to-zinc-500 shadow-[0_4px_0_#555,0_5px_10px_rgba(0,0,0,0.5)] active:shadow-[0_1px_0_#555,inset_0_2px_5px_rgba(0,0,0,0.3)] active:translate-y-[3px] transition-all flex items-center justify-center";
  const iconClass = "w-5 h-5 text-zinc-800 drop-shadow-sm";

  return (
    <div className="w-full bg-[#222] p-4 rounded-xl border border-zinc-700 shadow-xl flex flex-col gap-3">
      
      {/* Progress Bar Area */}
      <div className="flex flex-col gap-1 px-1 mb-1">
        <input 
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Buttons Row */}
      <div className="flex justify-between items-center px-2">
        
        {/* Prev */}
        <button onClick={onPrev} className={buttonClass} aria-label="Previous">
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
        </button>

        {/* Play/Pause */}
        <button onClick={onPlayPause} className={`${buttonClass} w-16`} aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
             <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          ) : (
             <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
          {/* LED Indicator */}
          <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-red-900'} transition-colors`}></div>
        </button>

        {/* Next */}
        <button onClick={onNext} className={buttonClass} aria-label="Next">
          <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
        </button>
      </div>

      {/* Volume Slider */}
      <div className="flex items-center gap-3 px-1 mt-1">
        <svg className="w-3 h-3 text-zinc-600" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-500"
        />
      </div>
    </div>
  );
};

export default Controls;