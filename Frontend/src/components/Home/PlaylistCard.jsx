import React, { useState } from "react";
import { useSpotify } from "../../contexts/SpotifyContext";
import { spotify } from "../../utils/spotify";
import { Play, Disc } from "lucide-react";

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

  const handlePlay = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      // Logic remains the same, using your existing spotify utils
      const data = await spotify.getPlaylistTracks(item.id, 20);
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
      className="group bg-white brutal-border brutal-shadow-hover p-4 cursor-pointer transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handlePlay}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-square brutal-border bg-black mb-4 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2 ${
              loading ? "opacity-50" : "opacity-100"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-500">
            <Disc size={48} className="text-white animate-spin-slow" />
          </div>
        )}

        {/* BRUTALIST PLAY BUTTON OVERLAY */}
        <button
          onClick={handlePlay}
          className={`absolute bottom-3 right-3 w-12 h-12 brutal-border bg-amber-400 flex items-center justify-center transition-all duration-200 
            ${
              hovered
                ? "translate-x-0 translate-y-0 opacity-100"
                : "translate-x-2 translate-y-2 opacity-0"
            } hover:bg-amber-300 active:translate-x-1 active:translate-y-1`}
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play size={20} fill="black" className="ml-1" />
          )}
        </button>
      </div>

      {/* TEXT INFO */}
      <div className="space-y-1">
        <h3 className="font-black text-sm uppercase italic tracking-tighter truncate leading-none">
          {item.name}
        </h3>
        <p className="font-bold text-[10px] text-gray-500 uppercase truncate">
          {subtitle}
        </p>
      </div>

      {/* METADATA TAG */}
      <div className="mt-3 flex">
        <span className="bg-black text-white px-2 py-0.5 text-[8px] font-black uppercase tracking-widest brutal-border">
          {type === "album" ? "RECORD_LP" : "COLLECTION_VIBE"}
        </span>
      </div>
    </div>
  );
}
