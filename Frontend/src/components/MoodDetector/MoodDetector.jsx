import React, { useRef, useState, useEffect, useCallback } from "react";
import { loadModels, detectMood, getMoodMeta } from "../../utils/moodDetection";
import { spotify } from "../../utils/spotify";
import { useSpotify } from "../../contexts/SpotifyContext";
import { X, Camera, RefreshCw, Loader } from "lucide-react";

const STATES = {
  INIT: "init",
  LOADING_MODELS: "loading_models",
  CAMERA: "camera",
  DETECTING: "detecting",
  RESULT: "result",
  LOADING_PLAYLIST: "loading_playlist",
  ERROR: "error",
};

export default function MoodDetector({ onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const [state, setState] = useState(STATES.INIT);
  const [mood, setMood] = useState(null); // { mood, confidence, all }
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(3);
  const { playPlaylist } = useSpotify();

  // ── Cleanup on unmount ──────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopCamera();
      clearInterval(intervalRef.current);
    };
  }, []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  // ── Start flow ──────────────────────────────────────────────────────────
  const startDetection = useCallback(async () => {
    setError("");
    setState(STATES.LOADING_MODELS);

    try {
      await loadModels();
    } catch {
      setError("Failed to load AI models. Check your connection.");
      setState(STATES.ERROR);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setState(STATES.CAMERA);

      // Countdown then detect
      let count = 3;
      setCountdown(count);
      const timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          runDetection();
        }
      }, 1000);
    } catch (err) {
      setError("Could not access camera. Please allow camera permission.");
      setState(STATES.ERROR);
    }
  }, []);

  const runDetection = async () => {
    setState(STATES.DETECTING);
    const video = videoRef.current;
    if (!video) return;

    let detected = null;
    // Try a few times in case face not ready
    for (let i = 0; i < 5; i++) {
      detected = await detectMood(video);
      if (detected) break;
      await new Promise((r) => setTimeout(r, 300));
    }

    stopCamera();

    if (!detected) {
      setError(
        "Couldn't detect a face. Make sure your face is well-lit and visible.",
      );
      setState(STATES.ERROR);
      return;
    }

    setMood(detected);
    setState(STATES.RESULT);
    loadMoodPlaylist(detected.mood);
  };

  const loadMoodPlaylist = async (detectedMood) => {
    setState(STATES.LOADING_PLAYLIST);
    try {
      const data = await spotify.searchPlaylistByMood(detectedMood);
      const playlists = data?.playlists?.items?.filter(Boolean) || [];
      if (playlists.length > 0) {
        const chosen =
          playlists[Math.floor(Math.random() * Math.min(3, playlists.length))];
        setPlaylist(chosen);
      }
    } catch (e) {
      console.error(e);
    }
    setState(STATES.RESULT);
  };

  const handlePlayPlaylist = async () => {
    if (!playlist) return;
    try {
      const data = await spotify.getPlaylistTracks(playlist.id, 20);
      const tracks = (data?.items || [])
        .map((i) => i.track)
        .filter((t) => t?.uri);
      await playPlaylist(tracks);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const reset = () => {
    stopCamera();
    clearInterval(intervalRef.current);
    setMood(null);
    setPlaylist(null);
    setError("");
    setCountdown(3);
    setState(STATES.INIT);
  };

  const moodMeta = mood ? getMoodMeta(mood.mood) : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#111118",
          border: "1px solid #1e1e2e",
          borderRadius: "1.5rem",
          padding: "2rem",
          width: "90%",
          maxWidth: 520,
          position: "relative",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b6b80",
            display: "flex",
          }}
        >
          <X size={20} />
        </button>

        <h2
          style={{
            fontFamily: "Clash Display, sans-serif",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#e8e8f0",
            marginBottom: "0.5rem",
          }}
        >
          Detect Your Vibe 🎭
        </h2>
        <p
          style={{
            color: "#6b6b80",
            fontFamily: "DM Sans, sans-serif",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
          }}
        >
          Let AI read your mood and play the perfect playlist
        </p>

        {/* ── INIT ── */}
        {state === STATES.INIT && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎭</div>
            <p
              style={{
                color: "#6b6b80",
                fontFamily: "DM Sans, sans-serif",
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
              }}
            >
              We'll use your front camera for 3 seconds to detect your mood. No
              data is saved.
            </p>
            <button
              className="btn-primary"
              onClick={startDetection}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Camera size={18} />
              Start Vibe Detection
            </button>
          </div>
        )}

        {/* ── LOADING MODELS ── */}
        {state === STATES.LOADING_MODELS && (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <Loader
              size={40}
              color="#6c63ff"
              style={{
                animation: "spin 1s linear infinite",
                margin: "0 auto 1rem",
              }}
            />
            <p style={{ color: "#6b6b80", fontFamily: "DM Sans, sans-serif" }}>
              Loading AI models...
            </p>
          </div>
        )}

        {/* ── CAMERA + DETECTING ── */}
        {(state === STATES.CAMERA || state === STATES.DETECTING) && (
          <div>
            <div
              style={{
                position: "relative",
                borderRadius: "1rem",
                overflow: "hidden",
                background: "#000",
                marginBottom: "1rem",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  display: "block",
                  transform: "scaleX(-1)",
                }}
              />
              {state === STATES.CAMERA && countdown > 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.4)",
                  }}
                >
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "rgba(108,99,255,0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Clash Display, sans-serif",
                      fontSize: "2.5rem",
                      fontWeight: 700,
                      color: "white",
                      boxShadow: "0 0 40px rgba(108,99,255,0.6)",
                    }}
                  >
                    {countdown}
                  </div>
                </div>
              )}
              {state === STATES.DETECTING && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(0,0,0,0.6)",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      alignItems: "flex-end",
                      height: 32,
                    }}
                  >
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="waveform-bar"
                        style={{
                          height: `${12 + (i % 3) * 8}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      color: "white",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    Analyzing your vibe...
                  </p>
                </div>
              )}
            </div>
            <p
              style={{
                color: "#6b6b80",
                textAlign: "center",
                fontSize: "0.85rem",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              {state === STATES.CAMERA
                ? `Detecting in ${countdown}...`
                : "Reading your expressions..."}
            </p>
          </div>
        )}

        {/* ── RESULT ── */}
        {(state === STATES.RESULT || state === STATES.LOADING_PLAYLIST) &&
          mood && (
            <div>
              {/* Mood display */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  background: `${moodMeta.color}15`,
                  border: `1px solid ${moodMeta.color}30`,
                  borderRadius: "1rem",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div style={{ fontSize: "3rem" }}>{moodMeta.emoji}</div>
                <div>
                  <p
                    style={{
                      fontFamily: "Clash Display, sans-serif",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: moodMeta.color,
                    }}
                  >
                    {moodMeta.label}
                  </p>
                  <p
                    style={{
                      color: "#6b6b80",
                      fontSize: "0.85rem",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    {Math.round(mood.confidence * 100)}% confidence
                  </p>
                </div>

                {/* Mini expression bars */}
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    minWidth: 120,
                  }}
                >
                  {Object.entries(mood.all)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([expr, val]) => (
                      <div
                        key={expr}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            color: "#6b6b80",
                            fontSize: "0.7rem",
                            width: 56,
                            textAlign: "right",
                            fontFamily: "DM Sans, sans-serif",
                            textTransform: "capitalize",
                          }}
                        >
                          {expr}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: 4,
                            background: "#1e1e2e",
                            borderRadius: 2,
                          }}
                        >
                          <div
                            style={{
                              width: `${val * 100}%`,
                              height: "100%",
                              background: getMoodMeta(expr).color,
                              borderRadius: 2,
                              transition: "width 0.5s",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Playlist */}
              {state === STATES.LOADING_PLAYLIST && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    color: "#6b6b80",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Finding the perfect playlist...
                </div>
              )}

              {state === STATES.RESULT && playlist && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    background: "#16161f",
                    borderRadius: "1rem",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <img
                    src={playlist.images?.[0]?.url}
                    alt={playlist.name}
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "0.5rem",
                      objectFit: "cover",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontWeight: 500,
                        color: "#e8e8f0",
                        marginBottom: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {playlist.name}
                    </p>
                    <p
                      style={{
                        color: "#6b6b80",
                        fontSize: "0.8rem",
                        fontFamily: "DM Sans, sans-serif",
                      }}
                    >
                      {playlist.tracks?.total} tracks · {moodMeta.label}{" "}
                      playlist
                    </p>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                {playlist && (
                  <button
                    className="btn-primary"
                    onClick={handlePlayPlaylist}
                    style={{ flex: 1 }}
                  >
                    Play This Vibe ▶
                  </button>
                )}
                <button
                  className="btn-ghost"
                  onClick={reset}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <RefreshCw size={16} />
                  Retry
                </button>
              </div>
            </div>
          )}

        {/* ── ERROR ── */}
        {state === STATES.ERROR && (
          <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</div>
            <p
              style={{
                color: "#f87171",
                fontFamily: "DM Sans, sans-serif",
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </p>
            <button
              className="btn-primary"
              onClick={reset}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
