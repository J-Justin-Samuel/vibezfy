import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { clearTokens } from "../utils/spotify";

export default function LogoutPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      clearTokens(); // clear Spotify tokens too
      await logout();
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/home");

  const avatar = user?.photoURL;
  const name = user?.displayName || user?.email?.split("@")[0] || "there";
  const email = user?.email || "";
  const initial = name[0]?.toUpperCase() || "?";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(248,113,113,0.05)",
          filter: "blur(100px)",
          top: -100,
          right: -100,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(108,99,255,0.05)",
          filter: "blur(80px)",
          bottom: 0,
          left: -100,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            marginBottom: "3rem",
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
            <span>🎵</span>
          </div>
          <span
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              background: "linear-gradient(135deg,#6c63ff,#a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Vibezfy
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#111118",
            border: "1px solid #1e1e2e",
            borderRadius: "1.5rem",
            padding: "2.5rem 2rem",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "1rem",
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              marginBottom: "1.5rem",
            }}
          >
            👋
          </div>

          <h1
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#e8e8f0",
              marginBottom: "0.5rem",
            }}
          >
            Signing out?
          </h1>
          <p
            style={{
              color: "#6b6b80",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Your playlists and vibe settings will be saved. You can always come
            back!
          </p>

          {/* User info card */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "#16161f",
              border: "1px solid #1e1e2e",
              borderRadius: "1rem",
              padding: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                flexShrink: 0,
                background: "linear-gradient(135deg, #6c63ff, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                fontWeight: 700,
                color: "white",
                overflow: "hidden",
              }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                initial
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontWeight: 600,
                  color: "#e8e8f0",
                  fontSize: "0.95rem",
                  marginBottom: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {name}
              </p>
              <p
                style={{
                  color: "#6b6b80",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {email}
              </p>
            </div>
            {/* Green connected dot */}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 6,
                flexShrink: 0,
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
              <span style={{ color: "#6b6b80", fontSize: "0.75rem" }}>
                Active
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <button
              onClick={handleLogout}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "0.875rem",
                background: loading ? "rgba(248,113,113,0.5)" : "#f87171",
                border: "none",
                color: "white",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                boxShadow: loading
                  ? "none"
                  : "0 8px 25px rgba(248,113,113,0.3)",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#ef4444";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.background = "#f87171";
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                  Signing out...
                </>
              ) : (
                <>👋 Yes, sign me out</>
              )}
            </button>

            <button
              onClick={handleCancel}
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.875rem",
                borderRadius: "0.875rem",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid #1e1e2e",
                color: "#6b6b80",
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 500,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = "rgba(108,99,255,0.4)";
                  e.currentTarget.style.color = "#e8e8f0";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1e1e2e";
                e.currentTarget.style.color = "#6b6b80";
              }}
            >
              ← Back to Vibezfy
            </button>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#6b6b80",
            fontSize: "0.8rem",
            marginTop: "1.5rem",
          }}
        >
          Your mood history and playlists are saved to your account.
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
