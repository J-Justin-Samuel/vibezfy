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
        {/* Left Section - Stacks on top in mobile or hidden */}
        <section
          className="max-md:hidden"
          style={{
            padding: "2rem",
            borderRight: "4px solid #0E0D0B",
            background: "#E8A838",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="brutal-card"
            style={{ padding: "2rem", transform: "rotate(-2deg)" }}
          >
            <h2 style={{ fontSize: "2.5rem", fontWeight: 900 }}>JOIN_VIBZ</h2>
          </div>
        </section>

        {/* Right Section - Form */}
        <section
          style={{
            padding: "2rem 1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "420px" }}>
            <form
              onSubmit={handleSubmit}
              className="brutal-card"
              style={{ padding: "1.5rem" }}
            >
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 800,
                  marginBottom: "1rem",
                }}
              >
                REGISTER_NEW
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
                placeholder="EMAIL"
                required
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="password"
                type="password"
                placeholder="PASS"
                required
                onChange={handleChange}
                style={inputStyle}
              />
              <input
                name="confirm"
                type="password"
                placeholder="CONFIRM"
                required
                onChange={handleChange}
                style={inputStyle}
              />

              <button
                className="brutal-btn"
                style={{ width: "100%", padding: "15px", marginTop: "0.5rem" }}
              >
                SIGN_UP
              </button>

              <p
                style={{
                  marginTop: "1rem",
                  fontWeight: 700,
                  textAlign: "center",
                  fontSize: "0.85rem",
                }}
              >
                MEMBER?{" "}
                <Link to="/login" style={{ color: "#C084FC" }}>
                  LOG_IN
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
  padding: "10px",
  border: "3px solid #0E0D0B",
  marginBottom: "0.8rem",
  fontWeight: 700,
  outline: "none",
  fontSize: "0.9rem",
};
