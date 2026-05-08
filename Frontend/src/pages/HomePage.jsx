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
import { Sparkles, LogOut } from "lucide-react";

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
    <div style={{ padding: "2rem", maxWidth: 1400, margin: "0 auto" }}>
      {/* Background orbs */}
      <div
        className="orb"
        style={{
          width: 400,
          height: 400,
          background: "rgba(108,99,255,0.08)",
          top: -100,
          right: -100,
        }}
      />
      <div
        className="orb"
        style={{
          width: 300,
          height: 300,
          background: "rgba(124,58,237,0.06)",
          bottom: 200,
          left: -100,
        }}
      />

      {/* Header */}
      <div style={{ marginBottom: "2.5rem", position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <p
              style={{
                color: "#6b6b80",
                fontFamily: "DM Sans, sans-serif",
                marginBottom: 4,
              }}
            >
              {greeting}
            </p>
            <h1
              style={{
                fontFamily: "Clash Display, sans-serif",
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#e8e8f0",
              }}
            >
              {firstName} 👋
            </h1>
          </div>
          {/* Account / Logout button */}
          <button
            onClick={() => navigate("/logout")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.6rem 1.1rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid #1e1e2e",
              color: "#6b6b80",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.85rem",
              cursor: "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(248,113,113,0.4)";
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.background = "rgba(248,113,113,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#1e1e2e";
              e.currentTarget.style.color = "#6b6b80";
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            }}
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>

        {/* Spotify connect banner */}
        {!isConnected && (
          <div
            className="glass"
            style={{
              borderRadius: "1rem",
              padding: "1.25rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "Clash Display, sans-serif",
                  fontWeight: 600,
                  color: "#e8e8f0",
                  marginBottom: 4,
                }}
              >
                Connect Spotify to unlock everything
              </p>
              <p
                style={{
                  color: "#6b6b80",
                  fontSize: "0.875rem",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Search, play music and let AI detect your vibe
              </p>
            </div>
            <button
              className="btn-primary"
              style={{ whiteSpace: "nowrap" }}
              onClick={initiateSpotifyLogin}
            >
              Connect Spotify
            </button>
          </div>
        )}

        {/* Mood detect button */}
        <button
          onClick={() => setShowMood(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "linear-gradient(135deg, #6c63ff20, #7c3aed15)",
            border: "1px solid rgba(108,99,255,0.4)",
            borderRadius: "1rem",
            padding: "1rem 1.5rem",
            cursor: "pointer",
            transition: "all 0.3s",
            fontFamily: "DM Sans, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6c63ff";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(108,99,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(108,99,255,0.4)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div className="mood-active" style={{ fontSize: "2rem" }}>
            🎭
          </div>
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                fontFamily: "Clash Display, sans-serif",
                fontWeight: 600,
                color: "#e8e8f0",
                fontSize: "1rem",
                marginBottom: 2,
              }}
            >
              Detect My Vibe
            </p>
            <p style={{ color: "#6b6b80", fontSize: "0.8rem" }}>
              Point camera → AI reads mood → Perfect playlist
            </p>
          </div>
          <Sparkles size={18} color="#6c63ff" style={{ marginLeft: "auto" }} />
        </button>
      </div>

      {/* Top Tracks */}
      {topTracks.length > 0 && (
        <section
          style={{ marginBottom: "3rem", position: "relative", zIndex: 1 }}
        >
          <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>
            Your Top Tracks
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {loading
              ? Array(5)
                  .fill(0)
                  .map((_, i) => <SkeletonCard key={i} />)
              : topTracks
                  .slice(0, 6)
                  .map((track) => <SongCard key={track.id} track={track} />)}
          </div>
        </section>
      )}

      {/* New Releases */}
      <section
        style={{ marginBottom: "3rem", position: "relative", zIndex: 1 }}
      >
        <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>
          New Releases
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {loading
            ? Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            : newReleases.map((album) => (
                <PlaylistCard key={album.id} item={album} type="album" />
              ))}
        </div>
      </section>

      {/* Featured Playlists */}
      {featured.length > 0 && (
        <section style={{ position: "relative", zIndex: 1 }}>
          <h2 className="section-title" style={{ marginBottom: "1.25rem" }}>
            Featured Playlists
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => <SkeletonCard key={i} />)
              : featured.map((pl) => (
                  <PlaylistCard key={pl.id} item={pl} type="playlist" />
                ))}
          </div>
        </section>
      )}

      {/* Mood Detector Modal */}
      {showMood && <MoodDetector onClose={() => setShowMood(false)} />}
    </div>
  );
}
