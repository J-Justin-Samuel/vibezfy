import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  spotify,
  getAccessToken,
  refreshAccessToken,
  isTokenExpired,
} from "../utils/spotify";

const SpotifyContext = createContext(null);

export function SpotifyProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [queue, setQueue] = useState([]);
  const progressInterval = useRef(null);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    setIsConnected(true);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const sdkPlayer = new window.Spotify.Player({
        name: "Vibezfy Web Player",
        getOAuthToken: async (cb) => {
          if (isTokenExpired()) {
            const newToken = await refreshAccessToken();
            cb(newToken);
          } else {
            cb(getAccessToken());
          }
        },
        volume: volume / 100,
      });

      sdkPlayer.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        console.log("🎵 Vibezfy player ready, device:", device_id);
      });

      sdkPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;
        const track = state.track_window.current_track;
        setCurrentTrack(track);
        setIsPlaying(!state.paused);
        setDuration(state.duration);
        setProgress(state.position);
      });

      sdkPlayer.connect();
      setPlayer(sdkPlayer);
    };

    // Load Spotify SDK script
    if (!document.getElementById("spotify-sdk")) {
      const script = document.createElement("script");
      script.id = "spotify-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      document.body.appendChild(script);
    }

    return () => {
      if (player) player.disconnect();
    };
  }, [isConnected]);

  // Progress ticker
  useEffect(() => {
    clearInterval(progressInterval.current);
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((p) => Math.min(p + 1000, duration));
      }, 1000);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying, duration]);

  const playTrack = useCallback(
    async (track) => {
      if (!deviceId) return;
      await spotify.play(deviceId, [track.uri]);
      setCurrentTrack(track);
      setIsPlaying(true);
      setProgress(0);
    },
    [deviceId],
  );

  const playPlaylist = useCallback(
    async (tracks) => {
      if (!deviceId || !tracks.length) return;
      const uris = tracks.map((t) => t.uri || t.track?.uri).filter(Boolean);
      await spotify.play(deviceId, uris);
      setIsPlaying(true);
      setProgress(0);
    },
    [deviceId],
  );

  const togglePlay = useCallback(async () => {
    if (!player) return;
    await player.togglePlay();
  }, [player]);

  const skipNext = useCallback(async () => {
    if (!player) return;
    await player.nextTrack();
  }, [player]);

  const skipPrev = useCallback(async () => {
    if (!player) return;
    await player.previousTrack();
  }, [player]);

  const seekTo = useCallback(
    async (posMs) => {
      if (!player) return;
      await player.seek(posMs);
      setProgress(posMs);
    },
    [player],
  );

  const changeVolume = useCallback(
    async (vol) => {
      setVolume(vol);
      if (player) await player.setVolume(vol / 100);
    },
    [player],
  );

  return (
    <SpotifyContext.Provider
      value={{
        isConnected,
        setIsConnected,
        player,
        deviceId,
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        queue,
        setQueue,
        playTrack,
        playPlaylist,
        togglePlay,
        skipNext,
        skipPrev,
        seekTo,
        changeVolume,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const ctx = useContext(SpotifyContext);
  if (!ctx) throw new Error("useSpotify must be used inside SpotifyProvider");
  return ctx;
}
