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

function formatMs(ms) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
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
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: 88,
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid #1e1e2e",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        gap: "1rem",
        zIndex: 100,
      }}
    >
      {/* Track info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          width: 240,
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "0.5rem",
            overflow: "hidden",
            flexShrink: 0,
            background: "#1e1e2e",
          }}
        >
          {image && (
            <img
              src={image}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              color: "#e8e8f0",
              fontSize: "0.875rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentTrack.name}
          </p>
          <p
            style={{
              color: "#6b6b80",
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {artists}
          </p>
        </div>
      </div>

      {/* Center controls */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <button
            onClick={skipPrev}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b6b80",
              display: "flex",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b80")}
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#6c63ff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(108,99,255,0.5)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.08)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {isPlaying ? (
              <Pause size={18} color="white" fill="white" />
            ) : (
              <Play
                size={18}
                color="white"
                fill="white"
                style={{ marginLeft: 2 }}
              />
            )}
          </button>

          <button
            onClick={skipNext}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b6b80",
              display: "flex",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8f0")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b80")}
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        {/* Progress bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            width: "100%",
            maxWidth: 500,
          }}
        >
          <span
            style={{
              color: "#6b6b80",
              fontSize: "0.75rem",
              fontFamily: "JetBrains Mono, monospace",
              minWidth: 36,
              textAlign: "right",
            }}
          >
            {formatMs(localProgress)}
          </span>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={localProgress}
              onChange={handleSeek}
              onMouseDown={() => setDragging(true)}
              onMouseUp={() => setDragging(false)}
              style={{ width: "100%", "--progress": `${pct}%` }}
            />
          </div>
          <span
            style={{
              color: "#6b6b80",
              fontSize: "0.75rem",
              fontFamily: "JetBrains Mono, monospace",
              minWidth: 36,
            }}
          >
            {formatMs(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          width: 180,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={toggleMute}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b6b80",
            display: "flex",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8e8f0")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b6b80")}
        >
          {muted || volume === 0 ? (
            <VolumeX size={18} />
          ) : (
            <Volume2 size={18} />
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
          style={{ width: 100, "--progress": `${muted ? 0 : volume}%` }}
        />
      </div>
    </div>
  );
}
