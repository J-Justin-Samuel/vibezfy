import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const MOODS = ["HAPPY", "SAD", "CALM", "ANGRY", "SURPRISED", "NEUTRAL"];
const MOOD_COLORS = {
  HAPPY: "#FFDD00",
  SAD: "#60A5FA",
  CALM: "#4ADE80",
  ANGRY: "#F87171",
  SURPRISED: "#C084FC",
  NEUTRAL: "#FFFFFF",
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mood, setMood] = useState(0);

  useEffect(() => {
    if (!loading && user) navigate("/home", { replace: true });
  }, [user, loading]);

  useEffect(() => {
    const t = setInterval(() => setMood((m) => (m + 1) % MOODS.length), 1500);
    return () => clearInterval(t);
  }, []);

  const currentMood = MOODS[mood];
  const moodColor = MOOD_COLORS[currentMood];

  return (
    <div
      style={{
        height: "100vh", // Force exactly 100% of the viewport height
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* HEADER - Fixed Height */}
      <nav
        style={{
          height: "70px",
          borderBottom: "4px solid #0E0D0B",
          padding: "0 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          flexShrink: 0,
        }}
      >
        <h1 style={{ fontWeight: 800, fontSize: "1.5rem" }}>VIBEZFY.</h1>
        <button
          className="brutal-btn"
          style={{ padding: "8px 16px" }}
          onClick={() => navigate("/login")}
        >
          LOGIN
        </button>
      </nav>

      {/* MARQUEE - Fixed Height */}
      <div className="marquee" style={{ flexShrink: 0, height: "45px" }}>
        <div className="marquee-content">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              style={{ fontSize: "1rem", fontWeight: 700, margin: "0 20px" }}
            >
              AI MOOD DETECTION • REAL-TIME PLAYLISTS • NO TRACKING • SPOTIFY
              READY •
            </span>
          ))}
        </div>
      </div>

      {/* MAIN HERO GRID - Dynamic Height */}
      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          minHeight: 0, // Critical fix for flex containers to allow shrinking
          overflow: "hidden",
        }}
      >
        {/* LEFT COLUMN */}
        <section
          style={{
            padding: "2rem",
            borderRight: "4px solid #0E0D0B",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              lineHeight: 0.9,
              fontWeight: 900,
              marginBottom: "1.5rem",
              textTransform: "uppercase",
            }}
          >
            Your face <br />
            <span
              style={{
                background: moodColor,
                padding: "0 10px",
                border: "3px solid #0E0D0B",
                transition: "background 0.3s",
              }}
            >
              {currentMood}
            </span>
            <br />
            Your music.
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              maxWidth: "450px",
              marginBottom: "1.5rem",
            }}
          >
            The brutalist music player that scans your face to match the vibe.
          </p>
          <button
            className="brutal-btn"
            style={{
              padding: "15px 30px",
              fontSize: "1.2rem",
              width: "fit-content",
            }}
            onClick={() => navigate("/signup")}
          >
            GET STARTED →
          </button>
        </section>

        {/* RIGHT COLUMN */}
        <section
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#E8A838",
            padding: "2rem",
          }}
        >
          <div
            className="brutal-card"
            style={{ width: "90%", maxWidth: "380px", padding: "1rem" }}
          >
            <div
              style={{
                aspectRatio: "4/3",
                background: "#0E0D0B",
                border: "4px solid #0E0D0B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div style={{ color: "white", textAlign: "center" }}>
                <p style={{ fontSize: "0.7rem", opacity: 0.5 }}>
                  SCANNING_SESSION
                </p>
                <h3
                  style={{
                    fontSize: "2.5rem",
                    color: moodColor,
                    transition: "color 0.3s",
                  }}
                >
                  {currentMood}
                </h3>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER - Fixed Height */}
      <footer
        style={{
          height: "60px",
          borderTop: "4px solid #0E0D0B",
          background: "white",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", gap: "10px" }} className="max-md:hidden">
          <span style={{ fontWeight: 700, fontSize: "0.8rem" }}>
            01 PRIVACY
          </span>
          <span style={{ fontWeight: 700, fontSize: "0.8rem" }}>
            02 SPOTIFY
          </span>
        </div>
        <p style={{ fontWeight: 800, fontSize: "0.8rem" }}>© 2026 VIBEZFY.</p>
      </footer>
    </div>
  );
}
