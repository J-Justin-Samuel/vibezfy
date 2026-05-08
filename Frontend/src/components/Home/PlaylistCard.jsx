import React, { useState } from "react";
import { useSpotify } from "../../contexts/SpotifyContext";
import { spotify } from "../../utils/spotify";
import { Play } from "lucide-react";

export default function PlaylistCard({ item, type }) {
  const { playPlaylist } = useSpotify();
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!item) return null;

  const image = item.images?.[0]?.url;
  const subtitle =
    type === "album"
      ? item.artists?.map((a) => a.name).join(", ")
      : item.description || item.owner?.display_name || "";

  const handlePlay = async () => {
    setLoading(true);
    try {
      const data =
        type === "playlist"
          ? await spotify.getPlaylistTracks(item.id, 20)
          : await spotify.getPlaylistTracks(item.id, 20); // albums use same endpoint via /albums/{id}/tracks
      const tracks = (data?.items || [])
        .map((i) => i.track || i)
        .filter((t) => t?.uri);
      await playPlaylist(tracks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="song-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handlePlay}
    >
      <div style={{ position: "relative", marginBottom: "0.75rem" }}>
        <div
          style={{
            aspectRatio: "1",
            borderRadius: type === "playlist" ? "0.75rem" : "0.5rem",
            overflow: "hidden",
            background: "#1e1e2e",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={item.name}
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
              {type === "playlist" ? "🎵" : "💿"}
            </div>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
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
            opacity: hovered ? 1 : 0,
            transform: hovered
              ? "translateY(0) scale(1)"
              : "translateY(4px) scale(0.9)",
          }}
        >
          {loading ? (
            <div
              style={{
                width: 14,
                height: 14,
                border: "2px solid white",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.6s linear infinite",
              }}
            />
          ) : (
            <Play
              size={16}
              color="white"
              fill="white"
              style={{ marginLeft: 2 }}
            />
          )}
        </button>
      </div>

      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 500,
          color: "#e8e8f0",
          fontSize: "0.875rem",
          marginBottom: 4,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {item.name}
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
        {subtitle}
      </p>
    </div>
  );
}
