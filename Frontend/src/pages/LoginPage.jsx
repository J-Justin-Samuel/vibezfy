import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
          .trim() || "Invalid email or password.",
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
          right: -150,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(124,58,237,0.05)",
          filter: "blur(80px)",
          bottom: 100,
          left: -100,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Left branding panel (hidden on mobile) */}
      <div
        id="left-panel"
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
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "3rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: "#6c63ff",
                borderRadius: "0.875rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px rgba(108,99,255,0.4)",
              }}
            >
              <span style={{ fontSize: "1.25rem" }}>🎵</span>
            </div>
            <span
              style={{
                fontFamily: "Clash Display, sans-serif",
                fontSize: "1.75rem",
                fontWeight: 700,
                background: "linear-gradient(135deg,#6c63ff,#a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Vibezfy
            </span>
          </Link>

          <div
            style={{
              position: "relative",
              width: 200,
              height: 200,
              margin: "0 auto 2.5rem",
            }}
          >
            <div
              className="vinyl-spin"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #6c63ff, #4c44c0, #0a0a0f)",
                border: "3px solid #1e1e2e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 28,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 48,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              />
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#6c63ff",
                  boxShadow: "0 0 12px rgba(108,99,255,0.8)",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: "rgba(108,99,255,0.08)",
                animation: "moodPulse 3s ease-in-out infinite",
              }}
            />
          </div>

          <h2
            style={{
              fontFamily: "Clash Display, sans-serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "#e8e8f0",
              marginBottom: "0.75rem",
            }}
          >
            Welcome back
          </h2>
          <p
            style={{
              color: "#6b6b80",
              fontFamily: "DM Sans, sans-serif",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Your mood-powered soundtrack is waiting.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {[
              "😊 Happy",
              "😢 Sad",
              "😠 Angry",
              "😲 Surprised",
              "😐 Neutral",
            ].map((m) => (
              <span
                key={m}
                className="glass"
                style={{
                  padding: "4px 12px",
                  borderRadius: "2rem",
                  fontSize: "0.8rem",
                  color: "#6b6b80",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
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
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
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
            Sign in
          </h1>
          <p
            style={{
              color: "#6b6b80",
              fontFamily: "DM Sans, sans-serif",
              marginBottom: "2rem",
            }}
          >
            No account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#6c63ff",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Sign up free
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
              or email
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
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6c63ff")}
                onBlur={(e) => (e.target.style.borderColor = "#1e1e2e")}
              />
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
                  Signing in...
                </>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 1024px) { #left-panel { display: flex !important; } }
      `}</style>
    </div>
  );
}
