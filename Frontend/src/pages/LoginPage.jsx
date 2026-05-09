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
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F0EBE0",
        overflow: "hidden",
      }}
    >
      {/* Navbar for consistency */}
      <nav
        style={{
          height: "70px",
          borderBottom: "4px solid #0E0D0B",
          padding: "0 2rem",
          display: "flex",
          alignItems: "center",
          background: "white",
        }}
      >
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "#0E0D0B",
            fontWeight: 800,
            fontSize: "1.5rem",
          }}
        >
          VIBEZFY.
        </Link>
      </nav>

      <main
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          overflowY: "auto",
        }}
      >
        {/* Left Visual Panel */}
        <section
          style={{
            padding: "4rem 2rem",
            borderRight: "4px solid #0E0D0B",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: "#C084FC",
          }}
        >
          <div
            className="brutal-card"
            style={{ padding: "2rem", transform: "rotate(-2deg)" }}
          >
            <h2 style={{ fontSize: "3rem", fontWeight: 900, lineHeight: 1 }}>
              WELCOME <br /> BACK.
            </h2>
            <p style={{ fontWeight: 700, marginTop: "1rem" }}>
              Your playlists are waiting for your face.
            </p>
          </div>
        </section>

        {/* Right Form Panel */}
        <section
          style={{
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <form
              onSubmit={handleSubmit}
              className="brutal-card"
              style={{ padding: "2rem" }}
            >
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  marginBottom: "1.5rem",
                }}
              >
                LOGIN_TO_VIBE
              </h3>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    marginBottom: "5px",
                  }}
                >
                  EMAIL_ADDR
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="brutal-input"
                  placeholder="name@email.com"
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
                    fontSize: "0.8rem",
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

              {error && (
                <div
                  style={{
                    background: "#F87171",
                    border: "2px solid #0E0D0B",
                    padding: "10px",
                    marginBottom: "1rem",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                className="brutal-btn"
                style={{ width: "100%", padding: "15px", marginBottom: "1rem" }}
                disabled={loading}
              >
                {loading ? "AUTHENTICATING..." : "SIGN IN →"}
              </button>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="brutal-btn"
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg"
                  width="18"
                  alt="G"
                />
                GOOGLE LOGIN
              </button>

              <p
                style={{
                  marginTop: "1.5rem",
                  fontWeight: 700,
                  textAlign: "center",
                  fontSize: "0.9rem",
                }}
              >
                NEW HERE?{" "}
                <Link to="/signup" style={{ color: "#E8A838" }}>
                  CREATE_ACCOUNT
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
