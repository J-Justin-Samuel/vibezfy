import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const TICKER = [
  "FEEL THE MUSIC",
  "READ YOUR MOOD",
  "SPOTIFY POWERED",
  "AI DETECTION",
  "VIBE OR DIE",
  "POINT CAMERA",
  "GET PLAYLIST",
];

const STEPS = [
  {
    n: "01",
    title: "OPEN CAMERA",
    desc: "Hit the Vibe button. Front camera activates. No photos stored.",
  },
  {
    n: "02",
    title: "AI READS MOOD",
    desc: "face-api.js runs locally in your browser. Detects 7 emotional states in real time.",
  },
  {
    n: "03",
    title: "MUSIC PLAYS",
    desc: "Spotify serves the perfect playlist for your exact emotion. No skips needed.",
  },
];

const MOODS = [
  { l: "HAPPY", c: "#FFE566" },
  { l: "SAD", c: "#66AAFF" },
  { l: "ANGRY", c: "#FF6666" },
  { l: "SURPRISED", c: "#CC88FF" },
  { l: "CALM", c: "#66FFCC" },
  { l: "NEUTRAL", c: "#AAAAAA" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeMood, setActiveMood] = useState(0);

  useEffect(() => {
    if (!loading && user) navigate("/home", { replace: true });
  }, [user, loading]);

  useEffect(() => {
    const t = setInterval(
      () => setActiveMood((m) => (m + 1) % MOODS.length),
      1800,
    );
    return () => clearInterval(t);
  }, []);

  const mood = MOODS[activeMood];

  return (
    <div className="land-root">
      {/* NAV */}
      <nav className="land-nav">
        <div className="nav-logo">
          <div className="nav-logo-box">V</div>
          <span className="nav-logo-text">VIBEZFY</span>
        </div>
        <div className="nav-btns">
          <button className="nav-btn-ghost" onClick={() => navigate("/login")}>
            SIGN IN
          </button>
          <button className="nav-btn-solid" onClick={() => navigate("/signup")}>
            GET STARTED →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-tag">
            <span className="hero-tag-dot" />
            AI-POWERED MOOD MUSIC
          </div>
          <h1 className="hero-title">
            MUSIC
            <br />
            <span className="hero-title-accent">THAT</span>
            <br />
            FEELS
            <br />
            <span className="hero-title-stroke">YOU.</span>
          </h1>
          <p className="hero-desc">
            Point your camera. AI reads your face. Spotify plays the perfect
            playlist — instantly.
          </p>
          <div className="hero-cta">
            <button className="cta-solid" onClick={() => navigate("/signup")}>
              START FOR FREE →
            </button>
            <button className="cta-ghost" onClick={() => navigate("/login")}>
              SIGN IN
            </button>
          </div>
        </div>

        <div className="hero-right">
          {/* Mood display card */}
          <div className="mood-card">
            <div className="mood-card-header">
              <div className="live-dot" />
              <span className="live-text">LIVE DETECTION</span>
            </div>

            {/* Fake viewfinder */}
            <div className="viewfinder">
              <div className="vf-corner vf-tl" />
              <div className="vf-corner vf-tr" />
              <div className="vf-corner vf-bl" />
              <div className="vf-corner vf-br" />
              <div className="vf-scanline" />
              <div className="vf-face">
                <div className="vf-face-circle" />
                <div className="vf-face-bar" />
                <div className="vf-face-bar short" />
              </div>
            </div>

            {/* Detected mood */}
            <div className="detected-row" style={{ "--mc": mood.c }}>
              <div className="detected-label">DETECTED</div>
              <div className="detected-mood">{mood.l}</div>
              <div className="detected-bars">
                {[6, 10, 14, 10, 8, 12, 9].map((h, i) => (
                  <div
                    key={i}
                    className="det-bar"
                    style={{
                      height: h,
                      background: mood.c,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Mood grid */}
            <div className="hero-mood-grid">
              {MOODS.map(({ l, c }, i) => (
                <div
                  key={l}
                  className={`hero-mood-chip ${i === activeMood ? "active" : ""}`}
                  style={{ "--hc": c }}
                >
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="ticker-item">
              {t} <span className="ticker-dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="how-label">HOW IT WORKS</div>
        <h2 className="how-title">
          THREE STEPS.
          <br />
          ONE VIBE.
        </h2>
        <div className="steps-grid">
          {STEPS.map(({ n, title, desc }) => (
            <div key={n} className="step-card">
              <div className="step-num">{n}</div>
              <div className="step-divider" />
              <div className="step-title">{title}</div>
              <p className="step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TICKER REVERSE */}
      <div className="ticker-wrap ticker-rev-wrap">
        <div className="ticker-track ticker-rev">
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="ticker-item">
              {t} <span className="ticker-dot">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-box">
          <div className="cta-tag">FREE. NO CARD. NO TRICKS.</div>
          <h2 className="cta-title">
            READY TO
            <br />
            FIND YOUR
            <br />
            VIBE_
          </h2>
          <div className="cta-actions">
            <button className="cta-solid" onClick={() => navigate("/signup")}>
              CREATE ACCOUNT →
            </button>
            <button className="cta-ghost" onClick={() => navigate("/login")}>
              ALREADY HAVE ONE
            </button>
          </div>
        </div>
        <div className="cta-right">
          <div className="cta-stat-grid">
            {[
              { n: "7", l: "MOODS DETECTED" },
              { n: "0s", l: "DATA STORED" },
              { n: "∞", l: "PLAYLISTS" },
              { n: "100%", l: "FREE" },
            ].map(({ n, l }) => (
              <div key={l} className="cta-stat">
                <div className="cta-stat-n">{n}</div>
                <div className="cta-stat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="land-footer">
        <div className="footer-logo">
          <div
            className="nav-logo-box"
            style={{ width: 28, height: 28, fontSize: "0.8rem" }}
          >
            V
          </div>
          <span className="nav-logo-text" style={{ fontSize: "1rem" }}>
            VIBEZFY
          </span>
        </div>
        <p className="footer-note">
          POWERED BY SPOTIFY API · FACE-API.JS · FIREBASE
        </p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .land-root {
          background: #0A0A0A;
          color: #F5F0E8;
          font-family: 'Space Mono', monospace;
          overflow-x: hidden;
        }

        /* NAV */
        .land-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2.5rem;
          background: #0A0A0A;
          border-bottom: 3px solid #1a1a1a;
        }
        .nav-logo { display: flex; align-items: center; gap: 0.75rem; }
        .nav-logo-box {
          width: 36px; height: 36px;
          background: #FFE566;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; font-weight: 700; color: #0A0A0A;
          flex-shrink: 0;
        }
        .nav-logo-text { font-size: 1.2rem; font-weight: 700; color: #F5F0E8; letter-spacing: 0.05em; }
        .nav-btns { display: flex; gap: 0.75rem; align-items: center; }
        .nav-btn-ghost {
          padding: 0.5rem 1.1rem;
          background: transparent;
          border: 2px solid #333;
          color: #888;
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
          cursor: pointer; transition: all 0.15s;
        }
        .nav-btn-ghost:hover { border-color: #FFE566; color: #FFE566; }
        .nav-btn-solid {
          padding: 0.5rem 1.1rem;
          background: #FFE566; border: 2px solid #FFE566;
          color: #0A0A0A;
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
          cursor: pointer; transition: all 0.15s;
          box-shadow: 3px 3px 0 rgba(255,229,102,0.3);
        }
        .nav-btn-solid:hover { transform: translate(-1px,-1px); box-shadow: 4px 4px 0 rgba(255,229,102,0.4); }

        /* HERO */
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: calc(100vh - 67px);
          border-bottom: 3px solid #1a1a1a;
        }
        .hero-left {
          padding: 4rem 3rem 4rem 2.5rem;
          display: flex; flex-direction: column;
          justify-content: center; gap: 2rem;
          border-right: 3px solid #1a1a1a;
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          border: 2px solid #333; padding: 5px 14px;
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.18em;
          color: #888; align-self: flex-start;
        }
        .hero-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #FFE566;
          animation: blink 2s ease-in-out infinite;
        }
        @keyframes blink { 0%,100%{opacity:.4} 50%{opacity:1} }
        .hero-title {
          font-size: clamp(3rem, 6vw, 6rem);
          font-weight: 700; line-height: 1;
          letter-spacing: -0.02em;
        }
        .hero-title-accent { color: #FFE566; }
        .hero-title-stroke {
          color: transparent;
          -webkit-text-stroke: 2px #F5F0E8;
        }
        .hero-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(0.9rem, 1.5vw, 1.1rem);
          color: #666; line-height: 1.7; max-width: 420px;
        }
        .hero-cta { display: flex; gap: 0.75rem; flex-wrap: wrap; }

        .cta-solid {
          padding: 0.875rem 1.75rem;
          background: #FFE566; border: 3px solid #FFE566;
          color: #0A0A0A;
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
          cursor: pointer; transition: all 0.15s;
          box-shadow: 4px 4px 0 rgba(255,229,102,0.25);
        }
        .cta-solid:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 rgba(255,229,102,0.35); }
        .cta-solid:active { transform: translate(1px,1px); box-shadow: 2px 2px 0 rgba(255,229,102,0.2); }

        .cta-ghost {
          padding: 0.875rem 1.75rem;
          background: transparent; border: 3px solid #333;
          color: #888;
          font-family: 'Space Mono', monospace;
          font-size: 0.78rem; font-weight: 700; letter-spacing: 0.08em;
          cursor: pointer; transition: all 0.15s;
        }
        .cta-ghost:hover { border-color: #F5F0E8; color: #F5F0E8; }

        /* HERO RIGHT */
        .hero-right {
          padding: 4rem 2.5rem 4rem 3rem;
          display: flex; align-items: center; justify-content: center;
          background: #0d0d0d;
        }
        .mood-card {
          width: 100%; max-width: 380px;
          border: 3px solid #2a2a2a;
          background: #111;
          display: flex; flex-direction: column; gap: 0;
          box-shadow: 8px 8px 0 #FFE56620;
        }
        .mood-card-header {
          display: flex; align-items: center; gap: 8px;
          padding: 0.75rem 1rem;
          border-bottom: 2px solid #1a1a1a;
          background: #0A0A0A;
        }
        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #FF6666; animation: blink 1.5s ease-in-out infinite; }
        .live-text { font-size: 0.58rem; font-weight: 700; letter-spacing: 0.2em; color: #555; }

        /* Viewfinder */
        .viewfinder {
          position: relative;
          height: 180px;
          background: #060606;
          border-bottom: 2px solid #1a1a1a;
          overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .vf-corner {
          position: absolute; width: 18px; height: 18px;
        }
        .vf-tl { top: 10px; left: 10px; border-top: 2px solid #FFE566; border-left: 2px solid #FFE566; }
        .vf-tr { top: 10px; right: 10px; border-top: 2px solid #FFE566; border-right: 2px solid #FFE566; }
        .vf-bl { bottom: 10px; left: 10px; border-bottom: 2px solid #FFE566; border-left: 2px solid #FFE566; }
        .vf-br { bottom: 10px; right: 10px; border-bottom: 2px solid #FFE566; border-right: 2px solid #FFE566; }
        .vf-scanline {
          position: absolute; width: 100%; height: 1px;
          background: rgba(255,229,102,0.15);
          animation: scan 3s linear infinite;
        }
        @keyframes scan { 0%{top:0%} 100%{top:100%} }
        .vf-face {
          display: flex; flex-direction: column;
          align-items: center; gap: 12px; z-index: 1;
        }
        .vf-face-circle {
          width: 56px; height: 56px; border-radius: 50%;
          border: 2px solid #333;
          background: radial-gradient(circle at 35% 35%, #1a1a1a, #0d0d0d);
          box-shadow: 0 0 20px rgba(255,229,102,0.1);
        }
        .vf-face-bar { width: 80px; height: 2px; background: #222; border-radius: 1px; }
        .vf-face-bar.short { width: 50px; }

        /* Detected mood */
        .detected-row {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.875rem 1rem;
          border-bottom: 2px solid #1a1a1a;
          background: color-mix(in srgb, var(--mc) 8%, #111);
          transition: background 0.4s;
        }
        .detected-label { font-size: 0.52rem; font-weight: 700; letter-spacing: 0.18em; color: #555; flex-shrink: 0; }
        .detected-mood {
          font-size: 1rem; font-weight: 700; letter-spacing: 0.05em;
          color: var(--mc); transition: color 0.4s; flex: 1;
        }
        .detected-bars { display: flex; align-items: flex-end; gap: 2px; flex-shrink: 0; }
        .det-bar {
          width: 3px; border-radius: 1px;
          animation: wave 1s ease-in-out infinite alternate;
        }
        @keyframes wave { from{opacity:.4;transform:scaleY(.6)} to{opacity:1;transform:scaleY(1)} }

        /* Hero mood grid */
        .hero-mood-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 0;
        }
        .hero-mood-chip {
          padding: 0.6rem 0.5rem;
          border-right: 2px solid #1a1a1a;
          border-top: 2px solid #1a1a1a;
          font-size: 0.52rem; font-weight: 700; letter-spacing: 0.1em;
          color: #444; text-align: center;
          transition: all 0.3s;
          cursor: default;
        }
        .hero-mood-chip:nth-child(3n) { border-right: none; }
        .hero-mood-chip.active {
          color: var(--hc);
          background: color-mix(in srgb, var(--hc) 8%, #111);
        }

        /* TICKER */
        .ticker-wrap {
          background: #FFE566;
          overflow: hidden; white-space: nowrap;
          padding: 9px 0;
          border-top: 3px solid #0A0A0A;
          border-bottom: 3px solid #0A0A0A;
        }
        .ticker-rev-wrap { background: #0A0A0A; }
        .ticker-track { display: inline-flex; animation: tickerMove 22s linear infinite; }
        .ticker-rev { animation: tickerMoveRev 18s linear infinite; }
        .ticker-item {
          color: #0A0A0A;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em;
          padding: 0 1.5rem;
          display: inline-flex; align-items: center; gap: 1.5rem;
        }
        .ticker-rev-wrap .ticker-item { color: #F5F0E8; }
        .ticker-dot { font-size: 0.5rem; }
        @keyframes tickerMove { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
        @keyframes tickerMoveRev { from{transform:translateX(-33.333%)} to{transform:translateX(0)} }

        /* HOW IT WORKS */
        .how-section {
          padding: 5rem 2.5rem;
          border-bottom: 3px solid #1a1a1a;
        }
        .how-label {
          font-size: 0.58rem; font-weight: 700; letter-spacing: 0.25em;
          color: #FFE566; margin-bottom: 1rem;
        }
        .how-title {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 700; line-height: 1; letter-spacing: -0.02em;
          margin-bottom: 3.5rem;
        }
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 0;
          border: 3px solid #1a1a1a;
        }
        .step-card {
          padding: 2rem;
          border-right: 3px solid #1a1a1a;
          display: flex; flex-direction: column; gap: 1rem;
          transition: background 0.2s;
        }
        .step-card:last-child { border-right: none; }
        .step-card:hover { background: #111; }
        .step-num { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.2em; color: #FFE566; }
        .step-divider { width: 32px; height: 3px; background: #FFE566; }
        .step-title { font-size: 1rem; font-weight: 700; letter-spacing: 0.05em; }
        .step-desc { font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: #666; line-height: 1.7; }

        /* CTA */
        .cta-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 3px solid #1a1a1a;
        }
        .cta-box {
          padding: 5rem 2.5rem;
          border-right: 3px solid #FFE566;
          display: flex; flex-direction: column; gap: 2rem;
          background: #0d0d0d;
        }
        .cta-tag {
          font-size: 0.55rem; font-weight: 700; letter-spacing: 0.2em; color: #555;
        }
        .cta-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 700; line-height: 1; letter-spacing: -0.02em;
        }
        .cta-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }

        .cta-right {
          padding: 5rem 2.5rem;
          display: flex; align-items: center; justify-content: center;
        }
        .cta-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          border: 3px solid #1a1a1a;
          width: 100%; max-width: 320px;
        }
        .cta-stat {
          padding: 2rem;
          border-right: 3px solid #1a1a1a;
          border-bottom: 3px solid #1a1a1a;
          display: flex; flex-direction: column; gap: 0.5rem;
        }
        .cta-stat:nth-child(2n) { border-right: none; }
        .cta-stat:nth-last-child(-n+2) { border-bottom: none; }
        .cta-stat-n { font-size: 2.5rem; font-weight: 700; color: #FFE566; line-height: 1; }
        .cta-stat-l { font-size: 0.52rem; font-weight: 700; letter-spacing: 0.15em; color: #555; }

        /* FOOTER */
        .land-footer {
          padding: 1.5rem 2.5rem;
          border-top: 3px solid #1a1a1a;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
        }
        .footer-logo { display: flex; align-items: center; gap: 0.75rem; }
        .footer-note { font-size: 0.52rem; font-weight: 700; letter-spacing: 0.15em; color: #333; }

        /* MOBILE */
        @media (max-width: 768px) {
          .land-nav { padding: 1rem 1.5rem; }
          .nav-btn-ghost { display: none; }

          .hero { grid-template-columns: 1fr; min-height: auto; }
          .hero-left { padding: 2.5rem 1.5rem; border-right: none; border-bottom: 3px solid #1a1a1a; gap: 1.5rem; }
          .hero-right { padding: 2rem 1.5rem; }

          .how-section { padding: 3rem 1.5rem; }
          .steps-grid { grid-template-columns: 1fr; }
          .step-card { border-right: none; border-bottom: 3px solid #1a1a1a; }
          .step-card:last-child { border-bottom: none; }

          .cta-section { grid-template-columns: 1fr; }
          .cta-box { padding: 3rem 1.5rem; border-right: none; border-bottom: 3px solid #FFE566; }
          .cta-right { padding: 3rem 1.5rem; }

          .land-footer { padding: 1.5rem; flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 3rem; }
          .cta-title { font-size: 2.5rem; }
          .nav-logo-text { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
}
