import React, { useState, useEffect, useCallback, useRef } from 'react';
import Cassette from './components/Cassette';
import Controls from './components/Controls';
import Queue from './components/Queue';
import { PlayerState, Song, CassetteTheme } from './types';

// Theme Definitions
const THEMES: CassetteTheme[] = [
  {
    id: 'classic',
    name: 'Classic Beige',
    colors: {
      body: '#dbd1b9',
      dark: '#b7a57a',
      label: '#f0f0f0',
      header: '#d9534f',
      screw: '#a1a1aa'
    }
  },
  {
    id: 'stealth',
    name: 'Stealth Black',
    colors: {
      body: '#18181b',
      dark: '#27272a',
      label: '#3f3f46',
      header: '#52525b',
      screw: '#52525b'
    }
  },
  {
    id: 'silver',
    name: 'Chrome',
    colors: {
      body: 'linear-gradient(135deg, #e4e4e7 0%, #a1a1aa 50%, #e4e4e7 100%)',
      dark: 'linear-gradient(to bottom, #52525b, #3f3f46)',
      label: 'linear-gradient(to bottom, #fafafa, #f4f4f5)',
      header: '#18181b',
      screw: '#d4d4d8'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: {
      body: 'linear-gradient(135deg, #2e1065, #0f172a)', // deep purple to slate
      dark: '#020617',
      label: 'linear-gradient(45deg, #f472b6, #c084fc)', // pink/purple
      header: '#22d3ee', // neon cyan
      screw: '#000000'
    }
  },
  {
    id: 'toxic',
    name: 'Biohazard',
    colors: {
      body: '#1a1a1a',
      dark: '#111',
      label: 'linear-gradient(180deg, #d9f99d 0%, #bef264 100%)', // lime
      header: '#3f6212', // dark green
      screw: '#84cc16'
    }
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    colors: {
      body: 'linear-gradient(to bottom right, #7f1d1d, #991b1b)',
      dark: '#450a0a',
      label: '#fef2f2',
      header: '#b91c1c',
      screw: '#fbbf24' // gold screw
    }
  },
  {
    id: 'vapor',
    name: 'Vaporwave',
    colors: {
      body: '#f472b6',
      dark: '#c084fc',
      label: '#e0f2fe',
      header: '#22d3ee',
      screw: '#e879f9'
    }
  },
  {
    id: 'gold',
    name: 'Solid Gold',
    colors: {
      body: 'linear-gradient(135deg, #fcd34d 0%, #d97706 50%, #fcd34d 100%)',
      dark: '#b45309',
      label: '#fffbeb',
      header: '#78350f',
      screw: '#fef3c7'
    }
  },
  {
    id: 'noir',
    name: 'Film Noir',
    colors: {
      body: '#ffffff',
      dark: '#000000',
      label: '#000000',
      header: '#ffffff',
      screw: '#000000'
    }
  },
  {
    id: 'bubblegum',
    name: 'Bubblegum',
    colors: {
      body: '#f9a8d4', // pink
      dark: '#f472b6',
      label: '#a5f3fc', // cyan
      header: '#fdba74', // orange
      screw: '#fff'
    }
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    colors: {
      body: '#1e3a8a',
      dark: '#172554',
      label: '#bfdbfe',
      header: '#2563eb',
      screw: '#60a5fa'
    }
  },
  {
    id: 'mint',
    name: 'Fresh Mint',
    colors: {
      body: '#6ee7b7',
      dark: '#059669',
      label: '#ecfdf5',
      header: '#10b981',
      screw: '#34d399'
    }
  }
];

// Mock initial data
const INITIAL_QUEUE: Song[] = [
  { id: '1', title: 'Beach Walk', artist: 'White Woods', duration: '01:50' },
  { id: '2', title: 'Resonance', artist: 'HOME', duration: '03:32' },
  { id: '3', title: 'リサフランク420 / 現代のコンピュー', artist: 'MACINTOSH PLUS', duration: '07:20' }
];

// Helper to parse duration "MM:SS" to seconds
const parseDuration = (dur: string): number => {
  if (!dur) return 0;
  const parts = dur.split(':');
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 0;
};

const App: React.FC = () => {
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.STOPPED);
  const [queue, setQueue] = useState<Song[]>(INITIAL_QUEUE);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(75);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  
  // Theme State
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem('musicBot_theme') || 'classic';
  });
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  // Initialize showControls from localStorage, default to false (collapsed)
  const [showControls, setShowControls] = useState(() => {
    try {
      const saved = localStorage.getItem('musicBot_showControls');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });
  
  // Playback state
  const [currentTime, setCurrentTime] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);

  const currentSong = queue[currentIndex] || null;
  const activeTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  // Persist showControls state whenever it changes
  useEffect(() => {
    localStorage.setItem('musicBot_showControls', JSON.stringify(showControls));
  }, [showControls]);

  // Persist Theme
  useEffect(() => {
    localStorage.setItem('musicBot_theme', currentThemeId);
  }, [currentThemeId]);

  // Logo Click "Easter Egg" logic
  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1);
    
    // Reset clicks after 2 seconds if not reached target
    setTimeout(() => {
      setLogoClicks(0);
    }, 2000);

    if (logoClicks + 1 >= 5) {
      setIsThemeMenuOpen(true);
      setLogoClicks(0);
    }
  };

  // Update duration when song changes
  useEffect(() => {
    if (currentSong) {
      setCurrentDuration(parseDuration(currentSong.duration));
      setCurrentTime(0);
    } else {
        setCurrentDuration(0);
        setCurrentTime(0);
    }
  }, [currentSong]);

  // Timer logic for playback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (playerState === PlayerState.PLAYING) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentDuration) {
             // Song finished, will be handled by next effect
             return currentDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [playerState, currentDuration]);

  // Handle auto-skip when song ends
  useEffect(() => {
      if (currentTime > 0 && currentTime >= currentDuration && playerState === PlayerState.PLAYING) {
          nextSong();
      }
  }, [currentTime, currentDuration, playerState]);


  const togglePlay = () => {
    if (!currentSong && queue.length > 0) {
        setCurrentIndex(0);
        setPlayerState(PlayerState.PLAYING);
        return;
    }
    setPlayerState(prev => prev === PlayerState.PLAYING ? PlayerState.PAUSED : PlayerState.PLAYING);
  };

  const nextSong = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setPlayerState(PlayerState.PLAYING);
    } else {
      setPlayerState(PlayerState.STOPPED);
      setCurrentIndex(0);
      setCurrentTime(0);
    }
  }, [currentIndex, queue.length]);

  const prevSong = () => {
    if (currentTime > 3) {
        // If playing for more than 3 sec, restart song
        setCurrentTime(0);
    } else if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setPlayerState(PlayerState.PLAYING);
    }
  };

  const handleSeek = (time: number) => {
      setCurrentTime(time);
  };

  return (
    <div className="w-full max-w-[350px] mx-auto p-4 flex flex-col h-screen max-h-[900px] relative transition-all duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0">
        <button 
          onClick={handleLogoClick}
          className="text-left focus:outline-none select-none active:scale-95 transition-transform"
          aria-label="Secret Menu Trigger"
        >
          <h1 className="font-['Roboto_Mono'] font-bold text-amber-500 tracking-widest text-lg">
            Music<span className="text-white">BOT</span>
          </h1>
        </button>
        <button 
          className={`p-2 rounded-lg transition-all duration-300 border ${showControls ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-transparent border-transparent text-zinc-600 hover:text-zinc-400'}`}
          onClick={() => setShowControls((prev: boolean) => !prev)}
          title={showControls ? "Hide Controls" : "Show Controls"}
          aria-label="Toggle Controls"
        >
           {/* Flaticon Play/Pause Icon with wrapper for rotation */}
           <div className={`transform transition-transform duration-300 flex items-center justify-center w-6 h-6 ${showControls ? 'rotate-90' : 'rotate-0'}`}>
             <i className="fi fi-bs-play-pause text-xl leading-none"></i>
           </div>
        </button>
      </div>

      {/* Cassette Visual */}
      <div className="flex justify-center shrink-0 z-10">
        <Cassette 
          playerState={playerState} 
          currentSong={currentSong} 
          theme={activeTheme}
          onClick={() => setIsQueueOpen(true)}
        />
      </div>

      {/* Collapsible Controls */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden shrink-0 ${showControls ? 'max-h-[300px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
        <Controls 
          playerState={playerState}
          onPlayPause={togglePlay}
          onNext={nextSong}
          onPrev={prevSong}
          volume={volume}
          onVolumeChange={setVolume}
          currentTime={currentTime}
          duration={currentDuration}
          onSeek={handleSeek}
        />
      </div>

      {/* Footer */}
      <div className="text-center pb-2 mt-auto shrink-0 opacity-50">
        <p className="text-[10px] text-zinc-600 font-mono">
           Powered by Gemini AI • Retro UI
        </p>
      </div>

      {/* Queue Popup Modal */}
      {isQueueOpen && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out] cursor-pointer"
          onClick={() => setIsQueueOpen(false)}
        >
          <div 
            className="w-full max-w-[320px] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <Queue 
              queue={queue}
              currentIndex={currentIndex}
              onSongSelect={(idx) => {
                setCurrentIndex(idx);
                setPlayerState(PlayerState.PLAYING);
              }}
              onClose={() => setIsQueueOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Secret Theme Menu Modal */}
      {isThemeMenuOpen && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setIsThemeMenuOpen(false)}
        >
           <div 
             className="bg-zinc-900 border-2 border-amber-500 rounded-xl p-4 w-full max-w-[300px] shadow-[0_0_30px_rgba(245,158,11,0.2)]"
             onClick={(e) => e.stopPropagation()}
           >
              <h2 className="text-amber-500 font-['Roboto_Mono'] font-bold text-center mb-4 uppercase tracking-widest border-b border-zinc-800 pb-2">
                Secret Tape Stash
              </h2>
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentThemeId(theme.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`relative p-2 rounded-lg border-2 transition-all flex flex-col items-center gap-2 group ${
                      currentThemeId === theme.id 
                        ? 'border-white bg-white/10' 
                        : 'border-transparent hover:bg-zinc-800'
                    }`}
                  >
                    {/* Mini Cassette Preview */}
                    <div 
                      className="w-full h-8 rounded relative shadow-sm overflow-hidden" 
                      style={{ background: theme.colors.body }}
                    >
                      <div className="absolute top-1 left-[10%] right-[10%] h-[60%] rounded-sm" style={{ background: theme.colors.label }}>
                        <div className="h-1 w-full" style={{ background: theme.colors.header }}></div>
                      </div>
                    </div>
                    
                    <span className={`font-mono text-[10px] uppercase truncate w-full text-center ${currentThemeId === theme.id ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-600 text-center mt-4 italic">
                Click title 5x to re-open
              </p>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;