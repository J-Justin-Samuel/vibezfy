import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useSpotify } from "../contexts/SpotifyContext";
import { initiateSpotifyLogin } from "../utils/spotify";
import Player from "./Player/Player";
import { Home, Search, LogOut, Music, Zap } from "lucide-react";

const NAV = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
];

export default function Layout({ children }) {
  const { user } = useAuth();
  const { isConnected, currentTrack } = useSpotify();
  const navigate = useNavigate();

  const handleLogout = () => navigate("/logout");

  const sidebarW = 220;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0a0a0f" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarW,
          minHeight: "100vh",
          background: "#0d0d14",
          borderRight: "1px solid #1e1e2e",
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 1rem",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2.5rem",
            padding: "0 0.5rem",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#6c63ff",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(108,99,255,0.4)",
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>🎵</span>
          </div>
          <span
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontSize: "1.4rem",
              fontWeight: 700,
            }}
            className="text-gradient"
          >
            Vibezfy
          </span>
        </div>

        {/* Nav */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            flex: 1,
          }}
        >
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                textDecoration: "none",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                fontSize: "0.9rem",
                transition: "all 0.2s",
                background: isActive ? "rgba(108,99,255,0.15)" : "transparent",
                color: isActive ? "#6c63ff" : "#6b6b80",
                borderLeft: isActive
                  ? "3px solid #6c63ff"
                  : "3px solid transparent",
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {/* Spotify connect */}
          {!isConnected && (
            <button
              onClick={initiateSpotifyLogin}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                background: "rgba(29,185,84,0.1)",
                border: "1px solid rgba(29,185,84,0.2)",
                color: "#1db954",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                marginTop: "0.5rem",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(29,185,84,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(29,185,84,0.1)")
              }
            >
              <Zap size={18} />
              Connect Spotify
            </button>
          )}

          {isConnected && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                color: "#1db954",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.8rem",
                marginTop: "0.25rem",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#1db954",
                }}
              />
              Spotify connected
            </div>
          )}
        </nav>

        {/* User */}
        <div style={{ borderTop: "1px solid #1e1e2e", paddingTop: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.75rem",
              padding: "0 0.25rem",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6c63ff, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "white",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                user?.displayName?.[0]?.toUpperCase() || "?"
              )}
            </div>
            <div style={{ overflow: "hidden" }}>
              <p
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: 500,
                  color: "#e8e8f0",
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.displayName || user?.email?.split("@")[0]}
              </p>
              <p
                style={{
                  color: "#6b6b80",
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.6rem 1rem",
              borderRadius: "0.75rem",
              background: "transparent",
              border: "none",
              color: "#6b6b80",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(248,113,113,0.1)";
              e.currentTarget.style.color = "#f87171";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6b6b80";
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main
        style={{
          marginLeft: sidebarW,
          flex: 1,
          paddingBottom: currentTrack ? 100 : 0,
          minHeight: "100vh",
        }}
      >
        {children}
      </main>

      {/* Player */}
      <Player />
    </div>
  );
}
