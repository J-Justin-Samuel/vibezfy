import React, { useState } from "react";
import { useSpotify } from "../../contexts/SpotifyContext";
import { Play, Pause } from "lucide-react";

export default function SongCard({ track }) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useSpotify();
  const isThisPlaying = currentTrack?.id === track.id && isPlaying;

  return (
    <div
      onClick={() => (isThisPlaying ? togglePlay() : playTrack(track))}
      className={`group bg-white brutal-border brutal-shadow-hover p-3 cursor-pointer relative ${isThisPlaying ? "bg-amber-100" : ""}`}
    >
      <div className="brutal-border bg-black aspect-square mb-3 relative overflow-hidden">
        <img
          src={track.album?.images?.[0]?.url}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isThisPlaying ? "opacity-70" : ""}`}
          alt=""
        />
        {isThisPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-500/40">
            <div className="flex gap-1 h-8 items-end">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-white animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <h3 className="font-black text-sm uppercase truncate">{track.name}</h3>
      <p className="font-bold text-[10px] text-gray-500 uppercase truncate">
        {track.artists?.[0]?.name}
      </p>

      {/* Floating Play Button */}
      <div className="absolute -right-2 -bottom-2 bg-white brutal-border w-10 h-10 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
        {isThisPlaying ? (
          <Pause size={16} fill="currentColor" />
        ) : (
          <Play size={16} fill="currentColor" />
        )}
      </div>
    </div>
  );
}
