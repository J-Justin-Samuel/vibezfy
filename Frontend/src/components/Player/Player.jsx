import React, { useState, useEffect } from "react";
import { useSpotify } from "../../contexts/SpotifyContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

// Updated terminal-style formatting
function formatMs(ms) {
  const s = Math.floor(ms / 1000);
  // Pad with leading zeros for that digital clock feel
  const minutes = String(Math.floor(s / 60)).padStart(2, "0");
  const seconds = String(s % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function Player() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    skipNext,
    skipPrev,
    seekTo,
    changeVolume,
  } = useSpotify();
  const [dragging, setDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(70);

  useEffect(() => {
    if (!dragging) setLocalProgress(progress);
  }, [progress, dragging]);

  if (!currentTrack) return null;

  const image = currentTrack.album?.images?.[0]?.url;
  const artists = currentTrack.artists?.map((a) => a.name).join(", ");
  const pct = duration > 0 ? (localProgress / duration) * 100 : 0;

  const handleSeek = (e) => {
    const val = parseInt(e.target.value);
    setLocalProgress(val);
    seekTo(val);
  };

  const toggleMute = () => {
    if (muted) {
      changeVolume(prevVolume);
      setMuted(false);
    } else {
      setPrevVolume(volume);
      changeVolume(0);
      setMuted(true);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 md:left-64 right-0 z-[100] bg-white border-t-4 md:border-t-8 border-black p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6 brutal-shadow transition-all">
      {/* 1. Track Info Section (Stacks on Mobile) */}
      <div className="flex items-center gap-3 w-full md:w-auto md:min-w-[280px]">
        <div className="w-16 h-16 md:w-[60px] md:h-[60px] border-4 md:border-2 border-black shrink-0 overflow-hidden bg-black flex items-center justify-center">
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-2xl">💿</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-black text-sm md:text-base uppercase tracking-tight truncate leading-none mb-1">
            {currentTrack.name}
          </p>
          <p className="font-bold text-[10px] md:text-xs text-gray-500 uppercase truncate">
            {artists}
          </p>
        </div>
      </div>

      {/* 2. Main Controls Section (Flexible Grid/Column) */}
      <div className="flex-1 w-full flex flex-col md:flex-row items-center gap-2 md:gap-4">
        {/* Buttons (Center Aligned) */}
        <div className="flex items-center gap-6 md:gap-4 order-2 md:order-1">
          <button
            onClick={skipPrev}
            className="text-gray-500 hover:text-black hover:scale-110 active:scale-95 transition-all"
          >
            <SkipBack size={20} className="fill-current" strokeWidth={3} />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 md:w-12 md:h-12 border-4 border-black bg-purple-500 hover:bg-purple-600 text-white flex items-center justify-center brutal-shadow active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          >
            {isPlaying ? (
              <Pause size={24} className="fill-white" strokeWidth={0} />
            ) : (
              <Play size={24} className="fill-white ml-1" strokeWidth={0} />
            )}
          </button>

          <button
            onClick={skipNext}
            className="text-gray-500 hover:text-black hover:scale-110 active:scale-95 transition-all"
          >
            <SkipForward size={20} className="fill-current" strokeWidth={3} />
          </button>
        </div>

        {/* 3. Progress Bar Section (Flexible width) */}
        <div className="w-full flex items-center gap-3 order-1 md:order-2 border-t-2 md:border-t-0 border-black pt-2 md:pt-0">
          {/* Terminal Style Time Stamps */}
          <span className="font-mono text-xs font-black text-purple-700 w-14 text-right bg-black text-green-400 p-1 border-2 border-black">
            {formatMs(localProgress)}
          </span>
          <div className="flex-1 relative flex items-center group">
            {/* The actual slider input, styled on global.css */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={localProgress}
              onChange={handleSeek}
              onMouseDown={() => setDragging(true)}
              onMouseUp={() => setDragging(false)}
              className="brutal-slider w-full"
              style={{ "--progress": `${pct}%` }}
            />
          </div>
          <span className="font-mono text-xs font-black text-purple-700 w-14 bg-black text-green-400 p-1 border-2 border-black">
            {formatMs(duration)}
          </span>
        </div>
      </div>

      {/* 4. Volume Section (Hidden on narrow mobile, shown on md up) */}
      <div className="hidden lg:flex items-center gap-3 w-[160px] justify-end border-l-2 border-black pl-4">
        <button
          onClick={toggleMute}
          className="text-gray-500 hover:text-black transition-colors"
        >
          {muted || volume === 0 ? (
            <VolumeX size={18} strokeWidth={3} />
          ) : (
            <Volume2 size={18} strokeWidth={3} />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onChange={(e) => {
            changeVolume(parseInt(e.target.value));
            setMuted(false);
          }}
          className="brutal-volume-slider w-20"
          style={{ "--progress": `${muted ? 0 : volume}%` }}
        />
      </div>
    </div>
  );
}
