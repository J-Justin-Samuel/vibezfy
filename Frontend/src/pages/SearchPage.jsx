import React, { useState, useCallback, useRef } from "react";
import { spotify } from "../utils/spotify";
import SongCard from "../components/Home/SongCard";
import PlaylistCard from "../components/Home/PlaylistCard";
import { Search as SearchIcon, X, Zap } from "lucide-react";

const CATEGORIES = [
  { label: "ALL_RESULTS", value: "track,playlist,album" },
  { label: "SONGS", value: "track" },
  { label: "PLAYLISTS", value: "playlist" },
  { label: "ALBUMS", value: "album" },
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
    <div className="min-h-screen bg-[#F0EBE0] p-4 md:p-8 font-sans">
      <header className="mb-10">
        <div className="inline-block bg-black text-white px-4 py-1 brutal-border mb-4 text-xs font-black tracking-widest uppercase">
          Discovery_Module_v2
        </div>
        <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
          Search<span className="text-purple-600">.</span>
        </h1>
      </header>

      {/* SEARCH BAR CONTAINER */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-black brutal-border translate-x-1 translate-y-1 group-focus-within:translate-x-2 group-focus-within:translate-y-2 transition-transform" />
        <div className="relative bg-white brutal-border p-4 flex items-center gap-4">
          <SearchIcon
            size={28}
            className="text-black shrink-0"
            strokeWidth={3}
          />
          <input
            value={query}
            onChange={handleInput}
            placeholder="ARTISTS_SONGS_ALBUMS..."
            className="w-full bg-transparent border-none outline-none text-xl md:text-2xl font-black uppercase placeholder:text-gray-300"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults(null);
              }}
              className="brutal-btn bg-red-400 p-1"
            >
              <X size={20} strokeWidth={4} />
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex flex-wrap gap-3 mb-12">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => handleCategory(c.value)}
            className={`brutal-btn text-xs md:text-sm px-6 py-2 transition-colors ${
              category === c.value
                ? "bg-purple-500 text-white shadow-none translate-x-[2px] translate-y-[2px]"
                : "bg-white text-black"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="flex gap-2 h-12 items-end">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-3 bg-black brutal-border animate-bounce"
                style={{ height: "100%", animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
          <p className="font-black uppercase tracking-widest text-sm">
            Fetching_Data...
          </p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !results && (
        <div className="brutal-card bg-amber-400 p-12 text-center -rotate-1 max-w-2xl mx-auto my-10">
          <Zap size={64} className="mx-auto mb-6 fill-black" />
          <h2 className="text-3xl font-black uppercase mb-2 leading-none">
            Find_Your_Frequency
          </h2>
          <p className="font-bold uppercase text-sm">
            Input signal required to process audio metadata.
          </p>
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {!loading && results && (
        <div className="space-y-16">
          {tracks.length > 0 && (
            <section>
              <h2 className="text-3xl font-black uppercase mb-6 inline-block border-b-8 border-purple-500 italic">
                Audio_Tracks
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {tracks.map((t) => (
                  <SongCard key={t.id} track={t} />
                ))}
              </div>
            </section>
          )}

          {playlists.length > 0 && (
            <section>
              <h2 className="text-3xl font-black uppercase mb-6 inline-block border-b-8 border-amber-400 italic">
                Curated_Collections
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {playlists.filter(Boolean).map((p) => (
                  <PlaylistCard key={p.id} item={p} type="playlist" />
                ))}
              </div>
            </section>
          )}

          {albums.length > 0 && (
            <section>
              <h2 className="text-3xl font-black uppercase mb-6 inline-block border-b-8 border-black text-white bg-black px-2 italic">
                Studio_Albums
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {albums.map((a) => (
                  <PlaylistCard key={a.id} item={a} type="album" />
                ))}
              </div>
            </section>
          )}

          {tracks.length === 0 &&
            playlists.length === 0 &&
            albums.length === 0 && (
              <div className="bg-white brutal-border p-12 text-center brutal-shadow">
                <p className="font-black text-2xl uppercase">
                  No_Signal_Detected_For: "{query}"
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
