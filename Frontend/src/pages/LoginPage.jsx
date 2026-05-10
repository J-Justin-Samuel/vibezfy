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
      setError("Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F0EBE0",
      }}
    >
      <nav
        style={{
          height: "70px",
          borderBottom: "4px solid #0E0D0B",
          padding: "0 1.5rem",
          display: "flex",
          alignItems: "center",
          background: "white",
          flexShrink: 0,
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#0E0D0B",
            fontWeight: 800,
            fontSize: "1.3rem",
          }}
        >
          VIBEZFY.
        </Link>
      </nav>

      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {/* Left Panel - Hidden on mobile to save space, or shown as a small header */}
        <section
          className="max-md:hidden"
          style={{
            padding: "2rem",
            borderRight: "4px solid #0E0D0B",
            background: "#C084FC",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="brutal-card"
            style={{ padding: "2rem", transform: "rotate(-2deg)" }}
          >
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900 }}>
              WELCOME_BACK
            </h2>
          </div>
        </section>

        {/* Right Panel - Centered Form */}
        <section
          style={{
            padding: "2rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <form
              onSubmit={handleSubmit}
              className="brutal-card"
              style={{ padding: "1.5rem" }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  marginBottom: "1.5rem",
                }}
              >
                SIGN_IN_PROMPT
              </h3>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 800,
                    fontSize: "0.7rem",
                    marginBottom: "5px",
                  }}
                >
                  EMAIL
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="user@vibe.com"
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "3px solid #0E0D0B",
                    fontWeight: 700,
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 800,
                    fontSize: "0.7rem",
                    marginBottom: "5px",
                  }}
                >
                  PASSWORD
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="********"
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "3px solid #0E0D0B",
                    fontWeight: 700,
                    outline: "none",
                  }}
                />
              </div>

              <button
                className="brutal-btn brutal-btn-hover"
                style={{ width: "100%", padding: "15px", marginBottom: "1rem" }}
              >
                LOGIN
              </button>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="brutal-btn brutal-btn-hover"
                style={{
                  width: "100%",
                  padding: "12px",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  fontSize: "0.9rem",
                }}
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  width="18"
                  height="18"
                  alt="Google"
                  style={{ objectFit: "contain" }}
                />
                LOGIN_WITH_GOOGLE
              </button>

              <p
                style={{
                  marginTop: "1.5rem",
                  fontWeight: 700,
                  textAlign: "center",
                  fontSize: "0.85rem",
                }}
              >
                NO_ACCOUNT?{" "}
                <Link to="/signup" style={{ color: "#E8A838" }}>
                  JOIN_US
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
