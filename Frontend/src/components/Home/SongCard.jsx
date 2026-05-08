import React, { useState } from "react";
import { useSpotify } from "../../contexts/SpotifyContext";
import { Play, Pause } from "lucide-react";

export default function SongCard({ track }) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = useSpotify();
  const [hovered, setHovered] = useState(false);

  if (!track) return null;

  const image = track.album?.images?.[0]?.url;
  const artists = track.artists?.map((a) => a.name).join(", ");
  const isCurrentTrack =
    currentTrack?.id === track.id || currentTrack?.uri === track.uri;
  const isThisPlaying = isCurrentTrack && isPlaying;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <div
      className="song-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handlePlay}
      style={{
        border: isCurrentTrack
          ? "1px solid rgba(108,99,255,0.4)"
          : "1px solid transparent",
      }}
    >
      {/* Cover art */}
      <div style={{ position: "relative", marginBottom: "0.75rem" }}>
        <div
          style={{
            aspectRatio: "1",
            borderRadius: "0.75rem",
            overflow: "hidden",
            background: "#1e1e2e",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={track.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s",
                transform: hovered ? "scale(1.05)" : "scale(1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
              }}
            >
              🎵
            </div>
          )}
        </div>

        {/* Play button overlay */}
        <button
          onClick={handlePlay}
          style={{
            position: "absolute",
            bottom: 8,
            right: 8,
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#6c63ff",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(108,99,255,0.5)",
            transition: "all 0.2s",
            opacity: hovered || isThisPlaying ? 1 : 0,
            transform:
              hovered || isThisPlaying
                ? "translateY(0) scale(1)"
                : "translateY(4px) scale(0.9)",
          }}
        >
          {isThisPlaying ? (
            <Pause size={16} color="white" fill="white" />
          ) : (
            <Play
              size={16}
              color="white"
              fill="white"
              style={{ marginLeft: 2 }}
            />
          )}
        </button>

        {/* Now playing indicator */}
        {isThisPlaying && (
          <div
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              display: "flex",
              gap: 2,
              alignItems: "flex-end",
              height: 16,
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="waveform-bar"
                style={{
                  height: `${8 + (i % 3) * 4}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 500,
          color: isCurrentTrack ? "#6c63ff" : "#e8e8f0",
          fontSize: "0.875rem",
          marginBottom: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {track.name}
      </p>
      <p
        style={{
          color: "#6b6b80",
          fontSize: "0.8rem",
          fontFamily: "DM Sans, sans-serif",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {artists}
      </p>
    </div>
  );
}
