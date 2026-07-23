"use client"
import React, { useState, useRef } from "react"
import ReactPlayer from "react-player"
import { Play, Pause, Rewind, FastForward, Volume2, VolumeX } from "lucide-react"

interface CustomVideoPlayerProps {
  url: string
}

export function CustomVideoPlayer({ url }: CustomVideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [played, setPlayed] = useState(0)
  const playerRef = useRef<any>(null)

  const handlePlayPause = () => setPlaying(!playing)
  
  const handleRewind = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10)
    }
  }
  
  const handleFastForward = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10)
    }
  }

  const handleProgress = (state: { played: number }) => {
    setPlayed(state.played)
  }

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value))
    if (playerRef.current) {
      playerRef.current.seekTo(parseFloat(e.target.value))
    }
  }

  const Player = ReactPlayer as any;

  return (
    <div className="relative w-full h-full group bg-black overflow-hidden rounded-xl border-4 border-slate-900 shadow-[8px_8px_0px_rgba(0,43,92,1)]">
      {/* Player */}
      <div className="absolute inset-0 pointer-events-none">
        <Player
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={playing}
          muted={muted}
          onProgress={handleProgress as any}
          controls={false}
          config={{
            youtube: {
              playerVars: { modestbranding: 1, rel: 0, showinfo: 0, iv_load_policy: 3, disablekb: 1 }
            }
          } as any}
        />
      </div>

      {/* Transparent overlay to completely block clicks on the video */}
      <div className="absolute inset-0 z-10 cursor-pointer" onClick={handlePlayPause}></div>

      {/* Custom Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 flex flex-col gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        
        {/* Progress Bar */}
        <input 
          type="range" 
          min={0} max={0.999999} step="any"
          value={played}
          onChange={handleSeekChange}
          className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-mlh-yellow relative z-30"
          style={{ pointerEvents: 'auto' }}
        />

        {/* Buttons */}
        <div className="flex items-center gap-6 text-white relative z-30" style={{ pointerEvents: 'auto' }}>
          <button onClick={handleRewind} className="hover:text-mlh-yellow transition">
            <Rewind size={24} />
          </button>
          
          <button onClick={handlePlayPause} className="hover:text-mlh-yellow transition">
            {playing ? <Pause size={32} /> : <Play size={32} fill="currentColor" />}
          </button>
          
          <button onClick={handleFastForward} className="hover:text-mlh-yellow transition">
            <FastForward size={24} />
          </button>
          
          <div className="flex-grow"></div>
          
          <button onClick={() => setMuted(!muted)} className="hover:text-mlh-yellow transition">
            {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </div>
      
      {/* Big Play Button when paused */}
      {!playing && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
        >
          <div className="bg-mlh-blue/90 text-white rounded-full p-6 backdrop-blur-sm border-2 border-white/20 shadow-xl">
            <Play size={48} fill="currentColor" className="ml-2" />
          </div>
        </div>
      )}
    </div>
  )
}
