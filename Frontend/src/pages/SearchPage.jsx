import React, { useState, useCallback, useRef } from "react";
import { spotify } from "../utils/spotify";
import { useSpotify } from "../contexts/SpotifyContext";
import SongCard from "../components/Home/SongCard";
import PlaylistCard from "../components/Home/PlaylistCard";
import { Search, X } from "lucide-react";

const CATEGORIES = [
  { label: "All", value: "track,playlist,album" },
  { label: "Songs", value: "track" },
  { label: "Playlists", value: "playlist" },
  { label: "Albums", value: "album" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (q, cat) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const data = await spotify.search(q, cat, 20);
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val, category), 400);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    doSearch(query, cat);
  };

  const tracks = results?.tracks?.items || [];
  const playlists = results?.playlists?.items || [];
  const albums = results?.albums?.items || [];

  return (
    <div style={{ padding: "2rem", maxWidth: 1400, margin: "0 auto" }}>
      <h1
        style={{
          fontFamily: "Clash Display, sans-serif",
          fontSize: "2rem",
          fontWeight: 700,
          color: "#e8e8f0",
          marginBottom: "1.5rem",
        }}
      >
        Search
      </h1>

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <Search
          size={20}
          color="#6b6b80"
          style={{
            position: "absolute",
            left: "1.25rem",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <input
          value={query}
          onChange={handleInput}
          placeholder="Artists, songs, albums, playlists..."
          autoFocus
          style={{
            width: "100%",
            background: "#16161f",
            border: "1px solid #1e1e2e",
            borderRadius: "1rem",
            padding: "1rem 3rem",
            color: "#e8e8f0",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "1rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
          onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
            }}
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={18} color="#6b6b80" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => handleCategory(c.value)}
            style={{
              padding: "0.5rem 1.25rem",
              borderRadius: "2rem",
              border: "1px solid",
              borderColor: category === c.value ? "#6c63ff" : "#1e1e2e",
              background:
                category === c.value ? "rgba(108,99,255,0.15)" : "transparent",
              color: category === c.value ? "#6c63ff" : "#6b6b80",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "4rem" }}
        >
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="waveform-bar"
                style={{ height: 32, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !results && (
        <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎵</div>
          <p
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontSize: "1.25rem",
              color: "#e8e8f0",
              marginBottom: "0.5rem",
            }}
          >
            Find your next favourite
          </p>
          <p style={{ color: "#6b6b80", fontFamily: "DM Sans, sans-serif" }}>
            Search for any song, artist, album or playlist
          </p>
        </div>
      )}

      {/* Results */}
      {!loading && results && (
        <div>
          {tracks.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 className="section-title" style={{ marginBottom: "1rem" }}>
                Songs
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "1rem",
                }}
              >
                {tracks.map((t) => (
                  <SongCard key={t.id} track={t} />
                ))}
              </div>
            </section>
          )}

          {playlists.length > 0 && (
            <section style={{ marginBottom: "2.5rem" }}>
              <h2 className="section-title" style={{ marginBottom: "1rem" }}>
                Playlists
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "1rem",
                }}
              >
                {playlists.filter(Boolean).map((p) => (
                  <PlaylistCard key={p.id} item={p} type="playlist" />
                ))}
              </div>
            </section>
          )}

          {albums.length > 0 && (
            <section>
              <h2 className="section-title" style={{ marginBottom: "1rem" }}>
                Albums
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "1rem",
                }}
              >
                {albums.map((a) => (
                  <PlaylistCard key={a.id} item={a} type="album" />
                ))}
              </div>
            </section>
          )}

          {tracks.length === 0 &&
            playlists.length === 0 &&
            albums.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p
                  style={{
                    color: "#6b6b80",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  No results for "{query}"
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
