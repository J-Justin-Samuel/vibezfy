import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const FEATURES = [
  {
    icon: "🎭",
    title: "Mood Detection",
    desc: "Point your camera for 3 seconds. Our AI reads your facial expressions and maps them to the perfect emotional soundtrack.",
  },
  {
    icon: "🎵",
    title: "Spotify Powered",
    desc: "Access millions of songs, curated playlists, and new releases. Full Spotify integration with real-time playback.",
  },
  {
    icon: "🔍",
    title: "Smart Search",
    desc: "Find any track, artist, album or playlist instantly. Debounced, fast, and filtered exactly how you want it.",
  },
  {
    icon: "⚡",
    title: "Real-time Playback",
    desc: "A sleek bottom player with seek, volume, skip and queue — no page reloads, no interruptions.",
  },
];

const MOODS = [
  { emoji: "😊", label: "Happy", color: "#fbbf24" },
  { emoji: "😢", label: "Sad", color: "#60a5fa" },
  { emoji: "😠", label: "Angry", color: "#f87171" },
  { emoji: "😲", label: "Surprised", color: "#a78bfa" },
  { emoji: "😨", label: "Calm", color: "#34d399" },
  { emoji: "😐", label: "Neutral", color: "#94a3b8" },
];

// Animated waveform bars
function Waveform({
  bars = 12,
  height = 40,
  color = "#6c63ff",
  playing = true,
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 4,
            borderRadius: 2,
            background: color,
            height: `${30 + Math.sin(i * 0.8) * 60}%`,
            opacity: playing ? 0.7 + (i % 3) * 0.1 : 0.3,
            animation: playing
              ? `wave ${0.8 + (i % 4) * 0.2}s ease-in-out infinite alternate`
              : "none",
            animationDelay: `${i * 0.07}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeMood, setActiveMood] = useState(0);
  const heroRef = useRef(null);

  // If already logged in, skip landing and go straight to app
  useEffect(() => {
    if (!loading && user) navigate("/home", { replace: true });
  }, [user, loading]);

  // Cycle through moods
  useEffect(() => {
    const t = setInterval(
      () => setActiveMood((m) => (m + 1) % MOODS.length),
      2000,
    );
    return () => clearInterval(t);
  }, []);

  const mood = MOODS[activeMood];

  return (
    <div
      style={{
        background: "#0a0a0f",
        minHeight: "100vh",
        color: "#e8e8f0",
        overflowX: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(108,99,255,0.07)",
            filter: "blur(100px)",
            top: -100,
            right: -100,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.06)",
            filter: "blur(80px)",
            bottom: 200,
            left: -100,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(56,189,248,0.04)",
            filter: "blur(60px)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        />
      </div>

      {/* ── NAVBAR ── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 2rem",
          background: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
              fontSize: "1.5rem",
              fontWeight: 700,
              background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Vibezfy
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="btn-ghost"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
          <button
            className="btn-primary"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.9rem" }}
            onClick={() => navigate("/signup")}
          >
            Get started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "6rem 2rem 4rem",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(108,99,255,0.12)",
            border: "1px solid rgba(108,99,255,0.3)",
            borderRadius: "2rem",
            padding: "0.4rem 1rem",
            marginBottom: "2rem",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.85rem",
            color: "#a78bfa",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#6c63ff",
              display: "inline-block",
              animation: "moodPulse 2s ease-in-out infinite",
            }}
          />
          AI-Powered Mood Music
        </div>

        <h1
          style={{
            fontFamily: "Clash Display, sans-serif",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "1.5rem",
            maxWidth: 800,
            margin: "0 auto 1.5rem",
          }}
        >
          Music that{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6c63ff, #a78bfa, #38bdf8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            feels you.
          </span>
        </h1>

        <p
          style={{
            fontFamily: "DM Sans, sans-serif",
            fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
            color: "#6b6b80",
            maxWidth: 560,
            margin: "0 auto 3rem",
            lineHeight: 1.6,
          }}
        >
          Point your camera, let AI read your mood, and get a Spotify playlist
          tailored to exactly how you feel — right now.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "4rem",
          }}
        >
          <button
            className="btn-primary"
            style={{
              padding: "0.9rem 2rem",
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onClick={() => navigate("/signup")}
          >
            Start for free →
          </button>
          <button
            className="btn-ghost"
            style={{ padding: "0.9rem 2rem", fontSize: "1rem" }}
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>

        {/* Hero visual — mood detector mockup */}
        <div style={{ maxWidth: 480, margin: "0 auto", position: "relative" }}>
          {/* Fake camera card */}
          <div
            className="glass"
            style={{
              borderRadius: "1.5rem",
              padding: "1.5rem",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1)",
            }}
          >
            {/* Camera viewfinder */}
            <div
              style={{
                borderRadius: "1rem",
                background: "#050508",
                height: 220,
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                border: "1px solid #1e1e2e",
              }}
            >
              {/* Face silhouette */}
              <div
                style={{ textAlign: "center", position: "relative", zIndex: 1 }}
              >
                <div
                  style={{
                    fontSize: "5rem",
                    marginBottom: "0.5rem",
                    transition: "all 0.5s",
                    filter: "drop-shadow(0 0 20px rgba(108,99,255,0.5))",
                  }}
                >
                  {mood.emoji}
                </div>
              </div>

              {/* Scanning lines */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(108,99,255,0.03) 3px, rgba(108,99,255,0.03) 4px)",
                  pointerEvents: "none",
                }}
              />

              {/* Corner brackets */}
              {[
                {
                  top: 12,
                  left: 12,
                  borderTop: "2px solid #6c63ff",
                  borderLeft: "2px solid #6c63ff",
                },
                {
                  top: 12,
                  right: 12,
                  borderTop: "2px solid #6c63ff",
                  borderRight: "2px solid #6c63ff",
                },
                {
                  bottom: 12,
                  left: 12,
                  borderBottom: "2px solid #6c63ff",
                  borderLeft: "2px solid #6c63ff",
                },
                {
                  bottom: 12,
                  right: 12,
                  borderBottom: "2px solid #6c63ff",
                  borderRight: "2px solid #6c63ff",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ position: "absolute", width: 20, height: 20, ...s }}
                />
              ))}

              {/* Live badge */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: "1rem",
                  padding: "3px 10px",
                  fontSize: "0.7rem",
                  fontFamily: "DM Sans, sans-serif",
                  color: "#e8e8f0",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#f87171",
                    animation: "moodPulse 1.5s ease-in-out infinite",
                  }}
                />
                LIVE
              </div>
            </div>

            {/* Detected mood bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: `${mood.color}15`,
                border: `1px solid ${mood.color}30`,
                borderRadius: "0.75rem",
                padding: "0.75rem 1rem",
                marginBottom: "0.75rem",
                transition: "all 0.5s",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{mood.emoji}</span>
              <div>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontWeight: 600,
                    color: mood.color,
                    fontSize: "0.9rem",
                    transition: "color 0.5s",
                  }}
                >
                  Detected: {mood.label}
                </p>
                <p
                  style={{
                    color: "#6b6b80",
                    fontSize: "0.75rem",
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {Math.floor(75 + activeMood * 3)}% confidence
                </p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Waveform bars={6} height={24} color={mood.color} />
              </div>
            </div>

            {/* Playlist suggestion */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "#16161f",
                borderRadius: "0.75rem",
                padding: "0.75rem",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "0.5rem",
                  background: `linear-gradient(135deg, ${mood.color}80, #6c63ff80)`,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                }}
              >
                🎵
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "#e8e8f0",
                  }}
                >
                  {mood.label} Vibes Playlist
                </p>
                <p style={{ color: "#6b6b80", fontSize: "0.75rem" }}>
                  Auto-generated · Spotify
                </p>
              </div>
              <button
                style={{
                  marginLeft: "auto",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#6c63ff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.9rem",
                }}
              >
                ▶
              </button>
            </div>
          </div>

          {/* Floating mood pills */}
          <div
            style={{
              position: "absolute",
              top: -20,
              left: -60,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {MOODS.slice(0, 3).map((m, i) => (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(17,17,24,0.9)",
                  border: "1px solid #1e1e2e",
                  borderRadius: "2rem",
                  padding: "4px 12px",
                  fontSize: "0.8rem",
                  fontFamily: "DM Sans, sans-serif",
                  color: "#6b6b80",
                  transform: `translateX(${i * -10}px)`,
                  animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              >
                {m.emoji} {m.label}
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              top: 20,
              right: -60,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {MOODS.slice(3).map((m, i) => (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(17,17,24,0.9)",
                  border: "1px solid #1e1e2e",
                  borderRadius: "2rem",
                  padding: "4px 12px",
                  fontSize: "0.8rem",
                  fontFamily: "DM Sans, sans-serif",
                  color: "#6b6b80",
                  animation: `float ${3.5 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                {m.emoji} {m.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "5rem 2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#6c63ff",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          How it works
        </p>
        <h2
          style={{
            fontFamily: "Clash Display, sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            marginBottom: "3.5rem",
          }}
        >
          Three seconds to the perfect playlist
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          {[
            {
              step: "01",
              icon: "📸",
              title: "Open camera",
              desc: "Hit the Vibe button. Your front camera activates — no photos stored.",
            },
            {
              step: "02",
              icon: "🧠",
              title: "AI reads mood",
              desc: "face-api.js runs locally in your browser, detecting 7 emotional states.",
            },
            {
              step: "03",
              icon: "🎵",
              title: "Music plays",
              desc: "We search Spotify for the perfect playlist matching your exact emotion.",
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{ flex: "1 1 240px", maxWidth: 280 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "1rem",
                  background: "rgba(108,99,255,0.12)",
                  border: "1px solid rgba(108,99,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.75rem",
                  margin: "0 auto 1rem",
                }}
              >
                {icon}
              </div>
              <div
                style={{
                  color: "#6c63ff",
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                {step}
              </div>
              <h3
                style={{
                  fontFamily: "Clash Display, sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  color: "#6b6b80",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        style={{ position: "relative", zIndex: 1, padding: "3rem 2rem 5rem" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p
              style={{
                color: "#6c63ff",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Features
            </p>
            <h2
              style={{
                fontFamily: "Clash Display, sans-serif",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
              }}
            >
              Everything your ears need
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="glass"
                style={{
                  borderRadius: "1.25rem",
                  padding: "1.5rem",
                  transition: "all 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(108,99,255,0.3)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  {icon}
                </div>
                <h3
                  style={{
                    fontFamily: "Clash Display, sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#e8e8f0",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: "#6b6b80",
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "4rem 2rem 6rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            background:
              "linear-gradient(135deg, rgba(108,99,255,0.12), rgba(124,58,237,0.08))",
            border: "1px solid rgba(108,99,255,0.2)",
            borderRadius: "2rem",
            padding: "3rem 2rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎭</div>
          <h2
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontSize: "clamp(1.5rem, 4vw, 2rem)",
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Ready to find your vibe?
          </h2>
          <p
            style={{
              color: "#6b6b80",
              fontFamily: "DM Sans, sans-serif",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            Free to use. No credit card. Just music that matches how you
            actually feel.
          </p>
          <button
            className="btn-primary"
            style={{ padding: "0.9rem 2.5rem", fontSize: "1rem" }}
            onClick={() => navigate("/signup")}
          >
            Get started for free →
          </button>
          <p
            style={{
              marginTop: "1rem",
              color: "#6b6b80",
              fontSize: "0.8rem",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "#6c63ff",
                cursor: "pointer",
                fontSize: "inherit",
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid #1e1e2e",
          padding: "2rem",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            marginBottom: "0.75rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>🎵</span>
          <span
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontWeight: 700,
              color: "#6b6b80",
            }}
          >
            Vibezfy
          </span>
        </div>
        <p
          style={{
            color: "#6b6b80",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "0.8rem",
          }}
        >
          Powered by Spotify API · face-api.js · Firebase
        </p>
      </footer>
    </div>
  );
}
