import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const TICKER_ITEMS = [
  "FEEL THE MUSIC",
  "READ YOUR MOOD",
  "SPOTIFY POWERED",
  "AI DETECTION",
  "VIBE OR DIE",
  "POINT CAMERA",
  "GET PLAYLIST",
];

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(form.email, form.password);
      navigate("/home");
    } catch (err) {
      setError(
        err.message
          .replace("Firebase: ", "")
          .replace(/\(auth\/.*?\)\.?/, "")
          .trim() || "Wrong email or password. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/home");
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(
          err.message
            .replace("Firebase: ", "")
            .replace(/\(auth\/.*?\)\.?/, "")
            .trim(),
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* TOP TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="ticker-item">
              {t} <span className="ticker-dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="login-grid">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <Link to="/" className="logo-block">
            <div className="logo-icon-box">V</div>
            <span className={`logo-text ${glitch ? "glitch" : ""}`}>
              VIBEZFY
            </span>
          </Link>

          <div className="left-tagline">
            <div className="tagline-line">MUSIC</div>
            <div className="tagline-line accent">THAT</div>
            <div className="tagline-line">FEELS</div>
            <div className="tagline-line stroke">YOU.</div>
          </div>

          <div className="mood-grid">
            {[
              { l: "HAPPY", c: "#FFE566" },
              { l: "SAD", c: "#66AAFF" },
              { l: "ANGRY", c: "#FF6666" },
              { l: "SURPRISED", c: "#CC88FF" },
              { l: "CALM", c: "#66FFCC" },
              { l: "NEUTRAL", c: "#AAAAAA" },
            ].map(({ l, c }) => (
              <div key={l} className="mood-chip" style={{ "--chip-color": c }}>
                <span className="mood-label">{l}</span>
              </div>
            ))}
          </div>

          <div className="left-footer">
            AI READS YOUR FACE.
            <br />
            SPOTIFY PLAYS THE VIBE.
            <br />
            NO SKIPS NEEDED.
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="form-header">
            <div className="form-tag">SIGN IN</div>
            <h2 className="form-title">
              WELCOME
              <br />
              BACK_
            </h2>
            <p className="form-sub">
              No account?{" "}
              <Link to="/signup" className="form-link">
                CREATE ONE →
              </Link>
            </p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="google-btn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              style={{ flexShrink: 0 }}
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            CONTINUE WITH GOOGLE
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">OR</span>
            <div className="divider-line" />
          </div>

          <form onSubmit={handleSubmit} className="email-form">
            <div
              className={`field-wrap ${focused === "email" ? "field-active" : ""}`}
            >
              <label className="field-label">EMAIL_</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="field-input"
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
              />
            </div>

            <div
              className={`field-wrap ${focused === "password" ? "field-active" : ""}`}
            >
              <label className="field-label">PASSWORD_</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="field-input"
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
              />
            </div>

            {error && (
              <div className="error-block">
                <span className="error-icon">!</span>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  SIGNING IN...
                </span>
              ) : (
                "SIGN IN →"
              )}
            </button>
          </form>

          <p className="bottom-note">POWERED BY FIREBASE + SPOTIFY</p>
        </div>
      </div>

      {/* BOTTOM TICKER */}
      <div className="ticker-wrap ticker-bottom">
        <div className="ticker-track ticker-reverse">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="ticker-item">
              {t} <span className="ticker-dot">◆</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');

        /* Lock page to viewport — no scroll on desktop */
        .login-root {
          height: 100dvh;
          background: #F5F0E8;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          font-family: 'Space Mono', monospace;
        }

        /* TICKER */
        .ticker-wrap {
          background: #0A0A0A;
          overflow: hidden;
          white-space: nowrap;
          padding: 7px 0;
          flex-shrink: 0;
          border-bottom: 3px solid #0A0A0A;
        }
        .ticker-bottom {
          border-bottom: none;
          border-top: 3px solid #0A0A0A;
          flex-shrink: 0;
        }
        .ticker-track {
          display: inline-flex;
          animation: tickerMove 25s linear infinite;
        }
        .ticker-reverse {
          animation: tickerMoveReverse 20s linear infinite;
        }
        .ticker-item {
          color: #F5F0E8;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          padding: 0 1.25rem;
          display: inline-flex;
          align-items: center;
          gap: 1.25rem;
        }
        .ticker-dot { color: #FFE566; font-size: 0.5rem; }

        @keyframes tickerMove {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @keyframes tickerMoveReverse {
          from { transform: translateX(-33.333%); }
          to   { transform: translateX(0); }
        }

        /* GRID — fills remaining height exactly */
        .login-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          flex: 1;
          min-height: 0;
          overflow: hidden;
        }

        /* LEFT PANEL */
        .left-panel {
          background: #0A0A0A;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          border-right: 3px solid #FFE566;
          overflow: hidden;
        }

        .logo-block {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon-box {
          width: 38px;
          height: 38px;
          background: #FFE566;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 700;
          color: #0A0A0A;
          border: 2px solid #FFE566;
          flex-shrink: 0;
        }
        .logo-text {
          font-size: 1.35rem;
          font-weight: 700;
          color: #F5F0E8;
          letter-spacing: 0.05em;
        }
        .logo-text.glitch {
          animation: glitch 0.2s steps(1) forwards;
        }
        @keyframes glitch {
          0%   { transform: translate(0);         color: #F5F0E8; }
          20%  { transform: translate(-3px, 1px); color: #FFE566; }
          40%  { transform: translate(3px, -1px); color: #FF6666; }
          60%  { transform: translate(-2px, 0);   color: #66AAFF; }
          80%  { transform: translate(2px, 1px);  color: #F5F0E8; }
          100% { transform: translate(0);         color: #F5F0E8; }
        }

        .left-tagline {
          display: flex;
          flex-direction: column;
          line-height: 1;
          flex-shrink: 0;
        }
        .tagline-line {
          font-size: clamp(1.6rem, 2.8vw, 3.5rem);
          font-weight: 700;
          color: #F5F0E8;
          letter-spacing: -0.02em;
        }
        .tagline-line.accent { color: #FFE566; }
        .tagline-line.stroke {
          color: transparent;
          -webkit-text-stroke: 2px #F5F0E8;
        }

        .mood-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 5px;
          flex-shrink: 0;
        }
        .mood-chip {
          border: 2px solid var(--chip-color);
          padding: 0.45rem 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          transition: background 0.15s;
        }
        .mood-chip:hover { background: var(--chip-color); }
        .mood-label {
          font-size: 0.48rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--chip-color);
        }
        .mood-chip:hover .mood-label { color: #0A0A0A; }

        .left-footer {
          font-size: 0.58rem;
          font-weight: 700;
          color: rgba(245,240,232,0.22);
          letter-spacing: 0.12em;
          line-height: 2;
          border-top: 1px solid rgba(245,240,232,0.1);
          padding-top: 1rem;
          margin-top: auto;
        }

        /* RIGHT PANEL */
        .right-panel {
          background: #F5F0E8;
          padding: 2rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: center;
          overflow: hidden;
        }

        .form-header { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }

        .form-tag {
          display: inline-block;
          background: #0A0A0A;
          color: #FFE566;
          font-size: 0.58rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          padding: 3px 10px;
          align-self: flex-start;
        }
        .form-title {
          font-size: clamp(1.75rem, 3.5vw, 3.25rem);
          font-weight: 700;
          color: #0A0A0A;
          line-height: 1;
          letter-spacing: -0.03em;
          margin: 4px 0 0;
        }
        .form-sub {
          font-family: 'DM Sans', sans-serif;
          color: #666;
          font-size: 0.82rem;
          margin: 0;
        }
        .form-link {
          color: #0A0A0A;
          font-weight: 700;
          text-decoration: none;
          border-bottom: 2px solid #0A0A0A;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
        }
        .form-link:hover { background: #0A0A0A; color: #FFE566; padding: 0 4px; }

        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 0.7rem 1rem;
          background: #fff;
          border: 3px solid #0A0A0A;
          color: #0A0A0A;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 4px 4px 0 #0A0A0A;
          flex-shrink: 0;
        }
        .google-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #0A0A0A; }
        .google-btn:active:not(:disabled) { transform: translate(2px,2px); box-shadow: 2px 2px 0 #0A0A0A; }
        .google-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .divider { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
        .divider-line { flex: 1; height: 2px; background: #0A0A0A; }
        .divider-text { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.2em; color: #0A0A0A; }

        .email-form { display: flex; flex-direction: column; gap: 0.65rem; }

        .field-wrap {
          border: 3px solid #0A0A0A;
          background: #fff;
          transition: box-shadow 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .field-wrap.field-active {
          box-shadow: 4px 4px 0 #0A0A0A;
          transform: translate(-2px, -2px);
        }
        .field-label {
          display: block;
          font-size: 0.52rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          padding: 4px 10px 0;
          background: #0A0A0A;
          color: #FFE566;
        }
        .field-input {
          width: 100%;
          padding: 0.5rem 0.75rem 0.6rem;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Space Mono', monospace;
          font-size: 0.88rem;
          color: #0A0A0A;
          box-sizing: border-box;
        }
        .field-input::placeholder { color: #aaa; }

        .error-block {
          display: flex;
          align-items: flex-start;
          gap: 0.65rem;
          background: #FF6666;
          border: 3px solid #0A0A0A;
          padding: 0.55rem 0.875rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          color: #0A0A0A;
          font-weight: 600;
          box-shadow: 4px 4px 0 #0A0A0A;
        }
        .error-icon {
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          background: #0A0A0A;
          color: #FF6666;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 0.8rem;
        }

        .submit-btn {
          width: 100%;
          padding: 0.8rem;
          background: #0A0A0A;
          color: #FFE566;
          border: 3px solid #0A0A0A;
          font-family: 'Space Mono', monospace;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.15);
        }
        .submit-btn:hover:not(:disabled) {
          background: #FFE566;
          color: #0A0A0A;
          transform: translate(-2px,-2px);
          box-shadow: 6px 6px 0 #0A0A0A;
        }
        .submit-btn:active:not(:disabled) { transform: translate(2px,2px); box-shadow: 2px 2px 0 #0A0A0A; }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-loading { display: flex; align-items: center; justify-content: center; gap: 0.65rem; }
        .spinner {
          width: 13px; height: 13px;
          border: 2px solid rgba(255,229,102,0.3);
          border-top-color: #FFE566;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .bottom-note {
          font-size: 0.52rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: rgba(10,10,10,0.18);
          text-align: center;
          margin: 0;
          flex-shrink: 0;
        }

        /* MOBILE — stack vertically, allow natural scroll */
        @media (max-width: 767px) {
          .login-root {
            height: auto;
            min-height: 100dvh;
            overflow-y: auto;
          }

          .login-grid {
            grid-template-columns: 1fr;
            overflow: visible;
            flex: none;
          }

          .left-panel {
            border-right: none;
            border-bottom: 3px solid #FFE566;
            padding: 1.5rem;
            gap: 1rem;
          }

          .left-tagline {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0 0.4rem;
          }

          .tagline-line { font-size: clamp(1.75rem, 8vw, 2.5rem); }

          .mood-grid { grid-template-columns: repeat(6, 1fr); gap: 4px; }
          .mood-chip { padding: 6px 2px; }
          .mood-label { font-size: 0.42rem; }

          .left-footer { display: none; }

          .right-panel {
            padding: 1.5rem;
            gap: 0.9rem;
            justify-content: flex-start;
            overflow: visible;
          }

          .form-title { font-size: clamp(1.75rem, 7vw, 2.25rem); }
        }
      `}</style>
    </div>
  );
}
