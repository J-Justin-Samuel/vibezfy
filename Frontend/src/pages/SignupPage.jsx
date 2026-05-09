import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("PASSWORDS_MISMATCH");
    setError("");
    setLoading(true);
    try {
      await registerWithEmail(form.email, form.password, form.name);
      navigate("/home");
    } catch (err) {
      setError("REGISTRATION_FAILED");
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
        }}
      >
        {/* Left Content (Hidden on small mobile for focus) */}
        <section
          style={{
            padding: "3rem 2rem",
            borderRight: "4px solid #0E0D0B",
            background: "#E8A838",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              fontSize: "3.5rem",
              fontWeight: 900,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Start <br /> Vibeing.
          </h2>
          <ul style={{ listStyle: "none", marginTop: "2rem", padding: 0 }}>
            {[
              "01 AI MOOD READING",
              "02 SPOTIFY CONNECT",
              "03 PRIVACY INSIDE",
            ].map((perk) => (
              <li
                key={perk}
                className="brutal-card"
                style={{
                  padding: "10px",
                  marginBottom: "10px",
                  fontWeight: 800,
                  background: "white",
                  width: "fit-content",
                }}
              >
                {perk}
              </li>
            ))}
          </ul>
        </section>

        {/* Signup Form */}
        <section
          style={{
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "420px" }}>
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
                CREATE_USER_01
              </h3>

              <input
                name="name"
                placeholder="FULL_NAME"
                required
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="email"
                type="email"
                placeholder="EMAIL_ADDR"
                required
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="password"
                type="password"
                placeholder="PASSWORD"
                required
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="confirm"
                type="password"
                placeholder="CONFIRM_PASS"
                required
                onChange={handleChange}
                style={inputStyle}
              />

              {error && (
                <div
                  style={{
                    background: "#F87171",
                    border: "3px solid #0E0D0B",
                    padding: "10px",
                    marginBottom: "1rem",
                    fontWeight: 800,
                  }}
                >
                  {error}
                </div>
              )}

              <button
                className="brutal-btn"
                style={{ width: "100%", padding: "15px", fontSize: "1.1rem" }}
                disabled={loading}
              >
                {loading ? "CREATING..." : "JOIN THE VIBE →"}
              </button>

              <p
                style={{
                  marginTop: "1.5rem",
                  fontWeight: 700,
                  textAlign: "center",
                }}
              >
                MEMBER?{" "}
                <Link to="/login" style={{ color: "#C084FC" }}>
                  SIGN_IN
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "3px solid #0E0D0B",
  marginBottom: "1rem",
  fontWeight: 700,
  outline: "none",
  background: "white",
};
