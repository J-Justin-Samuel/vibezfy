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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white brutal-border shadow-[12px_12px_0px_0px_rgba(108,99,255,1)] w-full max-w-lg p-8 relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 brutal-btn bg-white px-2 py-2"
        >
          <X size={24} />
        </button>

        <div className="mb-6 border-b-4 border-black pb-4">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter">
            Vibe_Scan_01
          </h2>
          <p className="font-bold text-xs uppercase text-purple-600">
            Calibration Protocol Active
          </p>
        </div>

        {/* CAMERA FEED AREA */}
        <div className="bg-black brutal-border aspect-video mb-6 relative overflow-hidden flex items-center justify-center">
          {state === STATES.CAMERA || state === STATES.DETECTING ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <div className="text-white text-center p-8">
              <Camera size={48} className="mx-auto mb-4" />
              <p className="font-black uppercase text-sm">
                Waiting_For_Input_Signal
              </p>
            </div>
          )}

          {/* Scanning Overlay Effect */}
          <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20 opacity-30 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)] bg-[length:100%_4px]" />

          {countdown > 0 && state === STATES.CAMERA && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-8xl font-black text-amber-400 drop-shadow-2xl">
                {countdown}
              </span>
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col gap-4">
          {state === STATES.INIT && (
            <button
              onClick={startDetection}
              className="brutal-btn bg-purple-500 text-white text-xl py-4"
            >
              INITIATE_FACIAL_SCAN
            </button>
          )}

          {state === STATES.RESULT && mood && (
            <div className="space-y-4">
              <div className="bg-amber-400 brutal-border p-4 flex justify-between items-center">
                <span className="font-black text-2xl uppercase italic">
                  {mood.mood}
                </span>
                <span className="font-mono text-sm">
                  CONF: {Math.round(mood.confidence * 100)}%
                </span>
              </div>
              <button
                onClick={handlePlayPlaylist}
                className="brutal-btn bg-black text-white w-full py-4 text-xl"
              >
                LOAD_MATCHING_VIBE →
              </button>
            </div>
          )}

          {state === STATES.ERROR && (
            <div className="bg-red-400 brutal-border p-4 text-center">
              <p className="font-black uppercase mb-4">{error}</p>
              <button onClick={reset} className="brutal-btn bg-white w-full">
                RETRY_SCAN
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
