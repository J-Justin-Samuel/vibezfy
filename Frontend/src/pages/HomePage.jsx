import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSpotify } from "../contexts/SpotifyContext";
import {
  spotify,
  getAccessToken,
  initiateSpotifyLogin,
} from "../utils/spotify";
import SongCard from "../components/Home/SongCard";
import PlaylistCard from "../components/Home/PlaylistCard";
import MoodDetector from "../components/MoodDetector/MoodDetector";
import { Sparkles, LogOut, Zap } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { isConnected } = useSpotify();
  const navigate = useNavigate();

  const [featured, setFeatured] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMood, setShowMood] = useState(false);

  const firstName = user?.displayName?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (!isConnected || !getAccessToken()) {
      setLoading(false);
      return;
    }
    Promise.all([
      spotify.getFeaturedPlaylists(6),
      spotify.getNewReleases(10),
      spotify.getTopTracks(10),
    ])
      .then(([fp, nr, tt]) => {
        setFeatured(fp?.playlists?.items || []);
        setNewReleases(nr?.albums?.items || []);
        setTopTracks(tt?.items || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isConnected]);

  const SkeletonCard = () => (
    <div
      style={{
        background: "#16161f",
        borderRadius: "1rem",
        padding: "1rem",
        height: 220,
      }}
      className="animate-pulse"
    >
      <div
        style={{
          background: "#1e1e2e",
          borderRadius: "0.75rem",
          height: 140,
          marginBottom: "0.75rem",
        }}
      />
      <div
        style={{
          background: "#1e1e2e",
          borderRadius: 4,
          height: 14,
          width: "70%",
          marginBottom: 8,
        }}
      />
      <div
        style={{
          background: "#1e1e2e",
          borderRadius: 4,
          height: 12,
          width: "40%",
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0EBE0] text-black font-sans p-4 md:p-8">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="bg-amber-400 brutal-border px-3 py-1 inline-block mb-2 text-xs font-black uppercase">
            {greeting}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            {firstName}
            <span className="text-purple-500">.</span>
          </h1>
        </div>

        <button
          onClick={() => navigate("/logout")}
          className="brutal-btn brutal-btn brutal-btn-hover bg-red-400 flex items-center gap-2 text-sm"
        >
          <LogOut size={18} /> Exit_System
        </button>
      </header>

      {/* ACTION BANNER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <div className="lg:col-span-8 bg-white brutal-border brutal-shadow p-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black uppercase italic leading-none mb-2">
              {!isConnected
                ? "System_Status: Disconnected"
                : "System_Status: Online"}
            </h2>
            <p className="font-bold text-gray-600 max-w-md">
              {!isConnected
                ? "Spotify link required to calibrate AI mood sensors and access global frequency database."
                : "Mood detection arrays are primed and ready for facial analysis."}
            </p>
          </div>
          {!isConnected ? (
            <button
              onClick={initiateSpotifyLogin}
              className="brutal-btn brutal-btn brutal-btn-hover bg-green-400 text-lg w-full md:w-auto"
            >
              CONNECT_SPOTIFY
            </button>
          ) : (
            <button
              onClick={() => setShowMood(true)}
              className="brutal-btn brutal-btn brutal-btn-hover bg-purple-500 text-white text-lg w-full md:w-auto flex items-center justify-center gap-2"
            >
              <Sparkles size={20} /> DETECT_VIBE
            </button>
          )}
        </div>

        <div className="lg:col-span-4 bg-black text-white brutal-border brutal-shadow p-6 flex items-center justify-center text-center">
          <Zap size={32} className="text-amber-400 mr-4" />
          <span className="font-black italic uppercase tracking-widest">
            Global_Vibe_Protocol_v2.6
          </span>
        </div>
      </div>

      {/* CONTENT GRIDS */}
      <div className="space-y-16">
        {topTracks.length > 0 && (
          <section>
            <h2 className="text-3xl font-black uppercase mb-6 inline-block border-b-8 border-purple-500">
              Your_High_Rotation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {topTracks.slice(0, 6).map((track) => (
                <SongCard key={track.id} track={track} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-3xl font-black uppercase mb-6 inline-block border-b-8 border-amber-400">
            Fresh_Frequency
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {newReleases.map((album) => (
              <PlaylistCard key={album.id} item={album} type="album" />
            ))}
          </div>
        </section>
      </div>

      {showMood && <MoodDetector onClose={() => setShowMood(false)} />}
    </div>
  );
}
