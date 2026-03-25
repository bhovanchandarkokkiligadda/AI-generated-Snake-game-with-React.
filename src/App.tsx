import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono relative flicker">
      <div className="scanlines"></div>
      
      <main className="container mx-auto px-4 py-8 lg:py-16 relative z-10 flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center min-h-screen">
        
        {/* Left Column: Title & Music */}
        <div className="flex flex-col gap-8 w-full max-w-md">
          <header className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold mb-2 glitch text-[#00ffff]" data-text="GLITCH">
              GLITCH
            </h1>
            <h1 className="text-5xl lg:text-7xl font-bold mb-4 glitch text-[#ff00ff]" data-text="SNAKE">
              SNAKE
            </h1>
            <p className="text-gray-400 uppercase tracking-widest text-sm">
              v2.0.4 // SYSTEM.ONLINE
            </p>
          </header>

          <MusicPlayer />
          
          <div className="hidden lg:block border border-gray-800 p-4 bg-black/50 text-xs text-gray-500 uppercase">
            <p className="mb-2 text-[#00ffff]">&gt; INITIALIZING PROTOCOLS...</p>
            <p className="mb-2">&gt; LOADING AUDIO MODULES... OK</p>
            <p className="mb-2">&gt; CONNECTING TO MAINFRAME... OK</p>
            <p className="animate-pulse text-[#ff00ff]">&gt; AWAITING USER INPUT_</p>
          </div>
        </div>

        {/* Right Column: Game */}
        <div className="w-full max-w-md">
          <SnakeGame />
        </div>

      </main>
    </div>
  );
}
