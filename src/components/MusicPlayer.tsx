import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "NEON_DRIFTER.WAV",
    artist: "AI_GEN_01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "CYBER_PULSE.MP3",
    artist: "AI_GEN_02",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "VOID_RESONANCE.FLAC",
    artist: "AI_GEN_03",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(20).fill(10));
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play error:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  // Fake visualizer effect
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setVisualizerData(prev => prev.map(() => Math.random() * 100));
      }, 150);
    } else {
      setVisualizerData(Array(20).fill(10));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border-2 border-[#ff00ff] bg-[#050505] relative shadow-[0_0_20px_rgba(255,0,255,0.2)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[#ff00ff] text-lg font-bold uppercase tracking-widest glitch" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[#00ffff] text-sm uppercase tracking-wider opacity-80">
            {currentTrack.artist}
          </p>
        </div>
        <div className="text-xs text-gray-400 uppercase">
          {isPlaying ? 'PLAYING' : 'STOPPED'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-900 mb-4 relative overflow-hidden border border-gray-800">
        <div 
          className="h-full bg-[#00ffff] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button onClick={prevTrack} className="text-white hover:text-[#00ffff] transition-colors cursor-pointer">
            <SkipBack size={24} />
          </button>
          <button onClick={togglePlay} className="text-[#ff00ff] hover:text-white transition-colors cursor-pointer">
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button onClick={nextTrack} className="text-white hover:text-[#00ffff] transition-colors cursor-pointer">
            <SkipForward size={24} />
          </button>
        </div>
        
        <button onClick={toggleMute} className="text-gray-400 hover:text-[#ff00ff] transition-colors cursor-pointer">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      {/* Visualizer fake bars */}
      <div className="mt-4 flex gap-1 h-8 items-end opacity-50">
        {visualizerData.map((val, i) => (
          <div 
            key={i} 
            className="w-full bg-[#ff00ff]"
            style={{ 
              height: `${val}%`,
              transition: 'height 0.15s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
