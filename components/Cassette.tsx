import React from 'react';
import { PlayerState, Song, CassetteTheme } from '../types';

interface CassetteProps {
  playerState: PlayerState;
  currentSong: Song | null;
  theme: CassetteTheme;
  onClick?: () => void;
}

const Cassette: React.FC<CassetteProps> = ({ playerState, currentSong, theme, onClick }) => {
  const isPlaying = playerState === PlayerState.PLAYING;

  return (
    <div 
      onClick={onClick}
      className="relative w-full max-w-[400px] aspect-[1.6] bg-[#111] rounded-[20px] shadow-[0_0_20px_rgba(0,0,0,0.8)] p-2 select-none transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
    >
      {/* Tape Body */}
      <div 
        className="relative w-full h-full rounded-[15px] shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col items-center transition-all duration-500"
        style={{ background: theme.colors.body }}
      >
        
        {/* Screw Top Left */}
        <div className="absolute top-2 left-2 w-3 h-3 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center" style={{ background: theme.colors.screw }}>
             <div className="w-full h-[1px] bg-black/40 rotate-45"></div>
             <div className="h-full w-[1px] bg-black/40 rotate-45 absolute"></div>
        </div>
        {/* Screw Top Right */}
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center" style={{ background: theme.colors.screw }}>
             <div className="w-full h-[1px] bg-black/40 rotate-12"></div>
             <div className="h-full w-[1px] bg-black/40 rotate-12 absolute"></div>
        </div>
        {/* Screw Bottom Left */}
        <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center" style={{ background: theme.colors.screw }}>
             <div className="w-full h-[1px] bg-black/40 -rotate-45"></div>
             <div className="h-full w-[1px] bg-black/40 -rotate-45 absolute"></div>
        </div>
        {/* Screw Bottom Right */}
        <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] flex items-center justify-center" style={{ background: theme.colors.screw }}>
             <div className="w-full h-[1px] bg-black/40 rotate-90"></div>
             <div className="h-full w-[1px] bg-black/40 rotate-90 absolute"></div>
        </div>

        {/* Label Area */}
        <div 
          className="relative w-[90%] h-[65%] mt-4 rounded-md shadow-md flex flex-col items-center justify-start overflow-hidden transition-all duration-500"
          style={{ background: theme.colors.label }}
        >
          {/* Header Strip */}
          <div className="w-full h-6 mb-1 transition-all duration-500" style={{ background: theme.colors.header }}></div>
          
          {/* Handwriting Title - Marquee effect */}
          <div className="w-full px-4 text-center overflow-hidden">
             <div className={`${currentSong ? 'animate-marquee inline-block whitespace-nowrap' : ''}`}>
               <h2 className="font-['Permanent_Marker'] text-slate-800 text-lg leading-tight mix-blend-multiply opacity-90">
                 {currentSong ? currentSong.title : "No Cassette Loaded"}
               </h2>
             </div>
             <p className="font-['Permanent_Marker'] text-slate-500 text-xs truncate mix-blend-multiply">
                {currentSong ? currentSong.artist : "Insert Tape"}
             </p>
          </div>

          {/* Window Cutout */}
          <div className="relative w-[70%] h-[50%] mt-2 bg-[#2a2a2a] rounded-[30px] flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)] border-2 border-[#999]">
             
             {/* Left Spool */}
             <div className="absolute left-3 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
                <div 
                  className={`w-full h-full border-[4px] border-dashed border-white rounded-full ${isPlaying ? 'animate-spin-reverse' : ''}`}
                  style={{ animationDuration: '3s' }}
                ></div>
                <div className="absolute w-2 h-2 bg-white rounded-full"></div>
             </div>

             {/* Right Spool */}
             <div className="absolute right-3 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center overflow-hidden">
                <div 
                   className={`w-full h-full border-[4px] border-dashed border-white rounded-full ${isPlaying ? 'animate-spin-reverse' : ''}`}
                   style={{ animationDuration: '3.1s' }}
                ></div>
                <div className="absolute w-2 h-2 bg-white rounded-full"></div>
             </div>
             
             {/* Tape Window / Middle transparent part */}
             <div className="w-[40%] h-[60%] bg-[#4a4a4a]/50 backdrop-blur-sm z-10 rounded"></div>
          </div>
        </div>

        {/* Bottom Trapezoid / Magnetic Tape Area */}
        <div className="absolute bottom-0 w-[60%] h-[20%] flex justify-center items-end pb-2 overflow-hidden transition-all duration-500" 
             style={{ 
               background: theme.colors.dark,
               clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
               boxShadow: 'inset 0 10px 10px -10px rgba(0,0,0,0.5)'
             }}>
           
           {/* Animated Tape Strip */}
           <div className="w-full h-[12px] relative overflow-hidden">
             <div 
               className={`w-full h-full ${isPlaying ? 'animate-tape-scroll' : ''}`}
               style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, #3a3a3a 0px, #3a3a3a 10px, #555 10px, #555 20px)',
                  backgroundSize: '20px 100%'
               }}
             ></div>
           </div>
        </div>
        
        {/* Hover Text Hint */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 rounded-[15px]">
            <span className="font-['Permanent_Marker'] text-white text-xl tracking-widest border-2 border-white/50 px-4 py-2 rounded rotate-[-3deg] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                VIEW QUEUE
            </span>
        </div>

      </div>
    </div>
  );
};

export default Cassette;