import React from 'react';
import { Song } from '../types';

interface QueueProps {
  queue: Song[];
  currentIndex: number;
  onSongSelect: (index: number) => void;
  onClose?: () => void;
}

const Queue: React.FC<QueueProps> = ({ 
  queue, 
  currentIndex, 
  onSongSelect, 
  onClose
}) => {
  return (
    <div className="w-full bg-[#1a1a1a] rounded-xl border border-zinc-800 p-4 flex flex-col h-[400px] shadow-2xl relative">
      <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-4 flex justify-between items-center border-b border-zinc-800 pb-2">
        <span>Up Next</span>
        <div className="flex items-center gap-2">
            <span className="bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded text-[10px]">{queue.length} Tracks</span>
            {onClose && (
                <button 
                  onClick={onClose} 
                  className="ml-2 text-zinc-500 hover:text-red-400 transition-colors p-1"
                  aria-label="Close Queue"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            )}
        </div>
      </h3>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 mb-2">
        {queue.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-2">
            <svg className="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
            <span className="text-xs">Queue is empty</span>
          </div>
        ) : (
          queue.map((song, idx) => (
            <div 
              key={song.id}
              onClick={() => onSongSelect(idx)}
              className={`group flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                idx === currentIndex 
                  ? 'bg-amber-900/30 border-l-2 border-amber-500' 
                  : 'hover:bg-zinc-800 border-l-2 border-transparent'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm truncate ${idx === currentIndex ? 'text-amber-500 font-medium' : 'text-zinc-300'}`}>
                  {song.title}
                </p>
                <p className="text-xs text-zinc-500 truncate">{song.artist}</p>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono ml-2 group-hover:text-zinc-400">
                {song.duration}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Queue;