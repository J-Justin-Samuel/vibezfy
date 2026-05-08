import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PERKS = [
  { icon: "🎭", text: "AI mood detection via camera" },
  { icon: "🎵", text: "Millions of songs via Spotify" },
  { icon: "⚡", text: "Real-time playback & player" },
  { icon: "🔍", text: "Smart search across everything" },
];

export default function SignupPage() {
  const { loginWithGoogle, registerWithEmail } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Please enter your name.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await registerWithEmail(form.email, form.password, form.name.trim());
      navigate("/home");
    } catch (err) {
      setError(
        err.message
          .replace("Firebase: ", "")
          .replace(/\(auth\/.*?\)\.?/, "")
          .trim() || "Could not create account. Try again.",
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

  const inputStyle = {
    width: "100%",
    background: "#16161f",
    border: "1px solid #1e1e2e",
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    color: "#e8e8f0",
    fontFamily: "DM Sans, sans-serif",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Bg orbs */}
      <div
        style={{
          position: "fixed",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(108,99,255,0.07)",
          filter: "blur(100px)",
          top: -150,
          left: -150,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(56,189,248,0.04)",
          filter: "blur(80px)",
          bottom: 50,
          right: -100,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Left form panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              marginBottom: "2.5rem",
              textDecoration: "none",
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
          </Link>

          <h1
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontSize: "2rem",
              fontWeight: 700,
              color: "#e8e8f0",
              marginBottom: "0.4rem",
            }}
          >
            Create account
          </h1>
          <p
            style={{
              color: "#6b6b80",
              fontFamily: "DM Sans, sans-serif",
              marginBottom: "2rem",
            }}
          >
            Already have one?{" "}
            <Link
              to="/login"
              style={{
                color: "#6c63ff",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Sign in
            </Link>
          </p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "0.8rem 1.5rem",
              borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #1e1e2e",
              color: "#e8e8f0",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "border-color 0.2s",
              marginBottom: "1.5rem",
            }}
            onMouseEnter={(e) => {
              if (!loading)
                e.currentTarget.style.borderColor = "rgba(108,99,255,0.4)";
            }}
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "#1e1e2e")
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
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
            Continue with Google
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "#1e1e2e" }} />
            <span
              style={{
                color: "#6b6b80",
                fontSize: "0.8rem",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              or with email
            </span>
            <div style={{ flex: 1, height: 1, background: "#1e1e2e" }} />
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#6b6b80",
                  marginBottom: 6,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Name
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#6b6b80",
                  marginBottom: 6,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#6b6b80",
                  marginBottom: 6,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  color: "#6b6b80",
                  marginBottom: 6,
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                Confirm password
              </label>
              <input
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{
                  ...inputStyle,
                  borderColor:
                    form.confirm && form.confirm !== form.password
                      ? "rgba(248,113,113,0.5)"
                      : "#1e1e2e",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
                onBlur={(e) =>
                  (e.target.style.borderColor =
                    form.confirm && form.confirm !== form.password
                      ? "rgba(248,113,113,0.5)"
                      : "#1e1e2e")
                }
              />
              {form.confirm && form.confirm !== form.password && (
                <p
                  style={{
                    color: "#f87171",
                    fontSize: "0.78rem",
                    marginTop: 4,
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  Passwords don't match
                </p>
              )}
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  borderRadius: "0.75rem",
                  padding: "0.75rem 1rem",
                  color: "#f87171",
                  fontSize: "0.875rem",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.25rem",
              }}
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />{" "}
                  Creating account...
                </>
              ) : (
                "Create account →"
              )}
            </button>

            <p
              style={{
                color: "#6b6b80",
                fontSize: "0.75rem",
                textAlign: "center",
                fontFamily: "DM Sans, sans-serif",
                marginTop: "0.25rem",
              }}
            >
              By signing up you agree to our terms of service
            </p>
          </form>
        </div>
      </div>

      {/* Right perks panel (hidden on mobile) */}
      <div
        id="right-panel"
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem",
          position: "relative",
          zIndex: 1,
          display: "none",
        }}
      >
        <div style={{ maxWidth: 380 }}>
          <div style={{ marginBottom: "3rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.3)",
                borderRadius: "2rem",
                padding: "0.4rem 1rem",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "0.8rem",
                color: "#a78bfa",
                marginBottom: "1.5rem",
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
              Free forever
            </div>
            <h2
              style={{
                fontFamily: "Clash Display, sans-serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#e8e8f0",
                marginBottom: "0.75rem",
              }}
            >
              Everything you need to feel the music
            </h2>
            <p
              style={{
                color: "#6b6b80",
                fontFamily: "DM Sans, sans-serif",
                lineHeight: 1.6,
              }}
            >
              No credit card. No premium tier. Just vibes.
            </p>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {PERKS.map(({ icon, text }) => (
              <div
                key={text}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "0.75rem",
                    background: "rgba(108,99,255,0.1)",
                    border: "1px solid rgba(108,99,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <p
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    color: "#e8e8f0",
                    fontWeight: 500,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* Mood preview strip */}
          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {[
              { emoji: "😊", color: "#fbbf24", label: "Happy" },
              { emoji: "😢", color: "#60a5fa", label: "Sad" },
              { emoji: "😠", color: "#f87171", label: "Angry" },
              { emoji: "😲", color: "#a78bfa", label: "Surprised" },
              { emoji: "😨", color: "#34d399", label: "Calm" },
              { emoji: "😐", color: "#94a3b8", label: "Neutral" },
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: `${m.color}10`,
                  border: `1px solid ${m.color}30`,
                  borderRadius: "2rem",
                  padding: "4px 10px",
                  fontSize: "0.78rem",
                  fontFamily: "DM Sans, sans-serif",
                  color: m.color,
                }}
              >
                {m.emoji} {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) { #right-panel { display: flex !important; } }
      `}</style>
    </div>
  );
}
