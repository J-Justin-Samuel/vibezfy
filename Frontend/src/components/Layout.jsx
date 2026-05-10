import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSpotify } from "../contexts/SpotifyContext";
import Player from "./Player/Player";
import { Home, Search, LogOut, Zap, Menu, X } from "lucide-react";

const NAV = [
  { to: "/home", icon: Home, label: "DASHBOARD" },
  { to: "/search", icon: Search, label: "DISCOVER" },
];

export default function Layout({ children }) {
  const { user } = useAuth();
  const { isConnected, currentTrack } = useSpotify();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const name = user?.displayName || user?.email?.split("@")[0] || "USER";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F0EBE0] text-black font-sans">
      {/* MOBILE HEADER - Only visible on small screens */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b-4 border-black sticky top-0 z-[100]">
        <Link
          to="/home"
          className="font-black text-xl tracking-tighter uppercase italic"
        >
          VIBEZFY.
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="brutal-btn p-2 bg-amber-400"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* SIDEBAR - Desktop: Permanent, Mobile: Overlay */}
      <aside
        className={`
  fixed z-[90] w-64 bg-white border-r-4 border-black flex flex-col transition-transform duration-300
  md:translate-x-0 md:static md:h-screen shrink-0
  ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
`}
        style={{
          /* On mobile, start below the 70px header. On desktop, start at 0 */
          top: window.innerWidth < 768 ? "70px" : "0",
          height: window.innerWidth < 768 ? "calc(100vh - 70px)" : "100vh",
          bottom: 0,
        }}
      >
        {/* LOGO SECTION */}
        <div className="p-6 border-b-4 border-black bg-purple-500 hidden md:block">
          <Link to="/home" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center brutal-border group-hover:-translate-y-1 transition-transform">
              <span className="text-xl">🎵</span>
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
              Vibezfy
            </span>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-4">
          <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] mb-4">
            SYSTEM_CORE
          </p>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 p-3 font-black text-sm uppercase transition-all brutal-border
                ${
                  isActive
                    ? "bg-amber-400 shadow-none translate-x-[2px] translate-y-[2px]"
                    : "bg-white hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                }
              `}
            >
              <Icon size={20} strokeWidth={3} />
              {label}
            </NavLink>
          ))}

          {/* SPOTIFY STATUS */}
          <div
            className={`mt-8 p-4 brutal-border ${isConnected ? "bg-green-100" : "bg-red-100"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap
                size={14}
                className={isConnected ? "text-green-600" : "text-red-600"}
              />
              <span className="text-[10px] font-black uppercase">
                Spotify_Link
              </span>
            </div>
            <p className="text-xs font-bold leading-tight">
              {isConnected
                ? "ENCRYPTED_CONNECTED"
                : "SIGNAL_LOST_RECONNECT_REQ"}
            </p>
          </div>
        </nav>

        {/* USER PROFILE BOX */}
        <div className="p-4 border-t-4 border-black bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 brutal-border bg-purple-500 overflow-hidden shrink-0">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-black">
                  {name[0]}
                </div>
              )}
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="font-black text-xs uppercase truncate leading-none mb-1">
                {name}
              </p>
              <span className="bg-black text-white text-[8px] px-1 font-bold">
                VIP_ACCESS
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/logout")}
            className="w-full brutal-btn brutal-btn-hover bg-red-400 text-xs flex items-center justify-center gap-2"
          >
            <LogOut size={14} /> TERMINATE_SESSION
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[80] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative">
        <div
          className={`
          min-h-screen
          ${currentTrack ? "pb-32" : "pb-8"}
        `}
        >
          {children}
        </div>
      </main>

      {/* PLAYER COMPONENT */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:left-64">
        <Player />
      </div>
    </div>
  );
}
